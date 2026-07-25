/**
 * OutputBlocks.jsx — Pure stateless render components for each command type.
 * All data is imported from data/terminal.js — no content is hardcoded here.
 */

import React from 'react';
import { profile, skills, projects, certifications, contact, lsEntries } from '../data/terminal';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusBadgeClass(status = '') {
    const s = status.toLowerCase();
    if (s === 'live')       return 'badge-live';
    if (s === 'production') return 'badge-prod';
    if (s === 'active')     return 'badge-active';
    if (s === 'archived')   return 'badge-archived';
    return 'badge-inprog';
}

// ─── WhoamiOutput ─────────────────────────────────────────────────────────────
export function WhoamiOutput() {
    return (
        <div className="output-block">
            <p className="whoami-name">{profile.name}</p>
            <p className="whoami-tagline">{profile.tagline}</p>
            <div className="whoami-bio">
                {profile.bio.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
            <div className="whoami-meta">
                <div className="whoami-meta-item">
                    <span className="whoami-meta-key">location</span>
                    <span className="whoami-meta-val">{profile.location}</span>
                </div>
                <div className="whoami-meta-item">
                    <span className="whoami-meta-key">status</span>
                    <span className="whoami-meta-val c-green">{profile.status}</span>
                </div>
                <div className="whoami-meta-item">
                    <span className="whoami-meta-key">exp</span>
                    <span className="whoami-meta-val">{profile.stats.experience}</span>
                </div>
            </div>
        </div>
    );
}

// ─── LsOutput ────────────────────────────────────────────────────────────────
export function LsOutput() {
    return (
        <div className="output-block">
            <div className="ls-grid">
                {lsEntries.map((entry) => (
                    <React.Fragment key={entry.name}>
                        <span className="ls-perm">{entry.perm}</span>
                        <span className={`ls-name ${entry.type === 'dir' ? 'ls-dir' : entry.type === 'exec' ? 'ls-exec' : ''}`}>
                            {entry.name}
                        </span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

// ─── SkillsOutput ─────────────────────────────────────────────────────────────
export function SkillsOutput() {
    return (
        <div className="output-block">
            <div className="skills-cols">
                <div className="skills-col">
                    <p className="skills-label">Cybersecurity</p>
                    {skills.security.map((s) => (
                        <p key={s} className="skill-item">
                            <span className="skill-bullet c-dim">▸</span>
                            {s}
                        </p>
                    ))}
                </div>
                <div className="skills-col">
                    <p className="skills-label">Development</p>
                    {skills.development.map((s) => (
                        <p key={s} className="skill-item">
                            <span className="skill-bullet c-dim">▸</span>
                            {s}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── ProjectsOutput ───────────────────────────────────────────────────────────
export function ProjectsOutput() {
    return (
        <div className="output-block">
            <div className="projects-list">
                {projects.map((p) => (
                    <div key={p.id} className="project-card">
                        <div className="project-header">
                            <span className="project-name">{p.name}</span>
                            <span className={`project-badge ${getStatusBadgeClass(p.status)}`}>
                                {p.status}
                            </span>
                            <div className="project-links">
                                {p.github && p.github !== '#' ? (
                                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="project-link">
                                        github ↗
                                    </a>
                                ) : (
                                    <span className="project-link disabled">github</span>
                                )}
                                {p.live && p.live !== '#' ? (
                                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="project-link">
                                        live ↗
                                    </a>
                                ) : null}
                            </div>
                        </div>
                        <p className="project-desc">{p.description}</p>
                        <div className="project-tags">
                            {p.tags.map((t) => (
                                <span key={t} className="tag">{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── CertsOutput ─────────────────────────────────────────────────────────────
export function CertsOutput() {
    function badgeClass(status) {
        const s = status.toLowerCase();
        if (s === 'active')    return 'cert-active';
        if (s === 'validated') return 'cert-validated';
        return 'cert-inview';
    }

    function badgeLabel(status) {
        const s = status.toLowerCase();
        if (s === 'in view') return '⏳ in view';
        if (s === 'active')  return '✓ active';
        return '✓ ' + status.toLowerCase();
    }

    return (
        <div className="output-block">
            <div className="certs-list">
                {certifications.map((group) => (
                    <div key={group.group}>
                        <p className="cert-group-label">{group.group}</p>
                        {group.items.map((cert) => (
                            <div key={cert.name} className="cert-row">
                                <span className="cert-name">
                                    {cert.name}
                                    <span className="c-dim" style={{ marginLeft: 6, fontSize: '0.85em' }}>
                                        ({cert.date})
                                    </span>
                                </span>
                                <span className="cert-issuer">{cert.issuer}</span>
                                <span className={`cert-badge ${badgeClass(cert.status)}`}>
                                    {badgeLabel(cert.status)}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── ContactOutput ────────────────────────────────────────────────────────────
export function ContactOutput() {
    return (
        <div className="output-block">
            <div className="contact-table">
                <span className="contact-key">email</span>
                <span className="contact-val">
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </span>

                <span className="contact-key">github</span>
                <span className="contact-val">
                    <a href={contact.github} target="_blank" rel="noopener noreferrer">
                        {contact.github.replace('https://', '')}
                    </a>
                </span>

                <span className="contact-key">linkedin</span>
                <span className="contact-val">
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                        {contact.linkedin.replace('https://', '')}
                    </a>
                </span>

                <span className="contact-key">response</span>
                <span className="contact-val c-green">within 24h</span>
            </div>
        </div>
    );
}

// ─── HelpOutput ───────────────────────────────────────────────────────────────
export function HelpOutput() {
    const commands = [
        { section: 'Navigation' },
        { cmd: 'ls',           desc: 'list available files and sections' },
        { cmd: 'cat <file>',   desc: 'read a file (e.g. cat about.txt)' },
        { cmd: 'clear',        desc: 'clear the terminal scrollback' },
        { section: 'Portfolio' },
        { cmd: 'whoami',       desc: 'who is idemudia? — bio and status' },
        { cmd: 'skills',       desc: 'cybersecurity + development skill sets' },
        { cmd: 'projects',     desc: 'portfolio of shipped projects' },
        { cmd: 'certs',        desc: 'licences and certifications' },
        { cmd: 'contact',      desc: 'reach out — email, github, linkedin' },
        { cmd: 'cat resume.sh',desc: 'download CV / resume' },
    ];

    return (
        <div className="output-block">
            <div className="help-table">
                {commands.map((item, i) =>
                    item.section ? (
                        <p key={i} className="help-section-header">{item.section}</p>
                    ) : (
                        <React.Fragment key={i}>
                            <span className="help-cmd">{item.cmd}</span>
                            <span className="help-desc">{item.desc}</span>
                        </React.Fragment>
                    )
                )}
            </div>
        </div>
    );
}

// ─── ErrorLine ────────────────────────────────────────────────────────────────
export function ErrorLine({ command }) {
    return (
        <p className="line-error">
            bash: <span className="c-bright">{command}</span>: command not found —{' '}
            <span className="c-dim">type <span className="c-bright">help</span> to list available commands</span>
        </p>
    );
}

// ─── SudoOutput ───────────────────────────────────────────────────────────────
export function SudoOutput() {
    return (
        <div className="line-sudo">
            <p className="c-red">[sudo] password for {profile.handle}: <span className="c-dim">***</span></p>
            <p className="c-dim">Sorry, user <span className="c-bright">{profile.handle}</span> is not in the sudoers file.</p>
            <p className="c-dim" style={{ fontSize: '0.85em', marginTop: 2 }}>This incident will be reported. (just kidding)</p>
        </div>
    );
}
