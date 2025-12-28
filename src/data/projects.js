import { Shield, LayoutDashboard, Terminal, Globe } from 'lucide-react';

export const projects = [
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
        links: { github: "#", live: "#" }
    },
    {
        id: "syncdeck",
        title: "SyncDeck",
        impactStatement: "Operational task system improving team execution velocity",
        problemSolved: "Poor task visibility across distributed teams",
        outcome: "Clear ownership, reduced coordination overhead",
        techStack: ["Vue.js", "Firebase"],
        domain: "Productivity Systems",
        cta: "View Case Study",
        icon: LayoutDashboard,
        links: { github: "https://github.com/OdigieDavidIdemudia/SyncDeck", live: "https://sync-deck.vercel.app/" }
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
    }
];
