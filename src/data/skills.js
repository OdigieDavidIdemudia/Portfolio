import {
    Layout,
    Server,
    Shield,
    Terminal
} from 'lucide-react';

export const skillCategories = [
    {
        id: "frontend",
        title: "Frontend Systems & UX Engineering",
        subtitle: "High-performance, accessible interfaces",
        icon: Layout,
        primarySkills: ["React", "Vue.js"],
        secondarySkills: ["TailwindCSS", "Framer Motion"],
        supportingSkills: ["Three.js"]
    },
    {
        id: "backend",
        title: "Backend Architecture & APIs",
        subtitle: "Scalable services and data contracts",
        icon: Server,
        primarySkills: ["Node.js", "C#/.NET"],
        secondarySkills: ["Python", "Go"],
        supportingSkills: ["REST APIs", "GraphQL"]
    },
    {
        id: "security",
        title: "Cybersecurity & Risk Engineering",
        subtitle: "Detection, response, and threat mitigation",
        icon: Shield,
        primarySkills: ["SIEM", "Network Security"],
        secondarySkills: ["Threat Intelligence"],
        supportingSkills: ["Forensics"]
    },
    {
        id: "devops",
        title: "Tooling, Automation & DevOps",
        subtitle: "Operational reliability and visibility",
        icon: Terminal,
        primarySkills: ["Docker", "Linux"],
        secondarySkills: ["Git"],
        supportingSkills: ["Wireshark", "Burp Suite"]
    }
];
