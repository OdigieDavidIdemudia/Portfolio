import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import { certifications } from '../data/certifications';

export default function Certifications() {
    return (
        <section id="certifications" className="py-20 relative z-10 bg-black/20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Licenses & <span className="text-accent">Certifications</span>
                    </h2>
                    <div className="w-20 h-1 bg-accent rounded-full mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 rounded-xl border-t-4 border-t-accent hover:bg-white/5 transition-colors"
                        >
                            <div className="mb-4 bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center text-accent">
                                <Award size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-1">{cert.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">{cert.issuer}</p>

                            <div className="flex items-center text-xs text-gray-500 gap-2">
                                <CheckCircle size={12} className="text-green-500" />
                                <span>Issued {cert.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
