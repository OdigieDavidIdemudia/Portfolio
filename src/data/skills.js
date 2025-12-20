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
        icon: Layout,
        skills: ["React", "Vue.js", "TailwindCSS", "Framer Motion", "Three.js"]
    },
    {
        title: "Backend & Systems",
        icon: Server,
        skills: ["Node.js", "Python", "Go", "C#/.NET", "REST APIs", "GraphQL"]
    },
    {
        title: "Cybersecurity",
        icon: Shield,
        skills: ["Threat Intelligence", "SIEM", "Network Security", "Forensics"]
    },
    {
        title: "Tools & DevOps",
        icon: Terminal,
        skills: ["Git", "Docker", "Linux", "Wireshark", "Burp Suite"]
    }
];
