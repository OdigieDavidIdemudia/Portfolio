/**
 * Terminal.jsx — The full interactive CLI shell portfolio.
 *
 * Architecture:
 *  - `lines`        : scrollback log — array of { id, type, payload }
 *  - `historyRef`   : command history (ref, avoids stale closures in handleKeyDown)
 *  - `historyIdx`   : current ↑/↓ history position
 *  - `inputVal`     : controlled value for the shell input
 *  - `bootComplete` : gate that enables the input after boot animation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { profile } from '../data/terminal';
import { audioEngine } from './AudioEngine';
import {
    WhoamiOutput,
    LsOutput,
    SkillsOutput,
    ProjectsOutput,
    CertsOutput,
    ContactOutput,
    HelpOutput,
    ErrorLine,
    SudoOutput,
} from './OutputBlocks';

// ─── Constants ───────────────────────────────────────────────────────────────

const BOOT_LINES = [
    `Connecting to ${profile.host} (203.0.113.42)...`,
    `Handshake complete. Authenticating as guest...`,
    `Welcome. Last login: today from your browser.`,
];

const ASCII_BANNER = `██████╗    ██╗    ██████╗ \n██╔══██╗   ██║   ██╔═══██╗\n██║  ██║   ██║   ██║   ██║\n██║  ██║   ██║   ██║   ██║\n██████╔╝   ██║   ╚██████╔╝\n╚═════╝    ╚═╝    ╚═════╝ `;

// ─── Prompt prefix (reused in titlebar + scrollback lines) ────────────────────
function PromptPrefix() {
    return (
        <span className="prompt-prefix">
            <span className="c-green">{profile.handle}</span>
            <span className="c-dim">@</span>
            <span className="c-cyan">{profile.host}</span>
            <span className="c-dim">:~$&nbsp;</span>
        </span>
    );
}

// ─── Individual line renderer ─────────────────────────────────────────────────
function Line({ line }) {
    switch (line.type) {
        case 'boot':
            return <p className="line-boot">{line.payload}</p>;

        case 'banner':
            return (
                <>
                    <pre className="line-banner">{ASCII_BANNER}</pre>
                    <p className="banner-subtitle">
                        {profile.name.toLowerCase()}&nbsp;&nbsp;·&nbsp;&nbsp;{profile.tagline.toLowerCase()}
                    </p>
                </>
            );

        case 'blank':
            return <div className="line-blank" />;

        case 'prompt':
            return (
                <p className="line-prompt">
                    <PromptPrefix />
                    <span className="c-bright">{line.payload}</span>
                </p>
            );

        case 'whoami':   return <WhoamiOutput />;
        case 'ls':       return <LsOutput />;
        case 'skills':   return <SkillsOutput />;
        case 'projects': return <ProjectsOutput />;
        case 'certs':    return <CertsOutput />;
        case 'contact':  return <ContactOutput />;
        case 'help':     return <HelpOutput />;
        case 'sudo':     return <SudoOutput />;

        case 'error':
            return <ErrorLine command={line.payload} />;

        case 'text':
            return (
                <p className={`line-text ${line.payload.cls || 'c-primary'}`}>
                    {line.payload.text}
                </p>
            );

        default:
            return null;
    }
}

// ─── Terminal Root ────────────────────────────────────────────────────────────
export default function Terminal() {
    const [lines, setLines] = useState([]);
    const [inputVal, setInputVal] = useState('');
    const [historyIdx, setHistoryIdx] = useState(-1);
    const [bootComplete, setBootComplete] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const handleAudioToggle = useCallback((e) => {
        e.stopPropagation();
        const nowPlaying = audioEngine.toggle();
        setIsAudioPlaying(nowPlaying);
    }, []);

    const historyRef   = useRef([]);
    const idRef        = useRef(0);
    const inputRef     = useRef(null);
    const bottomRef    = useRef(null);
    const bootDoneRef  = useRef(false); // guard against double-run in StrictMode

    // Stable ID generator
    const nextId = () => ++idRef.current;

    // ── Boot sequence ──────────────────────────────────────────────────────
    useEffect(() => {
        if (bootDoneRef.current) return;
        bootDoneRef.current = true;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const mk = (type, payload) => ({ id: nextId(), type, payload });

        if (reduced) {
            // Instant — no stagger
            setLines([
                ...BOOT_LINES.map(t => mk('boot', t)),
                mk('banner'),
                mk('blank'),
                mk('prompt', 'whoami'),
                mk('whoami'),
                mk('blank'),
            ]);
            setBootComplete(true);
            return;
        }

        // Staggered boot
        const timers = [];
        let delay = 0;

        BOOT_LINES.forEach(text => {
            timers.push(setTimeout(() => {
                setLines(p => [...p, { id: nextId(), type: 'boot', payload: text }]);
            }, delay));
            delay += 260;
        });

        // Banner appears after all boot lines
        timers.push(setTimeout(() => {
            setLines(p => [
                ...p,
                { id: nextId(), type: 'banner' },
                { id: nextId(), type: 'blank' },
            ]);
        }, delay));
        delay += 480;

        // Auto-run whoami
        timers.push(setTimeout(() => {
            setLines(p => [
                ...p,
                { id: nextId(), type: 'prompt', payload: 'whoami' },
                { id: nextId(), type: 'whoami' },
                { id: nextId(), type: 'blank' },
            ]);
            setBootComplete(true);
        }, delay));

        return () => timers.forEach(clearTimeout);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Auto-scroll on new lines ──────────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [lines]);

    // ── Focus input on boot complete ──────────────────────────────────────
    useEffect(() => {
        if (bootComplete) inputRef.current?.focus();
    }, [bootComplete]);

    // ── Click anywhere → refocus input ───────────────────────────────────
    useEffect(() => {
        const handler = () => inputRef.current?.focus();
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    // ── Auto-start music on first user interaction ────────────────────────
    // Browsers block AudioContext until a user gesture; we start on first
    // keydown OR click so it feels instant without a manual toggle.
    useEffect(() => {
        const startOnInteraction = () => {
            if (!audioEngine.isPlaying) {
                audioEngine.play();
                setIsAudioPlaying(true);
            }
        };
        window.addEventListener('keydown',  startOnInteraction, { once: true });
        window.addEventListener('pointerdown', startOnInteraction, { once: true });
        return () => {
            window.removeEventListener('keydown',  startOnInteraction);
            window.removeEventListener('pointerdown', startOnInteraction);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Command processor ─────────────────────────────────────────────────
    const processCommand = useCallback((raw) => {
        const cmd = raw.trim();
        const lower = cmd.toLowerCase();

        // Append prompt line
        setLines(p => [...p, { id: nextId(), type: 'prompt', payload: cmd }]);

        // Record history
        if (cmd) {
            historyRef.current = [cmd, ...historyRef.current];
            setHistoryIdx(-1);
        }

        // Empty enter — blank line separator
        if (!cmd) {
            setLines(p => [...p, { id: nextId(), type: 'blank' }]);
            return;
        }

        // ── Dispatch ──
        if (lower === 'clear') {
            setLines([]);
            return;
        }

        const append = (...entries) =>
            setLines(p => [
                ...p,
                ...entries.map(e => ({ id: nextId(), ...e })),
                { id: nextId(), type: 'blank' },
            ]);

        if (lower === 'help')      { append({ type: 'help' });     return; }
        if (lower === 'whoami')    { append({ type: 'whoami' });   return; }
        if (lower === 'ls' || lower === 'ls -la' || lower === 'ls -l') {
            append({ type: 'ls' }); return;
        }
        if (lower === 'skills')    { append({ type: 'skills' });   return; }
        if (lower === 'projects')  { append({ type: 'projects' }); return; }
        if (lower === 'certs' || lower === 'certifications') {
            append({ type: 'certs' }); return;
        }
        if (lower === 'contact')   { append({ type: 'contact' });  return; }

        // cat aliases
        if (lower === 'cat about.txt' || lower === 'cat about') {
            append({ type: 'whoami' }); return;
        }
        if (lower === 'cat skills.txt' || lower === 'cat skills') {
            append({ type: 'skills' }); return;
        }
        if (lower === 'cat certs.txt' || lower === 'cat certs') {
            append({ type: 'certs' }); return;
        }
        if (lower === 'cat contact.txt' || lower === 'cat contact') {
            append({ type: 'contact' }); return;
        }
        if (lower === 'cat resume.sh' || lower === 'cat resume' || lower === 'resume') {
            // Trigger download — works because this is called from a keydown handler (user gesture)
            try {
                const a = document.createElement('a');
                a.href = `${import.meta.env.BASE_URL}assets/David_Odigie_CV.pdf`;
                a.download = 'David_Odigie_CV.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (_) { /* silently skip if blocked */ }
            append({ type: 'text', payload: { text: '→ Downloading David_Odigie_CV.pdf ...', cls: 'c-green' } });
            return;
        }
        if (lower.startsWith('cat projects')) {
            append({ type: 'projects' }); return;
        }

        // sudo easter egg
        if (lower.startsWith('sudo')) {
            append({ type: 'sudo' }); return;
        }

        // Fallback
        append({ type: 'error', payload: cmd.split(' ')[0] });
    }, []);

    // ── Keyboard handler ──────────────────────────────────────────────────
    const handleKeyDown = useCallback((e) => {
        // Key-click sound on every meaningful keystroke
        const silent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                        'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'];
        if (!silent.includes(e.key)) {
            audioEngine.playKeyClick(e.key === 'Enter');
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            const val = inputVal;
            setInputVal('');
            setHistoryIdx(-1);
            processCommand(val);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHistoryIdx(prev => {
                const next = Math.min(prev + 1, historyRef.current.length - 1);
                if (historyRef.current[next] !== undefined) {
                    setInputVal(historyRef.current[next]);
                }
                return next;
            });
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHistoryIdx(prev => {
                const next = prev - 1;
                if (next < 0) {
                    setInputVal('');
                    return -1;
                }
                if (historyRef.current[next] !== undefined) {
                    setInputVal(historyRef.current[next]);
                }
                return next;
            });
        }
    }, [inputVal, processCommand]);

    // ─────────────────────────────────────────────────────────────────────
    return (
        <div className="term-root">

            {/* ── Titlebar ─────────────────────────────────────── */}
            <header className="term-titlebar" aria-hidden="true">
                <div className="titlebar-dots">
                    <span className="dot dot-red"   />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-amber"  />
                </div>
                <span className="titlebar-path">
                    <span className="c-green">guest</span>
                    <span className="c-dim">@</span>
                    <span className="c-cyan">{profile.host}</span>
                    <span className="c-dim">: ~</span>
                </span>
                <button
                    className={`audio-toggle ${isAudioPlaying ? 'active' : ''}`}
                    onClick={handleAudioToggle}
                    title={isAudioPlaying ? 'Mute ambient music' : 'Play ambient music'}
                    aria-label={isAudioPlaying ? 'Mute ambient music' : 'Play ambient music'}
                >
                    {isAudioPlaying ? '♪ on' : '♪'}
                </button>
                <span className="titlebar-meta">ssh · 14ms</span>
            </header>

            {/* ── Scrollback / Output log ───────────────────────── */}
            <main
                className="term-scrollback"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}
            >
                <div className="term-output" role="log" aria-live="polite" aria-label="Terminal output">
                    {lines.map(line => (
                        <Line key={line.id} line={line} />
                    ))}
                    <div ref={bottomRef} style={{ height: 1 }} />
                </div>
            </main>

            {/* ── Fixed input bar ───────────────────────────────── */}
            <div className="term-inputbar">
                <div className="inputbar-fade" aria-hidden="true" />
                <div className="inputbar-content">
                    <div className="inputbar-inner">
                        <div className="input-shell">
                            <PromptPrefix />
                            <div className="input-wrapper">
                                <input
                                    ref={inputRef}
                                    id="terminal-input"
                                    type="text"
                                    className="shell-input"
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    aria-label="Terminal command input — type help for a list of commands"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    disabled={!bootComplete}
                                    style={{ width: `${Math.max(inputVal.length, 0)}ch` }}
                                />
                                <span className="cursor" aria-hidden="true" />
                            </div>
                        </div>
                        <p className="inputbar-hint">
                            ↑/↓ history&nbsp;&nbsp;·&nbsp;&nbsp;
                            type <span className="c-bright">help</span> to list commands
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
