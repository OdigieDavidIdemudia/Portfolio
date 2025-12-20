import {
    Code2,
    Server,
    Shield,
    Terminal,
    Layout
} from 'lucide-react';

export const skillCategories = [
    {
        title: "Frontend Development",
        description: "Interactive interfaces, clean component architecture, and performance-aware animations.",
        icon: Layout,
        skills: ["React", "Vue.js", "TailwindCSS", "Framer Motion", "Three.js", "HTML5 / CSS3"]
    },
    {
        title: "Backend & Systems",
        description: "APIs, services, and system integrations built for reliability and scale.",
        icon: Server,
        skills: ["Node.js", "Python", "Go", "C# / .NET", "REST APIs", "GraphQL"]
    },
    {
        title: "Cybersecurity",
        description: "Threat monitoring, detection, incident response, and security tooling in SOC environments.",
        icon: Shield,
        skills: ["Threat Intelligence", "Digital Forensics", "Network Security", "SIEM", "NAC", "IDS/IPS", "XDR", "FIM"]
    },
    {
        title: "Tools & DevOps",
        description: "Developer tooling, Linux environments, and operational workflows.",
        icon: Terminal,
        skills: ["Git", "Docker", "Linux", "Wireshark", "Burp Suite"]
    }
];
