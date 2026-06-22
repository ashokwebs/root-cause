import React from "react";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Animated background nodes */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__node hero__node--1" />
        <div className="hero__node hero__node--2" />
        <div className="hero__node hero__node--3" />
        <div className="hero__node hero__node--4" />
        <div className="hero__node hero__node--5" />
        <div className="hero__line hero__line--1" />
        <div className="hero__line hero__line--2" />
        <div className="hero__line hero__line--3" />
        <div className="hero__gradient" />
      </div>

      <div className="container hero__content">
        <div className="hero__badge reveal visible">
          <span className="glow-dot" />
          <span>HACKFEST'26 · Team OSPRED</span>
        </div>

        <h1 className="hero__title reveal visible">
          Your student got the<br />
          wrong answer.<br />
          <span className="gradient-text">That's not the real problem.</span>
        </h1>

        <p className="hero__subtitle reveal visible">
          Root Cause is a diagnostic tutor that traces a wrong answer back to the
          concept a student actually hasn't mastered — then teaches <em>that</em>, first.
        </p>

        <div className="hero__actions reveal visible">
          <a href="#demo" className="btn-primary">
            Try the live demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#how-it-works" className="btn-secondary">
            How it works
          </a>
        </div>

        <div className="hero__stats reveal visible">
          <div className="hero__stat">
            <span className="hero__stat-num">5</span>
            <span className="hero__stat-label">Misconception<br />categories</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">8</span>
            <span className="hero__stat-label">Concept graph<br />nodes</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">&lt;2s</span>
            <span className="hero__stat-label">Diagnosis<br />latency</span>
          </div>
        </div>
      </div>
    </section>
  );
}
