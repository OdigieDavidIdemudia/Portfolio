import { Shield, LayoutDashboard, Terminal, Globe, Bot, ClipboardList } from 'lucide-react';

export const projects = [
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
        links: { github: "https://github.com/OdigieDavidIdemudia/RoleHunter", live: "https://rolehunter.vercel.app" }
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
        links: { github: "#", live: "https://daily-brief-ten-delta.vercel.app" }
    },
    {
        id: "orangeintel",
        title: "OrangeIntel",
        impactStatement: "Threat intelligence platform for real-time adversary monitoring and analysis",
        problemSolved: "Fragmented threat feeds and slow analyst triage",
        outcome: "Centralized threat visibility and faster response workflows",
        techStack: ["React", "Go"],
        domain: "Threat Intelligence",
        cta: "View Architecture",
        icon: Globe,
        links: { github: "#", live: "https://orange-intel.netlify.app/" }
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
        links: { github: "https://github.com/OdigieDavidIdemudia/SyncDeck", live: "https://syncglide.com.ng" }
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
        icon: Shield,
        links: { github: "#", live: "https://link-pass-site.netlify.app/" }
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
        icon: Shield,
        links: { github: "#", live: "https://asset-pulse-site.netlify.app/" }
    }
];
