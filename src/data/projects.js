import { Shield, Server, Database, Lock, Globe, Terminal } from 'lucide-react';

export const projects = [
    {
        title: "OrangeIntel",
        description: "A comprehensive Threat Advisory Platform for monitoring and analyzing cybersecurity threats.",
        tags: ["React", "Go Lang", "Threat Intelligence"],
        icon: Shield,
        links: { github: "#", live: "#" }
    },
    {
        title: "SyncDeck",
        description: "Operational Task Manager designed to streamline team workflows and task tracking.",
        tags: ["Vue.js", "Firebase", "Productivity"],
        icon: Database,
        links: { github: "#", live: "#" }
    },
    {
        title: "Hash & IP Comparator",
        description: "Utility tool for comparing large sets of cryptographic hashes and IP addresses for IOC matches.",
        tags: ["Python", "Tkinter", "Forensics"],
        icon: Terminal,
        links: { github: "#", live: "#" }
    },
    {
        title: "SepX",
        description: "Secure file separation and classification tool for enterprise environments.",
        tags: ["Python", ".NET", "Security"],
        icon: Lock,
        links: { github: "#", live: "#" }
    },
    {
        title: "HostSplit",
        description: "Network utilities for parsing and splitting hostnames and domains efficiently.",
        tags: ["Python", "Networking", "Automation"],
        icon: Server,
        links: { github: "#", live: "#" }
    },
    {
        title: "Server IP Comparator",
        description: "Advanced IP comparison tool for server infrastructure analysis.",
        tags: ["Python", "Networking"],
        icon: Globe,
        links: { github: "#", live: "#" }
    },
    {
        title: "Domain Admission Review",
        description: "Automated system for reviewing and validating domain admission requests.",
        tags: ["JavaScript", "Automation"],
        icon: Shield,
        links: { github: "#", live: "#" }
    }
];
