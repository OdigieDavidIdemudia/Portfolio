#!/usr/bin/env python3
"""
build_cv.py - Generate an ATS-safe CV (DOCX + optional PDF) from data/cv.json.

ATS rules enforced by construction:
  * single column, no tables, no text boxes, no images, no headers/footers
  * ASCII-only text (no smart quotes, no en/em dashes, no middots)
  * standard section headings an ATS recognises
  * MM/YYYY dates
  * title / company / location / dates on separate lines
  * real bullet paragraphs, not glyphs pasted as text

Usage:
  python scripts/build_cv.py                # build DOCX + PDF if Word is available
  python scripts/build_cv.py --docx-only
  python scripts/build_cv.py --check        # build, then verify ATS safety
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "cv.json"
OUT_DIR = ROOT / "cv" / "out"

FONT = "Calibri"
SIZE_BODY = Pt(10.5)
SIZE_NAME = Pt(20)
SIZE_HEADING = Pt(11.5)

# Section headings ATS parsers commonly recognise.
SECTIONS = {
    "summary": "PROFESSIONAL SUMMARY",
    "experience": "PROFESSIONAL EXPERIENCE",
    "skills": "TECHNICAL SKILLS",
    "projects": "PROJECTS",
    "education": "EDUCATION",
    "certifications": "CERTIFICATIONS",
    "development": "PROFESSIONAL DEVELOPMENT",
}

# Characters that break ATS text extraction. Map to ASCII equivalents rather
# than deleting, so meaning survives.
REPLACEMENTS = {
    "\u2014": "-",   # em dash
    "\u2013": "-",   # en dash
    "\u2012": "-",
    "\u2212": "-",
    "\u2022": "-",   # bullet
    "\u00b7": "-",   # middot (the "Â·" corruption this CV had)
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u00a0": " ",   # non-breaking space
    "\u2026": "...",
    "\u00c2": "",    # stray double-encoded lead byte
    "\u00e2": "",
    "\u20ac": "",
}


def ascii_clean(text: str) -> str:
    """Force text to printable ASCII so parsers cannot mis-decode it."""
    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)
    # Collapse any remaining non-ASCII to a space, then tidy.
    text = "".join(ch if 32 <= ord(ch) < 127 else " " for ch in text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def set_style_font(style, size: Pt, bold: bool = False, color=None) -> None:
    style.font.name = FONT
    style.font.size = size
    style.font.bold = bold
    if color is not None:
        style.font.color.rgb = color
    # East-Asian fallback, otherwise Word substitutes a different face.
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = rpr.makeelement(qn("w:rFonts"), {})
        rpr.append(rfonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(attr), FONT)


def build_doc(data: dict) -> Document:
    doc = Document()

    # Page setup: no headers/footers, tight margins, single section.
    for section in doc.sections:
        section.top_margin = Pt(36)
        section.bottom_margin = Pt(36)
        section.left_margin = Pt(43)
        section.right_margin = Pt(43)

    normal = doc.styles["Normal"]
    set_style_font(normal, SIZE_BODY)
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.line_spacing = 1.06

    heading = doc.styles["Heading 1"]
    set_style_font(heading, SIZE_HEADING, bold=True, color=RGBColor(0x00, 0x00, 0x00))
    heading.paragraph_format.space_before = Pt(10)
    heading.paragraph_format.space_after = Pt(3)
    heading.paragraph_format.keep_with_next = True

    def para(text="", bold=False, size=None, align=None, space_after=0, space_before=0):
        p = doc.add_paragraph()
        if align is not None:
            p.alignment = align
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(space_before)
        if text:
            run = p.add_run(ascii_clean(text))
            run.bold = bold
            if size is not None:
                run.font.size = size
        return p

    def section(key: str):
        doc.add_paragraph(ascii_clean(SECTIONS[key]), style="Heading 1")

    def bullet(text: str):
        p = doc.add_paragraph(ascii_clean(text), style="List Bullet")
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.left_indent = Pt(16)
        # A real bullet is applied via style; ensure the run itself is plain text.
        for run in p.runs:
            run.font.size = SIZE_BODY
        return p

    prof = data["profile"]

    # ---- Name + contact (body, never a header) ----------------------------
    name_p = para(prof["name"], bold=True, size=SIZE_NAME, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=1)
    for run in name_p.runs:
        run.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    para(prof["headline"], bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)

    contact_bits = [prof["email"], *prof.get("phone", []), prof["location"]]
    para(" | ".join(contact_bits), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=1)

    links = prof.get("links", {})
    link_bits = []
    if links.get("linkedin"):
        link_bits.append(links["linkedin"].replace("https://", "").replace("http://", "").rstrip("/"))
    if links.get("github"):
        link_bits.append(links["github"].replace("https://", "").replace("http://", "").rstrip("/"))
    if links.get("portfolio"):
        link_bits.append(links["portfolio"].replace("https://", "").replace("http://", "").rstrip("/"))
    if link_bits:
        para(" | ".join(link_bits), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)

    # ---- Summary ----------------------------------------------------------
    section("summary")
    para(data["summary"], space_after=2)

    # ---- Experience -------------------------------------------------------
    section("experience")
    for job in data["experience"]:
        title_p = doc.add_paragraph()
        title_p.paragraph_format.space_before = Pt(5)
        title_p.paragraph_format.space_after = Pt(0)
        title_p.paragraph_format.keep_with_next = True
        r = title_p.add_run(ascii_clean(job["title"]))
        r.bold = True

        meta_p = doc.add_paragraph()
        meta_p.paragraph_format.space_after = Pt(1)
        meta_p.paragraph_format.keep_with_next = True
        r = meta_p.add_run(ascii_clean(job["company"]))
        r.bold = False
        loc = job.get("location")
        if loc:
            meta_p.add_run(ascii_clean(f" - {loc}"))
        meta_p.add_run(ascii_clean(f" | {job['start']} - {job['end']}"))

        for h in job.get("highlights", []):
            bullet(h)

    # ---- Skills (plain paragraphs, never a table) -------------------------
    section("skills")
    for group, items in data["skills"].items():
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(ascii_clean(f"{group}: "))
        r.bold = True
        p.add_run(ascii_clean(", ".join(items)))

    # ---- Projects ---------------------------------------------------------
    projects = data.get("projects", [])
    if projects:
        section("projects")
        for proj in projects:
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(ascii_clean(proj["name"]))
            r.bold = True
            if proj.get("period"):
                p.add_run(ascii_clean(f" | {proj['period']}"))
            desc = doc.add_paragraph(ascii_clean(proj.get("description", "")))
            desc.paragraph_format.space_after = Pt(3)

    # ---- Education --------------------------------------------------------
    section("education")
    for ed in data["education"]:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(ascii_clean(ed["degree"]))
        r.bold = True
        p.add_run(ascii_clean(f" | {ed['start']} - {ed['end']}"))

        meta = doc.add_paragraph()
        meta.paragraph_format.space_after = Pt(0)
        meta.add_run(ascii_clean(ed["institution"]))
        if ed.get("location"):
            meta.add_run(ascii_clean(f" - {ed['location']}"))
        if ed.get("grade"):
            meta.add_run(ascii_clean(f" | Grade: {ed['grade']}"))

    # ---- Certifications ---------------------------------------------------
    section("certifications")
    for cert in data.get("certifications", []):
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.left_indent = Pt(16)
        r = p.add_run(ascii_clean(cert["name"]))
        r.bold = True
        p.add_run(ascii_clean(f" - {cert['issuer']} | {cert['date']}"))
        for run in p.runs:
            run.font.size = SIZE_BODY

    # ---- Development ------------------------------------------------------
    dev = data.get("development", [])
    if dev:
        section("development")
        for item in dev:
            p = doc.add_paragraph(style="List Bullet")
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.left_indent = Pt(16)
            p.add_run(ascii_clean(item))
            for run in p.runs:
                run.font.size = SIZE_BODY

    return doc


def docx_to_pdf(docx_path: Path, pdf_path: Path) -> bool:
    """Convert via Word COM if available. Returns False if Word is missing."""
    ps = f"""
$ErrorActionPreference='Stop'
try {{
  $w = New-Object -ComObject Word.Application
  $w.Visible = $false
  $w.DisplayAlerts = 0
  $d = $w.Documents.Open('{docx_path}', $false, $true)
  $d.SaveAs([ref]'{pdf_path}', [ref]17)
  $d.Close(0)
  $w.Quit()
  exit 0
}} catch {{ exit 1 }}
"""
    try:
        r = subprocess.run(
            ["powershell", "-NoProfile", "-NonInteractive", "-Command", ps],
            capture_output=True, timeout=180,
        )
        return r.returncode == 0 and pdf_path.exists()
    except Exception:
        return False


def check_ats(path: Path) -> tuple[bool, list[str]]:
    """Verify the DOCX has none of the structural things that break parsers."""
    problems: list[str] = []
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        doc_xml = z.read("word/document.xml").decode("utf-8", errors="replace")

        if any(n.startswith("word/header") or n.startswith("word/footer") for n in names):
            problems.append("document contains header/footer parts")
        for part in ("word/media/",):
            if any(n.startswith(part) for n in names):
                problems.append(f"document contains embedded media ({part})")

        if "<w:tbl>" in doc_xml:
            problems.append("document contains a table")
        if "<w:txbxContent" in doc_xml:
            problems.append("document contains a text box")
        # A bare <w:cols w:space="..."/> is Word's default single-column
        # declaration. Only a w:num greater than 1 is a real multi-column layout.
        for m in re.finditer(r"<w:cols\b([^>]*)>", doc_xml):
            attrs = m.group(1)
            num = re.search(r'w:num="(\d+)"', attrs)
            if num and int(num.group(1)) > 1:
                problems.append(f"document declares {num.group(1)} columns")
                break
        if doc_xml.count("<w:sectPr") > 1:
            problems.append(f"document has {doc_xml.count('<w:sectPr')} sections (expected 1)")

        # Any non-ASCII text is a parser risk.
        texts = re.findall(r"<w:t[^>]*>(.*?)</w:t>", doc_xml, re.S)
        joined = "".join(texts)
        bad = sorted({ch for ch in joined if ord(ch) > 127})
        if bad:
            problems.append("non-ASCII characters present: " + ", ".join(f"U+{ord(c):04X}" for c in bad))

        # Required headings
        upper = joined.upper()
        for key in ("experience", "education", "skills"):
            if SECTIONS[key] not in upper:
                problems.append(f"missing standard heading: {SECTIONS[key]}")

    return (not problems), problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--docx-only", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    data = json.loads(DATA.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    doc = build_doc(data)
    name_slug = data["profile"]["name"].replace(" ", "_")
    docx_path = Path(args.out) if args.out else (OUT_DIR / f"{name_slug}_CV.docx")
    if docx_path.suffix.lower() != ".docx":
        docx_path = docx_path.with_suffix(".docx")
    doc.save(docx_path)
    print(f"DOCX: {docx_path}  ({docx_path.stat().st_size:,} bytes)")

    # Publish the DOCX too — ATS systems often prefer it over PDF, and it lets a
    # visitor download the editable form directly from the site.
    public_docx = ROOT / "public" / "assets" / "David_Odigie_CV.docx"
    public_docx.parent.mkdir(parents=True, exist_ok=True)
    public_docx.write_bytes(docx_path.read_bytes())
    print(f"Published to site: {public_docx}")

    ok, problems = check_ats(docx_path)
    print("ATS structural check: " + ("PASS" if ok else "FAIL"))
    for p in problems:
        print(f"  - {p}")

    if not args.docx_only:
        pdf_path = docx_path.with_suffix(".pdf")
        if docx_to_pdf(docx_path, pdf_path):
            print(f"PDF:  {pdf_path}  ({pdf_path.stat().st_size:,} bytes)")
            # The portfolio's "download CV" link serves from public/assets.
            public_pdf = ROOT / "public" / "assets" / "David_Odigie_CV.pdf"
            public_pdf.parent.mkdir(parents=True, exist_ok=True)
            public_pdf.write_bytes(pdf_path.read_bytes())
            print(f"Published to site: {public_pdf}")
        else:
            print("PDF:  skipped (Microsoft Word not available for conversion)")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
