import React from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

export default function Projects() {
    return (
        <section id="projects" className="py-24 relative z-10">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Featured <span className="text-accent">Projects</span>
                    </h2>
                    <div className="w-24 h-1 bg-accent rounded-full mx-auto" />
                    <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
                        Selected works demonstrating systems thinking, security engineering, and operational impact.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            index={index}
                            isFeatured={index === 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
