import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { certificationGroups } from '../data/certifications';

export default function Certifications() {
    return (
        <section id="certifications" className="py-24 relative z-10">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Licenses & <span className="text-accent">Certifications</span>
                    </h2>
                    <div className="w-24 h-1 bg-accent rounded-full mx-auto" />
                </motion.div>

                <div className="space-y-16">
                    {certificationGroups.map((group, groupIndex) => (
                        <div key={group.label}>
                            <motion.h3
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: groupIndex * 0.1 }}
                                className="text-xl font-bold text-gray-300 mb-8 border-l-4 border-accent pl-4 tracking-wide uppercase"
                            >
                                {group.label}
                            </motion.h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {group.certifications.map((cert, index) => (
                                    <motion.div
                                        key={cert.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="group glass-card p-8 rounded-xl border border-white/5 bg-[#111318]/40 hover:bg-[#111318]/80 hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
                                    >
                                        {/* Header: Issuer & Status */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2 text-accent/80">
                                                <Award size={20} />
                                                <span className="text-xs font-bold tracking-wider uppercase text-accent">
                                                    {cert.issuer}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium uppercase tracking-wide">
                                                <CheckCircle2 size={10} />
                                                {cert.status}
                                            </div>
                                        </div>

                                        {/* Main Content: Name */}
                                        <h4 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-white transition-colors leading-tight">
                                            {cert.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-6 font-mono">
                                            Issued: <span className="text-gray-400">{cert.date}</span>
                                        </p>

                                        {/* Competency Reveal on Hover */}
                                        <div className="relative overflow-hidden">
                                            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 ease-out">
                                                <div className="pt-4 border-t border-white/5">
                                                    <p className="text-sm text-gray-300 leading-relaxed">
                                                        <span className="text-accent mr-2">➜</span>
                                                        {cert.competency}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Hint to hover (visible when not hovered) */}
                                            <div className="text-xs text-gray-600 group-hover:hidden transition-opacity duration-200 mt-2">
                                                View Competency Details
                                            </div>
                                        </div>

                                        {/* Subtle Glow */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
