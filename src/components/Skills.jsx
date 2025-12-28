import React from 'react';
import { motion } from 'framer-motion';
import { skillCategories } from '../data/skills';

export default function Skills() {
    return (
        <section id="skills" className="py-20 relative z-10">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Technical <span className="text-accent">Expertise</span>
                    </h2>
                    <div className="w-24 h-1 bg-accent rounded-full mx-auto" />
                    <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        A comprehensive toolkit for securing modern infrastructure, operationalizing threat detection, and building resilient systems.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillCategories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group glass-card p-8 rounded-3xl border border-white/5 bg-[#111318]/60 hover:bg-[#111318]/80 hover:border-accent/20 transition-all duration-300 relative overflow-hidden shadow-lg"
                            >
                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-500" />

                                {/* Header */}
                                <div className="flex items-start gap-5 mb-8 relative z-10">
                                    <div className="p-3.5 bg-accent/10 rounded-2xl text-accent group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                                        <Icon size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">
                                            {category.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed font-medium">
                                            {category.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills Container */}
                                <div className="space-y-5 relative z-10">
                                    {/* Primary Skills - High Emphasis */}
                                    <div className="flex flex-wrap gap-2.5">
                                        {category.primarySkills.map(skill => (
                                            <span
                                                key={skill}
                                                className="px-4 py-1.5 bg-[#FACC15] text-[#0B0D10] rounded-full text-sm font-bold shadow-lg shadow-[#FACC15]/20 hover:scale-105 transition-transform duration-200 cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Secondary Skills - Medium Emphasis */}
                                    <div className="flex flex-wrap gap-2.5">
                                        {category.secondarySkills.map(skill => (
                                            <span
                                                key={skill}
                                                className="px-4 py-1.5 bg-[#1A1D24] text-gray-300 border border-white/10 rounded-full text-sm font-medium hover:border-white/20 transition-colors cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Supporting Skills - Revealed on Interaction */}
                                    <div className="pt-2">
                                        <div className="flex flex-wrap gap-2.5 opacity-0 -translate-y-2 h-0 overflow-hidden group-hover:opacity-100 group-hover:translate-y-0 group-hover:h-auto transition-all duration-300 ease-out delay-75">
                                            {category.supportingSkills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 bg-[#1A1D24]/50 text-gray-500 border border-white/5 rounded-full text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
