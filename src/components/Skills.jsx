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
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Technical <span className="text-accent">Expertise</span>
                    </h2>
                    <div className="w-20 h-1 bg-accent rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skillCategories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                whileHover={{ y: -5, borderColor: 'rgba(0, 229, 255, 0.3)' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="glass-card p-8 rounded-2xl border border-transparent transition-colors duration-300"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-accent/10 rounded-lg text-accent">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold">{category.title}</h3>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {category.skills.map((skill, i) => (
                                        <motion.span
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 + (i * 0.05) }}
                                            viewport={{ once: true }}
                                            whileHover={{
                                                scale: 1.1,
                                                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                                borderColor: 'rgba(0, 229, 255, 0.5)',
                                                color: '#00E5FF',
                                                boxShadow: '0 0 8px rgba(0, 229, 255, 0.2)'
                                            }}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm font-medium cursor-pointer"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
