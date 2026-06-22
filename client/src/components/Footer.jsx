import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="2.4" stroke="var(--signal)" strokeWidth="1.6" />
              <circle cx="5" cy="18" r="2.4" stroke="var(--slate)" strokeWidth="1.6" />
              <circle cx="19" cy="18" r="2.4" stroke="var(--slate)" strokeWidth="1.6" />
              <path d="M12 7.4V12M12 12L6.5 16M12 12L17.5 16" stroke="var(--slate)" strokeWidth="1.4" />
            </svg>
            <span>Root Cause</span>
          </div>
          <div className="site-footer__text">
            Diagnostic tutoring prototype · HACKFEST'26 · Team OSPRED
          </div>
          <div className="site-footer__links">
            <a href="#hero">Top</a>
            <span className="site-footer__sep">·</span>
            <a href="#demo">Demo</a>
            <span className="site-footer__sep">·</span>
            <a href="#architecture">Architecture</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
