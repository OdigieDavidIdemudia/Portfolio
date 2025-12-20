import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-accent selection:text-background">
            <Navbar />
            <main className="relative z-0">
                {children}
            </main>
            <footer className="py-8 bg-black/20 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} David Idemudia Odigie. All rights reserved.</p>
            </footer>
        </div>
    );
}
