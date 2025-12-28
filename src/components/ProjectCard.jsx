import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProjectCard({ project, index, isFeatured }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = project.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`group glass-card p-8 rounded-3xl border border-white/5 hover:bg-[#111318]/80 hover:border-accent/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${isFeatured ? 'md:col-span-2' : ''
                }`}
        >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-500 ${isFeatured ? 'scale-150' : ''}`} />

            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row gap-6 mb-6">
                <div className="p-4 bg-accent/10 rounded-2xl text-accent w-16 h-16 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                    <Icon size={32} />
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="text-accent text-xs font-bold tracking-wider uppercase mb-2 block">
                                {project.domain}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">
                                {project.title}
                            </h3>
                        </div>

                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {project.links.github !== "#" && (
                                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                    <Github size={20} />
                                </a>
                            )}
                            {project.links.live !== "#" && (
                                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                    <ExternalLink size={20} />
                                </a>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-300 text-sm md:text-base mt-3 font-medium leading-relaxed max-w-2xl">
                        {project.impactStatement}
                    </p>
                </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden relative z-10"
                    >
                        <div className="pt-4 pb-6 border-t border-white/5 flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Problem Solved</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">{project.problemSolved}</p>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-accent mb-2 uppercase tracking-wide">Key Outcome</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">{project.outcome}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-[#1A1D24] text-gray-400 text-xs font-medium rounded-full border border-white/5">
                            {tech}
                        </span>
                    ))}
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                >
                    {isExpanded ? 'Show Less' : project.cta}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>
        </motion.div>
    );
}
