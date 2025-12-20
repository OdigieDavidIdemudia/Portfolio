import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEQUENCE = [
    "Initializing secure session...",
    "Environment: PORTFOLIO",
    "Node: odigie-dav-idemudia",
    "Role: Analyst",
    "--------------------------------",
    "Enter Operator ID: admin",
    "Enter Passphrase: ********",
    "Authentication successful.",
    "Applying access policies...",
    "Loading telemetry modules...",
    "Mounting dashboards...",
    "UI ready. Handing control to operator."
];

export default function BootTerminal({ onComplete }) {
    const [lines, setLines] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Auto-skip capability
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSkip();
        }, 4000); // per config: autoSkipMs 4000
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (currentLineIndex >= SEQUENCE.length) {
            if (!isComplete) {
                setIsComplete(true);
                setTimeout(onComplete, 800); // Short delay before unmount
            }
            return;
        }

        const currentLineText = SEQUENCE[currentLineIndex];

        if (currentCharIndex < currentLineText.length) {
            const timeout = setTimeout(() => {
                setLines(prev => {
                    const newLines = [...prev];
                    if (newLines[currentLineIndex] === undefined) {
                        newLines[currentLineIndex] = "";
                    }
                    newLines[currentLineIndex] += currentLineText[currentCharIndex];
                    return newLines;
                });
                setCurrentCharIndex(prev => prev + 1);
            }, 20); // Fast typing
            return () => clearTimeout(timeout);
        } else {
            // Line finished
            const timeout = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, 100); // Pause between lines
            return () => clearTimeout(timeout);
        }
    }, [currentLineIndex, currentCharIndex, isComplete, onComplete]);

    const handleSkip = () => {
        setIsComplete(true);
        onComplete();
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0b0f14] flex items-center justify-center font-mono text-[#cbd5e1] p-6 cursor-pointer"
            onClick={handleSkip}
        >
            <div className="w-full max-w-2xl h-96 overflow-hidden">
                {lines.map((line, i) => (
                    <div key={i} className="mb-1 text-sm md:text-base">
                        <span className="text-[#22d3ee] mr-2">➜</span>
                        {line}
                    </div>
                ))}
                {!isComplete && (
                    <div className="mt-1">
                        <span className="text-[#22d3ee] mr-2">➜</span>
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="inline-block w-2.5 h-4 bg-[#22d3ee]"
                        />
                    </div>
                )}
            </div>

            <div className="absolute bottom-8 left-0 w-full text-center text-xs text-gray-600">
                [CLICK TO SKIP INITIALIZATION]
            </div>
        </motion.div>
    );
}
