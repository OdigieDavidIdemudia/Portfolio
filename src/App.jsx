import React, { useState } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import BootTerminal from './components/BootTerminal';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [showBoot, setShowBoot] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showBoot && <BootTerminal onComplete={() => setShowBoot(false)} />}
      </AnimatePresence>

      {!showBoot && (
        <Layout>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Certifications />
          <Contact />
        </Layout>
      )}
    </>
  );
}
