import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Download, ChevronsDown } from 'lucide-react';
import NetworkScene from './3d/NetworkScene';

export default function Hero() {
    return (
        <section id="home" className="relative w-full h-screen overflow-hidden bg-background">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-70">
                <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
                    <Suspense fallback={null}>
                        <NetworkScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                <div className="container mx-auto px-6 text-center pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white">
                            David <span className="text-accent font-mono inline-block hover:scale-105 transition-transform duration-300" style={{ textShadow: "0 0 20px rgba(0, 229, 255, 0.5)" }}>Idemudia</span> Odigie
                        </h1>

                        <h2 className="text-xl md:text-2xl text-gray-200 font-bold mb-4 tracking-wide">
                            Security Engineer <span className="text-accent">|</span> Detection, Automation, and Infrastructure Security
                        </h2>

                        <p className="text-xs md:text-sm text-gray-500 mb-6 font-medium uppercase tracking-widest max-w-2xl mx-auto">
                            Focused on SOC tooling, detection engineering, and secure systems design
                        </p>

                        <p className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            I design, secure, and automate systems that support detection, resilience, and operational visibility in modern environments.
                        </p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <a
                                href="#projects"
                                className="px-8 py-3 bg-accent text-background font-bold rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20"
                            >
                                View Security Work
                            </a>
                            <a
                                href={`${import.meta.env.BASE_URL}assets/David_Idemudia_Odigie_CV.pdf`}
                                download
                                className="px-8 py-3 bg-transparent border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 rounded-full transition-all duration-300 flex items-center gap-2"
                            >
                                <Download size={20} />
                                Download CV
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-semibold tracking-[0.2em] text-gray-500 group-hover:text-accent transition-colors duration-300 uppercase">
                        Explore Capabilities
                    </span>
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <ChevronsDown
                            size={20}
                            className="text-gray-600 group-hover:text-accent transition-colors duration-300"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
