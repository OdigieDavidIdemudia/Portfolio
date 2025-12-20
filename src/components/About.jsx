import React from 'react';
import { motion } from 'framer-motion';
import { User, Code, Notebook } from 'lucide-react';

export default function About() {
    return (
        <section id="about" className="py-20 relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                            <div className="relative h-full bg-gradient-to-tr from-white/10 to-transparent rounded-2xl border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center">
                                <User size={120} className="text-gray-400" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Who is <span className="text-accent">David?</span>
                        </h2>

                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                I am a passionate <strong className="text-white">Cybersecurity Analyst</strong> and <strong className="text-white">Software Developer</strong> with a knack for building secure, efficient, and visually stunning digital solutions.
                            </p>
                            <p>
                                My journey began with a curiosity for how systems break, which naturally led me to learn how to build them better. Today, I bridge the gap between offensive security knowledge and defensive software engineering.
                            </p>
                            <p>
                                When I'm not analyzing IOCs or writing React components, you can find me exploring new security tools, contributing to open-source projects, or optimizing my workflows.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-6 mt-10">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <Code className="text-accent mb-2" />
                                <div className="text-2xl font-bold text-white">3+ Years</div>
                                <div className="text-sm text-gray-400">Development</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <Notebook className="text-accent mb-2" />
                                <div className="text-2xl font-bold text-white">50+</div>
                                <div className="text-sm text-gray-400">Projects Completed</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
