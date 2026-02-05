import React from 'react';
import { Github, Twitter, Linkedin, Heart, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass-effect footer" style={{
            marginTop: '4rem',
            padding: '3rem 2rem',
            borderRadius: '24px 24px 0 0',
            border: '1px solid var(--card-border)',
            background: 'var(--glass)',
            backdropFilter: 'blur(20px)'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand Info */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>
                            DeepFocus
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                            A high-fidelity productivity ecosystem designed for high-performers. Reclaim your flow and master your time with precision analytics.
                        </p>
                    </div>

                    {/* Capabilities Info */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>CAPABILITIES</h3>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem'
                        }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• DeepWork Pomodoro Timer</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Theme-Adaptive Analytics</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Weekly Goal Architecture</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Automated Intelligence Reports</li>
                        </ul>
                    </div>

                    {/* System Status */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>SYSTEM STATUS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.875rem' }}>
                                <div className="pulse-success" style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
                                Atlas Database Online
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.875rem' }}>
                                <div className="pulse-success" style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
                                Report Engine Ready
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <ShieldCheck size={16} /> Secure JWT Protocol
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>THE DEVELOPER</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Built with precision by <strong>Syed Mohd Kashif Rizvi</strong>, a Full-Stack Developer dedicated to creating high-fidelity tools that bridge the gap between effort and excellence.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a
                                href="https://www.linkedin.com/in/syed-mohd-kashif-rizvi-835492286/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-effect social-icon"
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '12px',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}
                            >
                                <Linkedin size={20} /> Connect on LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--card-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        © {new Date().getFullYear()} DeepFocus. All rights reserved.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Designed with <Heart size={14} style={{ color: '#f43f5e' }} /> for Productivity
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
