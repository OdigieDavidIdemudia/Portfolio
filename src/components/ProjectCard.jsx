import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

export default function ProjectCard({ project, index }) {
    const Icon = project.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-4">
                    <a href={project.links.github} className="text-gray-400 hover:text-accent transition-colors">
                        <Github size={20} />
                    </a>
                    <a href={project.links.live} className="text-gray-400 hover:text-accent transition-colors">
                        <ExternalLink size={20} />
                    </a>
                </div>
            </div>

            <div className="mb-4 text-accent p-3 bg-accent/10 rounded-lg w-fit">
                <Icon size={32} />
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                {project.title}
            </h3>

            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/5"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
