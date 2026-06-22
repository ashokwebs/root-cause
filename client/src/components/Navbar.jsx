import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { id: "problem", label: "Problem" },
  { id: "how-it-works", label: "How It Works" },
  { id: "demo", label: "Live Demo" },
  { id: "architecture", label: "Architecture" },
  { id: "team", label: "Team" },
];

export default function Navbar({ activeSection, view, setView }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileOpen(false);
    if (view !== "landing") {
      setView("landing");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a 
          href="#" 
          className="navbar__brand" 
          onClick={(e) => {
            e.preventDefault();
            setView("landing");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="2.4" stroke="var(--signal)" strokeWidth="1.6" />
            <circle cx="5" cy="18" r="2.4" stroke="var(--slate)" strokeWidth="1.6" />
            <circle cx="19" cy="18" r="2.4" stroke="var(--slate)" strokeWidth="1.6" />
            <path d="M12 7.4V12M12 12L6.5 16M12 12L17.5 16" stroke="var(--slate)" strokeWidth="1.4" />
          </svg>
          <span>Root Cause</span>
        </a>

        <div className={`navbar__links ${mobileOpen ? "navbar__links--open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`navbar__link ${view === "landing" && activeSection === link.id ? "navbar__link--active" : ""}`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {view === "landing" ? (
          <button className="navbar__cta" onClick={() => setView("teacher")}>
            Teacher Portal
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        ) : (
          <button className="navbar__cta" onClick={() => setView("landing")}>
            Back to Demo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={mobileOpen ? "open" : ""} />
          <span className={mobileOpen ? "open" : ""} />
        </button>
      </div>
    </nav>
  );
}
