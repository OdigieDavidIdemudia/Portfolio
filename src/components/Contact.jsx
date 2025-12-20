import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowRight } from 'lucide-react';

export default function Contact() {
    const socialLinks = [
        {
            name: 'Email',
            icon: Mail,
            link: 'mailto:David.odigie.ide@gmail.com',
            color: 'hover:text-red-400',
            bgColor: 'hover:bg-red-400/10',
            borderColor: 'hover:border-red-400/20'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            link: 'https://linkedin.com/in/david-odigie',
            color: 'hover:text-blue-400',
            bgColor: 'hover:bg-blue-400/10',
            borderColor: 'hover:border-blue-400/20'
        },
        {
            name: 'GitHub',
            icon: Github,
            link: 'https://github.com/davidthings',
            color: 'hover:text-gray-100',
            bgColor: 'hover:bg-gray-100/10',
            borderColor: 'hover:border-gray-100/20'
        }
    ];

    return (
        <section id="contact" className="py-32 relative z-10">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">
                        Let's work <span className="text-accent">together</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-12">
                        Interested in collaborating or have a security challenge?
                        I'm always open to discussing new projects and opportunities.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {socialLinks.map((social, index) => {
                            const Icon = social.icon;
                            return (
                                <motion.a
                                    key={social.name}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`glass-card p-8 rounded-2xl flex flex-col items-center gap-4 transition-all duration-300 border border-white/5 ${social.color} ${social.bgColor} ${social.borderColor} group`}
                                >
                                    <Icon size={40} className="transition-transform group-hover:scale-110" />
                                    <span className="text-lg font-medium">{social.name}</span>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
