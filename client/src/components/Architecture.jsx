import React from "react";

export default function Architecture() {
  return (
    <section className="section architecture" id="architecture">
      <div className="container">
        <div className="architecture__header">
          <div className="section-label reveal">Architecture</div>
          <h2 className="section-title reveal">
            Rule-based, deterministic logic
          </h2>
          <p className="section-subtitle reveal">
            We deliberately kept the classification step small and bounded — so the system
            is predictable, auditable, and never produces incorrect diagnostic paths.
          </p>
        </div>

        <div className="architecture__diagram reveal">
          <div className="architecture__flow">
            {/* Input */}
            <div className="architecture__block architecture__block--input">
              <div className="architecture__block-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="architecture__block-label">Student Answer</div>
              <div className="architecture__block-desc">Wrong answer submitted</div>
            </div>

            <div className="architecture__arrow" aria-hidden="true">→</div>

            {/* Parse Step */}
            <div className="architecture__block architecture__block--parser">
              <div className="architecture__block-tag">PARSER STEP</div>
              <div className="architecture__block-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 014-4z" />
                  <path d="M10 17h4M11 21h2" />
                </svg>
              </div>
              <div className="architecture__block-label">Deterministic Classification</div>
              <div className="architecture__block-desc">
                Picks from a <strong>fixed set</strong> of known misconception IDs.
                Does not decide the graph. Does not do traversal.
              </div>
            </div>

            <div className="architecture__arrow" aria-hidden="true">→</div>

            {/* Deterministic Step */}
            <div className="architecture__block architecture__block--deterministic">
              <div className="architecture__block-tag architecture__block-tag--green">DETERMINISTIC</div>
              <div className="architecture__block-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--mastered)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="3" />
                  <circle cx="5" cy="19" r="3" />
                  <circle cx="19" cy="19" r="3" />
                  <path d="M12 8v3M9 14l-2 3M15 14l2 3" />
                </svg>
              </div>
              <div className="architecture__block-label">Graph Traversal</div>
              <div className="architecture__block-desc">
                Pre-authored concept graph. Plain BFS/DFS search.
                Same result every time — <strong>impossible to hallucinate</strong>.
              </div>
            </div>

            <div className="architecture__arrow" aria-hidden="true">→</div>

            {/* Output */}
            <div className="architecture__block architecture__block--output">
              <div className="architecture__block-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--mastered)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="architecture__block-label">Root Cause + Lesson</div>
              <div className="architecture__block-desc">Targeted micro-lesson on the real gap</div>
            </div>
          </div>
        </div>

        <div className="architecture__insight glass-card reveal">
          <div className="architecture__insight-icon">💡</div>
          <div>
            <div className="architecture__insight-title">Key Design Insight</div>
            <p className="architecture__insight-text">
              Every step in the pipeline is fully deterministic and easy to validate —
              we verify that the parser's response contains a valid misconception ID from
              our known categories before trusting it. Everything is authored data and deterministic code.
            </p>
          </div>
        </div>

        <div className="architecture__tech reveal">
          <div className="architecture__tech-title">Tech Stack</div>
          <div className="architecture__tech-badges">
            <div className="architecture__badge">
              <span className="architecture__badge-dot" style={{ background: "#68A063" }} />
              Node.js <span className="architecture__badge-note">(zero dependencies)</span>
            </div>
            <div className="architecture__badge">
              <span className="architecture__badge-dot" style={{ background: "#61DAFB" }} />
              React + Vite
            </div>
            <div className="architecture__badge">
              <span className="architecture__badge-dot" style={{ background: "var(--signal)" }} />
              Deterministic Parser Engine
            </div>
            <div className="architecture__badge">
              <span className="architecture__badge-dot" style={{ background: "var(--paper-dim)" }} />
              Hand-authored JSON Graph
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
