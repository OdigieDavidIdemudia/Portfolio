/**
 * terminal.js — Single source of truth for all CLI command output.
 * Command handlers in Terminal.jsx read exclusively from this file.
 */

import { projects as rawProjects } from './projects';
import { certificationGroups } from './certifications';

// ─── Profile ────────────────────────────────────────────────────────────────
export const profile = {
    name: "David Idemudia Odigie",
    handle: "idemudia",
    host: "d10.sec",
    tagline: "Security Engineer · Detection · Automation · Infrastructure",
    bio: [
        "Cybersecurity Analyst and Software Developer bridging the gap between",
        "offensive security knowledge and defensive software engineering.",
        "Focused on SOC tooling, detection engineering, and secure systems design.",
    ],
    location: "United Kingdom",
    status: "Open to opportunities",
    stats: {
        experience: "3+ years development",
        projects: "50+ projects shipped",
    },
};

// ─── Skills ─────────────────────────────────────────────────────────────────
export const skills = {
    security: [
        "SIEM & Log Analysis",
        "Network Security",
        "Threat Intelligence",
        "Incident Response",
        "Digital Forensics",
        "Wireshark",
        "Burp Suite",
        "Vulnerability Assessment",
    ],
    development: [
        "Python / FastAPI",
        "React / Vue.js",
        "Node.js / C#/.NET",
        "Go",
        "Docker / Linux",
        "Git",
        "REST APIs / GraphQL",
        "SQLite / PostgreSQL",
    ],
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const projects = rawProjects.map((p) => ({
    id: p.id,
    name: p.title,
    status: p.status || "active",
    description: p.impactStatement,
    tags: p.techStack.slice(0, 5),
    github: p.links?.github || "#",
    live: p.links?.live || "#",
}));

// ─── Certifications ──────────────────────────────────────────────────────────
export const certifications = certificationGroups.map((group) => ({
    group: group.label,
    items: group.certifications.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        date: c.date,
        status: c.status, // "Active" | "Validated" | "In View"
    })),
}));

// ─── Contact ─────────────────────────────────────────────────────────────────
export const contact = {
    email: "David.odigie.ide@gmail.com",
    github: "https://github.com/OdigieDavidIdemudia",
    linkedin: "https://linkedin.com/in/david-odigie",
};

// ─── LS File Listing ──────────────────────────────────────────────────────────
export const lsEntries = [
    { perm: "-rw-r--r--", name: "about.txt",    type: "file" },
    { perm: "-rw-r--r--", name: "skills.txt",   type: "file" },
    { perm: "drwxr-xr-x", name: "projects/",    type: "dir"  },
    { perm: "-rw-r--r--", name: "certs.txt",    type: "file" },
    { perm: "-rw-r--r--", name: "contact.txt",  type: "file" },
    { perm: "-rwxr-xr-x", name: "resume.sh",    type: "exec" },
];
