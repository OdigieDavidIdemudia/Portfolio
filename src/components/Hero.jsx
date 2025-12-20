import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Download, ChevronsDown } from 'lucide-react';
import Scene from './3d/Scene';

export default function Hero() {
    return (
        <section id="home" className="relative w-full h-screen overflow-hidden bg-background">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 35], fov: 60 }}>
                    <Suspense fallback={null}>
                        <Scene />
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
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                                David Idemudia
                            </span>
                            <br />
                            <span className="text-accent relative inline-block">
                                Odigie
                                <motion.span
                                    className="absolute -bottom-2 left-0 w-full h-1 bg-accent/50 rounded-full blur-sm"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                />
                            </span>
                        </h1>

                        <h2 className="text-2xl md:text-3xl text-gray-300 font-medium mb-4">
                            Cybersecurity Analyst & Software Developer
                        </h2>

                        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            I build and secure systems — from security tooling to production-grade software.
                        </p>

                        <motion.div
                            className="flex items-center justify-center space-x-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <a
                                href="#projects"
                                className="px-8 py-3 bg-accent text-background font-bold rounded-full hover:bg-accent/90 transition-all duration-300"
                            >
                                View Works
                            </a>
                            <a
                                href="/assets/David_Idemudia_Odigie_CV.pdf"
                                download
                                className="px-8 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
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
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="flex flex-col items-center"
                >
                    <span className="text-[10px] tracking-[0.3em] text-white/40 font-light mb-2 group-hover:text-accent transition-colors duration-300 uppercase">
                        Scroll Down
                    </span>
                    <ChevronsDown
                        size={24}
                        className="text-white/40 group-hover:text-accent transition-colors duration-300"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
