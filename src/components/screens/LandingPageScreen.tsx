import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkle } from '@phosphor-icons/react'

export const LandingPageScreen: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --color-primary: #7a1c1c;       /* Oxford Crimson */
          --color-primary-light: #962626;
          --color-secondary: #1e3a8a;     /* Academic Navy */
          --color-bg-parchment: #fdfbf7;  /* Soft Warm Book Page */
          --color-bg-pure: #ffffff;
          --color-text-dark: #1c1a17;     /* Soft Charcoal/Ink */
          --color-text-muted: #6b6661;
          --color-border: #e6dec9;        /* Warm Book Spine Border */
          --color-accent-green: #15803d;  /* Library Green-Lamp Accent */
          --font-serif: 'Fraunces', serif;
          --font-sans: 'Plus Jakarta Sans', sans-serif;
          --shadow-sm: 0 2px 8px rgba(122, 28, 28, 0.05);
          --shadow-md: 0 12px 34px rgba(28, 26, 23, 0.06);
        }

        .dark {
          --color-primary: oklch(0.85 0.08 20); /* Soft Pink/Crimson */
          --color-primary-light: oklch(0.90 0.08 20);
          --color-secondary: oklch(0.78 0.10 265); /* Soft Secondary */
          --color-bg-parchment: oklch(0.13 0.01 60); /* Dark Background */
          --color-bg-pure: oklch(0.17 0.01 60);      /* Dark Card */
          --color-text-dark: oklch(0.96 0.01 60);    /* Light Text */
          --color-text-muted: oklch(0.75 0.01 60);
          --color-border: oklch(0.25 0.01 60);
          --color-accent-green: #4ade80;
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
          --shadow-md: 0 12px 34px rgba(0, 0, 0, 0.4);
        }

        /* Container & Base styles */
        .landing-wrapper {
          background-color: var(--color-bg-parchment);
          color: var(--color-text-dark);
          font-family: var(--font-sans);
          line-height: 1.6;
          min-height: 100dvh;
          width: 100%;
        }

        .landing-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header & Navigation */
        .site-header {
          background-color: rgba(253, 251, 247, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          transition: background-color 0.3s;
        }
        .dark .site-header {
          background-color: rgba(26, 24, 22, 0.9);
        }
        .nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--color-primary);
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.4rem;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        .nav-links a {
          color: var(--color-text-dark);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--color-primary); }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-primary {
          background-color: var(--color-primary);
          color: var(--color-bg-parchment);
        }
        .btn-primary:hover { background-color: var(--color-primary-light); }
        .btn-outline {
          border: 2px solid var(--color-primary);
          color: var(--color-primary);
        }
        .btn-outline:hover { background-color: rgba(122, 28, 28, 0.04); }
        .dark .btn-outline:hover { background-color: rgba(255, 179, 173, 0.08); }

        /* Hero Section */
        .hero {
          padding: 80px 0 120px 0;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 48px;
        }
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.2fr 1fr;
            gap: 64px;
          }
        }
        .hero-tag {
          background-color: rgba(122, 28, 28, 0.08);
          color: var(--color-primary);
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 24px;
        }
        .dark .hero-tag {
          background-color: rgba(255, 179, 173, 0.15);
        }
        .hero h1 {
          font-family: var(--font-serif);
          font-size: 3.2rem;
          line-height: 1.15;
          color: var(--color-text-dark);
          margin-bottom: 24px;
          font-weight: 700;
        }
        @media (min-width: 768px) {
          .hero h1 {
            font-size: 3.8rem;
          }
        }
        .hero h1 span { color: var(--color-primary); }
        .hero p {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          margin-bottom: 40px;
          max-width: 520px;
        }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

        /* Hero Visual */
        .hero-visual {
          position: relative;
          background: var(--color-bg-pure);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 32px;
          box-shadow: var(--shadow-md);
        }
        .search-mockup {
          background: var(--color-bg-parchment);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
        }
        .search-mockup input {
          border: none;
          background: transparent;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--color-text-dark);
          width: 100%;
          outline: none;
        }
        .book-stack-preview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .book-spine-card {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 20px 16px;
          background: var(--color-bg-pure);
          border-left: 6px solid var(--color-primary);
        }
        .book-spine-card:nth-child(2) { border-left-color: var(--color-secondary); }
        .book-spine-card:nth-child(3) { border-left-color: var(--color-accent-green); }
        
        .book-spine-card h4 { font-family: var(--font-serif); margin-bottom: 4px; font-size: 1.05rem; font-weight: 700; }
        .book-spine-card span { font-size: 0.8rem; color: var(--color-text-muted); display: block; }
        .status-badge {
          display: inline-block;
          margin-top: 12px;
          padding: 2px 8px;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 4px;
          background: #e2f0d9;
          color: var(--color-accent-green);
        }
        .dark .status-badge {
          background: rgba(74, 222, 128, 0.15);
        }

        /* Features Section */
        .features {
          background: var(--color-bg-pure);
          padding: 120px 0;
          border-top: 1px solid var(--color-border);
          width: 100%;
        }
        .section-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 80px auto;
        }
        .section-header h2 {
          font-family: var(--font-serif);
          font-size: 2.6rem;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .section-header p { color: var(--color-text-muted); font-size: 1.1rem; }

        .feature-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 100px;
        }
        @media (min-width: 768px) {
          .feature-row {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
          }
          .feature-row:nth-child(even) { direction: rtl; }
          .feature-row:nth-child(even) .feature-text { direction: ltr; }
        }

        .feature-text h3 {
          font-family: var(--font-serif);
          font-size: 2rem;
          margin-bottom: 16px;
          color: var(--color-text-dark);
          font-weight: 700;
        }
        .feature-text p {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          margin-bottom: 24px;
        }

        /* Visual Previews */
        .feature-visual-box {
          background: var(--color-bg-parchment);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 40px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .ai-chat-preview {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          width: 100%;
          max-width: 360px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        .borrow-slip {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 24px;
          width: 280px;
          box-shadow: var(--shadow-md);
          position: relative;
        }
        .dark .borrow-slip {
          background: var(--color-bg-pure);
        }
        .slip-line {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed var(--color-border);
          padding: 8px 0;
          font-size: 0.85rem;
        }
        .vault-split {
          display: flex;
          gap: 16px;
          width: 100%;
        }
        .vault-card {
          background: white;
          border: 1px solid var(--color-border);
          padding: 16px;
          border-radius: 8px;
          flex: 1;
          text-align: center;
        }
        .dark .vault-card {
          background: var(--color-bg-pure);
        }
        .vault-card .icon {
          font-size: 1.5rem;
          margin-bottom: 8px;
          display: block;
        }
        .fine-slip {
          background: white;
          border-top: 4px solid var(--color-primary);
          box-shadow: var(--shadow-md);
          padding: 20px;
          width: 260px;
          border-radius: 0 0 8px 8px;
        }
        .dark .fine-slip {
          background: var(--color-bg-pure);
        }

        /* Analytics Dashboard */
        .analytics-dashboard {
          padding: 120px 0;
          border-top: 1px solid var(--color-border);
          width: 100%;
        }
        .dashboard-container {
          background: var(--color-bg-pure);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 40px;
          box-shadow: var(--shadow-md);
        }
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .metric-card {
          border: 1px solid var(--color-border);
          background: var(--color-bg-parchment);
          padding: 24px;
          border-radius: 12px;
        }
        .metric-card h5 { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 8px; font-weight: 600; }
        .metric-card p { font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--color-primary); }

        /* Developer Section */
        .api-section {
          background: #1c1a17;
          color: #fdfbf7;
          padding: 100px 0;
          width: 100%;
        }
        .dark .api-section {
          background: #0f0e0d;
          border-top: 1px solid var(--color-border);
        }
        .api-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .api-grid {
            grid-template-columns: 1fr 1fr;
            gap: 64px;
          }
        }
        .api-text h2 { font-family: var(--font-serif); font-size: 2.4rem; margin-bottom: 20px; font-weight: 700; }
        .api-text p { color: #c0b9b3; font-size: 1.05rem; }
        .code-block {
          background: #272421;
          border: 1px solid #3d3833;
          padding: 24px;
          border-radius: 12px;
          font-family: monospace;
          font-size: 0.9rem;
          color: #e6dec9;
          overflow-x: auto;
          white-space: pre-wrap;
        }

        /* Footer */
        .site-footer {
          border-top: 1px solid var(--color-border);
          padding: 60px 0;
          text-align: center;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          width: 100%;
          background-color: var(--color-bg-parchment);
        }

        /* Interactive hover lift effect */
        .hover-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          will-change: transform;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(122, 28, 28, 0.10);
        }
        .dark .hover-lift:hover {
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div className="landing-wrapper">
        {/* Navigation */}
        <header className="site-header">
          <div className="landing-container nav-bar">
            <Link to="/" className="brand" aria-label="CampusShelf Home">
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(122, 28, 28, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Sparkle size={20} weight="fill" />
              </div>
              <span>Campus Shelf</span>
            </Link>
            
            <ul className="nav-links">
              <li><a href="#features">Catalog Workflows</a></li>
              <li><a href="#intelligence">Library Intel</a></li>
              <li><a href="#developers">API Portal</a></li>
              <li><Link className="btn btn-outline" to="/login" style={{ padding: '8px 16px', borderRadius: '6px' }}>Sign In</Link></li>
            </ul>
          </div>
        </header>

        <main>
          {/* Hero Area */}
          <section className="hero">
            <div className="landing-container hero-grid">
              <div className="hero-text">
                <span className="hero-tag">The Modern Academic Core</span>
                <h1>Every Academic Volume. <span>Intelligently Shelved.</span></h1>
                <p>CampusShelf brings physical book catalogs, real-time tracking, student borrow queues, and cloud research journals into one singular unified platform.</p>
                <div className="hero-btns">
                  <a href="#features" className="btn btn-primary">Explore Workflows</a>
                  <Link to="/login" className="btn btn-outline">Go to Portal</Link>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="hero-visual hover-lift" aria-hidden="true">
                <div className="search-mockup">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <input type="text" value="Find books on distributed operating systems..." readOnly />
                </div>
                <div className="book-stack-preview">
                  <div className="book-spine-card hover-lift">
                    <h4>Modern OS</h4>
                    <span>Tanenbaum</span>
                    <span className="status-badge">Shelf A3</span>
                  </div>
                  <div className="book-spine-card hover-lift">
                    <h4>Clean Code</h4>
                    <span>R. Martin</span>
                    <span className="status-badge">Shelf B1</span>
                  </div>
                  <div className="book-spine-card hover-lift">
                    <h4>Algorithms</h4>
                    <span>Cormen</span>
                    <span className="status-badge" style={{ background: '#fce8e6', color: '#c53030' }}>On Loan</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Workflows & Features */}
          <section className="features" id="features">
            <div className="landing-container">
              <div className="section-header">
                <h2>One Unified Library Interface.</h2>
                <p>Eliminate old paper slips and clunky catalog engines. Provide students and administrators with native automated cataloging workflows.</p>
              </div>

              {/* Workflow 1: Natural Language Discovery */}
              <div className="feature-row">
                <div className="feature-text">
                  <h3>Natural Language Discovery</h3>
                  <p>Students don't need to struggle with exact titles, rigid keywords, or broken ISBN tags. They can type open, conversational search phrases—exactly how they would describe a concept to a professor—and the library engine returns contextually ranked book volumes instantly.</p>
                </div>
                <div className="feature-visual-box hover-lift" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ background: 'var(--color-bg-pure)', border: '1px solid var(--color-border)', borderRadius: '12px', width: '100%', maxWidth: '380px', boxShadow: 'var(--shadow-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ background: 'var(--color-bg-parchment)', border: '1.5px solid var(--color-primary)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', fontWeight: '500' }}>"books on how compiler architectures work"</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--color-accent-green)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--color-accent-green)', borderRadius: '50%' }}></span>
                      <span>2 results found</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="hover-lift" style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '6px', background: 'var(--color-bg-parchment)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--color-text-dark)', lineHeight: '1.3', fontWeight: '700' }}>Compilers: Principles, Techniques, and Tools</h5>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Aho, Lam, Sethi, Ullman</span>
                        </div>
                        <span className="status-badge" style={{ whiteSpace: 'nowrap', marginLeft: '12px' }}>Shelf D2</span>
                      </div>
                      <div className="hover-lift" style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '6px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: '0.85' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--color-text-dark)', lineHeight: '1.3', fontWeight: '700' }}>Engineering a Compiler</h5>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Keith Cooper, Linda Torczon</span>
                        </div>
                        <span className="status-badge" style={{ whiteSpace: 'nowrap', marginLeft: '12px' }}>Shelf D4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow: Interactive AI Library Chat Assistant */}
              <div className="feature-row">
                <div className="feature-text">
                  <h3>Interactive AI Chat Assistant</h3>
                  <p>A conversational library companion accessible right from the student dashboard. Students can ask complex follow-up questions, pinpoint exact shelf locations, verify real-time availability, or get reading suggestions tailored to their major.</p>
                  <ul style={{ listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ color: 'var(--color-accent-green)' }}>✔</span> Grounded in your live library catalog inventory
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ color: 'var(--color-accent-green)' }}>✔</span> Instant answers on fine status and account renewals
                    </li>
                  </ul>
                </div>
                <div className="feature-visual-box hover-lift" aria-hidden="true">
                  <div style={{ background: 'var(--color-bg-pure)', border: '1px solid var(--color-border)', borderRadius: '12px', width: '100%', maxWidth: '380px', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', height: '290px', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--color-secondary)', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>CampusShelf AI Bot</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px' }}>Live Catalog Sync</span>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1, overflowY: 'auto', background: 'var(--color-bg-parchment)' }}>
                      <div className="hover-lift" style={{ alignSelf: 'flex-end', background: 'white', border: '1px solid var(--color-border)', fontSize: '0.8rem', padding: '8px 12px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', color: 'var(--color-text-dark)' }}>
                        Is "Introduction to Algorithms" available, and where can I find it?
                      </div>
                      <div className="hover-lift" style={{ alignSelf: 'flex-start', background: 'rgba(30, 58, 138, 0.05)', borderLeft: '3px solid var(--color-secondary)', fontSize: '0.8rem', padding: '8px 12px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', color: 'var(--color-text-dark)' }}>
                        Yes, we have <strong>2 copies available</strong> right now! They are shelved in the <strong>Engineering Wing, Shelf B4</strong>.
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Type a message to the library...</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow 2: Borrowing & Automatic Reservations */}
              <div className="feature-row">
                <div className="feature-text">
                  <h3>Borrowing & Queue Protocols</h3>
                  <p>Request item checkouts, coordinate secure digital handshakes for system verification, monitor upcoming due dates, and allow immediate queue assignments if all hardcopies are out on active loans.</p>
                </div>
                <div className="feature-visual-box hover-lift" aria-hidden="true">
                  <div className="borrow-slip hover-lift">
                    <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '12px', borderBottom: '2px solid var(--color-primary)', fontWeight: '700' }}>LOAN ACCOUNTABILITY DETAILED DEPOSIT</h4>
                    <div className="slip-line"><span>Item ID:</span> <strong>#CS-8942</strong></div>
                    <div className="slip-line"><span>Return Deadline:</span> <strong>14 Days</strong></div>
                    <div className="slip-line"><span>Renewals Allowed:</span> <strong>2 Remaining</strong></div>
                  </div>
                </div>
              </div>

              {/* Workflow 3: Cloud Vault Split */}
              <div className="feature-row">
                <div className="feature-text">
                  <h3>Asynchronous Vault Management</h3>
                  <p>Store, secure, and dynamically link external electronic publications, comprehensive resource text documents, and supplementary files cleanly alongside active inventory registers.</p>
                </div>
                <div className="feature-visual-box hover-lift" aria-hidden="true">
                  <div className="vault-split">
                    <div className="vault-card hover-lift" style={{ borderTop: '4px solid var(--color-secondary)' }}>
                      <span className="icon">📘</span>
                      <h5 style={{ fontWeight: '700' }}>Physical Copy</h5>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>3 Units Available</span>
                    </div>
                    <div className="vault-card hover-lift" style={{ borderTop: '4px solid var(--color-accent-green)' }}>
                      <span className="icon">💾</span>
                      <h5 style={{ fontWeight: '700' }}>Cloud Resource</h5>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-green)' }}>PDF Attached</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow 4: Secure Micro-Fines */}
              <div className="feature-row">
                <div className="feature-text">
                  <h3>Automated Fine Calculations</h3>
                  <p>System tracking metrics trigger instantaneous late account deductions for past-due assets automatically. Students settle ledger balances smoothly with secure instant processing gates.</p>
                </div>
                <div className="feature-visual-box hover-lift" aria-hidden="true">
                  <div className="fine-slip hover-lift">
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Overdue Balance Statement</span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '8px 0', fontWeight: '700' }}>₦1,450.00</div>
                    <div style={{ fontSize: '0.8rem', color: '#c53030', marginBottom: '16px', fontWeight: '600' }}>Accumulation rate: ₦0.50 per day past due</div>
                    <div style={{ background: '#1e3a8a', color: 'white', fontSize: '0.85rem', padding: '8px', borderRadius: '4px', fontWeight: '600', textAlign: 'center' }}>Pay with Paystack</div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Administrative Metrics Section */}
          <section className="analytics-dashboard" id="intelligence">
            <div className="landing-container">
              <div className="dashboard-container hover-lift">
                <div style={{ maxWidth: '550px' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Library Operations Desk</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', margin: '12px 0 16px 0', fontWeight: '700' }}>Comprehensive Analytical Overviews</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>Administrators maintain oversight with instant visual distributions highlighting total circulation statistics, historical records, and ongoing fine balances.</p>
                </div>

                <div className="metrics-row" aria-hidden="true">
                  <div className="metric-card hover-lift">
                    <h5>Active Institutional Loans</h5>
                    <p>1,248</p>
                  </div>
                  <div className="metric-card hover-lift">
                    <h5>Catalog Volume</h5>
                    <p>5,420</p>
                  </div>
                  <div className="metric-card hover-lift">
                    <h5>Fine Ledgers (Collected)</h5>
                    <p>₦245k</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* System API Architecture Section */}
          <section className="api-section" id="developers">
            <div className="landing-container api-grid">
              <div className="api-text">
                <h2>Clean System Integration Engine</h2>
                <p>CampusShelf exposes modular Restful endpoints secured by industry standard JWT authentication tokens. Connect external microservices effortlessly using standardized clean JSON records.</p>
              </div>
              <div className="code-window hover-lift" aria-hidden="true">
                <pre className="code-block hover-lift">
{`GET /api/libraryitems/search?query=tanenbaum
Authorization: Bearer <jwt_handshake_token>

// Response Structure
[
  {
    "id": "item-9024",
    "title": "Modern Operating Systems",
    "author": "Andrew S. Tanenbaum",
    "shelfLocation": "Block-A3",
    "availableCopies": 2
  }
]`}
                </pre>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="landing-container">
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-text-dark)', marginBottom: '8px', fontWeight: '700' }}>Campus Shelf</p>
            <p>
              &copy; 2026 Campus Shelf Core Framework Platform. All library metadata processing complies with strict institutional security access protocols. <a href="https://github.com/Dubjay18" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>@jay</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
