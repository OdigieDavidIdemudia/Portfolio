import { Shield, LayoutDashboard, Terminal, Globe, Bot, ClipboardList, Network, Radar, Puzzle, KeyRound, ShieldCheck } from 'lucide-react';
import generated from './generated-projects.json';

/**
 * Curated presentation entries. These are hand-written and are NOT overwritten
 * by the GitHub sync — the sync only appends projects that are not already
 * represented here. Content (descriptions, dates) is owned by data/cv.json;
 * this array owns how a project is *presented* on the site.
 */
const curatedProjects = [
    {
        id: "rolehunter",
        title: "RoleHunter",
        impactStatement: "AI-powered job hunting automation platform that autonomously scans job boards, scores listings against your CV, and sends personalised pitch emails — all on autopilot",
        problemSolved: "Manual job searching is time-consuming and inconsistent — candidates miss opportunities and craft generic applications",
        outcome: "End-to-end AI pipeline from RSS scraping to email outreach, reducing job application effort to near zero",
        techStack: ["FastAPI", "Python", "Google Gemini", "PostgreSQL", "SQLAlchemy", "JWT"],
        domain: "AI Automation",
        cta: "View Live App",
        status: "Live",
        year: 2025,
        icon: Bot,
        links: { github: "#", live: "https://rolehunter.vercel.app" }
    },
    {
        id: "dailybrief",
        title: "Daily BRIEF",
        impactStatement: "Minimalist daily task logger and automated export engine built for teams requiring structured daily logging with multi-user access control and AI-assisted handover documentation",
        problemSolved: "Teams lacked a structured, audit-ready way to log daily operations and hand over work across shifts",
        outcome: "Streamlined daily reporting with AI-generated handovers, PDF/CSV/XLSX exports, and Telegram push notifications",
        techStack: ["FastAPI", "Python", "Google Gemini", "PostgreSQL", "Tailwind CSS", "Telegram Bot API"],
        domain: "Productivity Systems",
        cta: "View Live App",
        status: "Production",
        year: 2026,
        icon: ClipboardList,
        links: { github: "https://github.com/OdigieDavidIdemudia/DailyBrief", live: "https://daily-brief-ten-delta.vercel.app" }
    },
    {
        id: "tealhunt",
        title: "TealHunt",
        impactStatement: "Threat intelligence platform that turns raw indicators into structured advisory and assessment workflows, enriching IOCs against VirusTotal and AbuseIPDB with a Three.js globe visualising adversary relationships",
        problemSolved: "Fragmented threat feeds and slow analyst triage — indicators had to be enriched and written up by hand across multiple tools",
        outcome: "Centralized threat visibility with IOC enrichment, reusable advisory templates, and interactive adversary mapping",
        techStack: ["Next.js", "Three.js", "React", "VirusTotal API", "AbuseIPDB", "JavaScript"],
        domain: "Threat Intelligence",
        cta: "View Live App",
        status: "Live",
        year: 2026,
        icon: Globe,
        links: { github: "https://github.com/OdigieDavidIdemudia/OrangeIntel", live: "https://tealhunt.com.ng" }
    },
    {
        id: "syncglide",
        title: "SyncGlide",
        impactStatement: "Operational task system improving team execution velocity",
        problemSolved: "Poor task visibility across distributed teams",
        outcome: "Clear ownership, reduced coordination overhead",
        techStack: ["Vue.js", "Firebase"],
        domain: "Productivity Systems",
        cta: "View Case Study",
        icon: LayoutDashboard,
        links: { github: "#", live: "https://syncglide.com.ng" }
    },
    {
        id: "socti",
        title: "SOCTI Toolkit",
        impactStatement: "Modular SOC toolkit for asset validation and threat reputation analysis",
        problemSolved: "Manual, error-prone SOC enrichment workflows",
        outcome: "Faster analyst validation with repeatable tooling",
        techStack: ["Python", "Pandas"],
        domain: "SOC Operations",
        cta: "Explore Toolkit",
        icon: Terminal,
        links: { github: "https://github.com/OdigieDavidIdemudia/SOCTI-Toolkit", live: "#" }
    },
    {
        id: "linkpass",
        title: "LinkPass - Enterprise Vault",
        impactStatement: "A highly secure, team-based enterprise password manager with end-to-end encryption, strict RBAC, and mandatory 2FA",
        problemSolved: "Prevents single points of failure with multi-admin offline export authorization and comprehensive immutable audit logging",
        outcome: "Enterprise-grade password management system with Tkinter desktop client and FastAPI backend",
        techStack: ["Python", "FastAPI", "Tkinter", "SQLite", "Cryptography", "AES-GCM"],
        domain: "Enterprise Security",
        cta: "View Case Study",
        icon: KeyRound,
        links: { github: "https://github.com/OdigieDavidIdemudia/LinkPass", live: "https://link-pass-site.netlify.app/" }
    },
    {
        id: "assetpulse",
        title: "AssetPulse - Endpoint Compliance Guard",
        impactStatement: "A centralized B2B enterprise IT compliance aggregation and reconciliation platform.",
        problemSolved: "An enterprise-grade asset inventory and compliance tracking system that merges hardware inventories with active security agent data from Cortex XDR, Qualys, and CrowdStrike to identify shadow IT and compliance drift.",
        outcome: "Multi-Source Compliance Reconciliation, Intelligent CSV/Excel Import Wizard, Role-Based Access Control, Immutable Security Audit Logging, Cryptographic Offline Licensing.",
        techStack: ["Python", "Flask", "React", "Vite", "PostgreSQL", "SQLite", "Docker", "Nginx", "Cryptography", "JWT", "RS256"],
        domain: "Endpoint Compliance",
        cta: "View Live App",
        icon: ShieldCheck,
        links: { github: "https://github.com/OdigieDavidIdemudia/AssetPulse", live: "https://assetpulse-seven.vercel.app" }
    },
    {
        id: "mitm",
        title: "MITM - Proxy Shield",
        impactStatement: "Network-level ad blocking and content filtering system built around Squid proxy + SquidGuard, with a Flask management API and companion Chrome MV3 extensions for per-tab telemetry, proxy status monitoring, and DRM detection",
        problemSolved: "Unwanted ads and trackers traverse the network with no centralized filtering, telemetry, or per-tab visibility for administrators",
        outcome: "Live-updating blocklist management without proxy restarts, authenticated admin API, telemetry logging, and browser-extension driven domain suggestions",
        techStack: ["Python", "Flask", "Squid", "SquidGuard", "Chrome MV3", "JavaScript", "htpasswd"],
        domain: "Network Security",
        cta: "View on GitHub",
        status: "Open Source",
        year: 2026,
        icon: Network,
        links: { github: "https://github.com/OdigieDavidIdemudia/MITM", live: "#" }
    },
    {
        id: "agentide",
        title: "AgentIde - EDR/XDR Assessment Framework",
        impactStatement: "Security assessment toolkit that evaluates EDR/XDR products on endpoints — a Go agent runs assessment modules (EICAR quarantine timing, LOLBin use, anti-tamper resilience, boot-gap testing) and streams results to a central dashboard scoring findings against MITRE ATT&CK",
        problemSolved: "Organizations lacked a repeatable, evidence-based way to measure how well their EDR/XDR stack actually detects and stops attacks",
        outcome: "Centralized scoring of endpoint defenses with AI-assisted reports, WebSocket agent transport, and vendor fingerprinting",
        techStack: ["Go", "Node.js", "React", "Vite", "PostgreSQL", "WebSocket", "Docker"],
        domain: "Security Assessment",
        cta: "View on GitHub",
        status: "Open Source",
        year: 2026,
        icon: Radar,
        links: { github: "https://github.com/OdigieDavidIdemudia/AgentIde", live: "#" }
    },
    {
        id: "extsafe",
        title: "ExtSafe - Extension Safety Auditor",
        impactStatement: "Web platform for auditing browser extensions — scrapes extension metadata and risk signals, presents review workflows, and exports findings to Excel",
        problemSolved: "Browser extensions are a supply-chain risk vector with no easy way to inventory, review, or report on their safety signals",
        outcome: "Automated extension risk auditing with Excel export and a serverless FastAPI backend deployed on Vercel",
        techStack: ["Python", "FastAPI", "React", "TypeScript", "Vite", "openpyxl", "Vercel"],
        domain: "Browser Security",
        cta: "View Live App",
        status: "Live",
        year: 2026,
        icon: Puzzle,
        links: { github: "https://github.com/OdigieDavidIdemudia/ExtSafe", live: "https://extsafe.vercel.app" }
    }
];

// ─── GitHub-synced projects ──────────────────────────────────────────────────
// Appended from src/data/generated-projects.json, which scripts/sync_github.mjs
// rewrites from data/cv.json. A project already represented above (by id or by
// repo name) is skipped so curated copy always wins.

const DOMAIN_BY_TOPIC = [
    [/threat|intel|ioc|siem|soc/i, "Threat Intelligence"],
    [/security|edr|xdr|malware|red.?team|offensive/i, "Security Tooling"],
    [/network|proxy|firewall|dns|squid/i, "Network Security"],
    [/compliance|audit|asset|inventory/i, "Compliance"],
    [/cli|shell|terminal|tool/i, "Developer Tooling"],
    [/web|react|next|frontend|api/i, "Web Platform"],
];

function inferDomain(p) {
    const haystack = [p.name, p.description, p.language, ...(p.topics || [])]
        .filter(Boolean)
        .join(' ');
    for (const [re, label] of DOMAIN_BY_TOPIC) {
        if (re.test(haystack)) return label;
    }
    return "Open Source";
}

const curatedIds = new Set(curatedProjects.map((p) => p.id));

const syncedById = new Map((generated.projects || []).map((p) => [p.id, p]));
const syncedByRepo = new Map(
    (generated.projects || []).map((p) => [String(p.repo || '').toLowerCase(), p]),
);

/**
 * A curated entry owns how a project is presented, but it must not point the
 * GitHub button at a private repo or the live button at the repo itself.
 *
 * When the sync finds a `<project>-publication` page for a curated project, it
 * wins on links: GitHub -> the publication's repo (the only public repo), live
 * -> the publication page. Everything else about the card stays curated.
 */
function applyPublicationLinks(project) {
    const repoName = project.links?.github?.split('/').filter(Boolean).pop()?.toLowerCase();
    const synced = syncedById.get(project.id) || (repoName && syncedByRepo.get(repoName));
    if (!synced?.publication) return project;

    return {
        ...project,
        links: {
            github: synced.publication.url,
            live: synced.publication.page,
        },
    };
}

const enrichedCurated = curatedProjects.map(applyPublicationLinks);

const syncedProjects = (generated.projects || [])
    .filter((p) => !curatedIds.has(p.id))
    .map((p) => ({
        id: p.id,
        title: p.name,
        impactStatement: p.description,
        problemSolved: p.description,
        outcome: p.publication
            ? "Published with a public write-up"
            : p.live
                ? "Published and publicly available"
                : "Open source",
        techStack: (p.techStack || []).slice(0, 6),
        domain: inferDomain(p),
        cta: p.live ? "View Publication" : "View on GitHub",
        status: p.live ? "Live" : "Open Source",
        year: p.period ? Number(String(p.period).slice(0, 4)) || undefined : undefined,
        icon: p.live ? Globe : Puzzle,
        links: { github: p.url || "#", live: p.homepage || "#" },
    }));

export const projects = [...enrichedCurated, ...syncedProjects];
