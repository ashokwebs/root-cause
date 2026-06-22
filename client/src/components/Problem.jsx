import React from "react";

export default function Problem() {
  return (
    <section className="section problem" id="problem">
      <div className="container">
        <div className="problem__grid">
          <div className="problem__text">
            <div className="section-label reveal">The Problem</div>
            <h2 className="section-title reveal">
              Traditional tutors re-explain the symptom.<br />
              <span className="gradient-text">The real gap stays invisible.</span>
            </h2>
            <p className="section-subtitle reveal">
              A student misses a factoring problem. The tutor re-explains that exact problem.
              The student nods — and gets the next one wrong too, for the same invisible reason.
            </p>

            <div className="problem__callouts reveal">
              <div className="problem__callout">
                <div className="problem__callout-icon problem__callout-icon--bad">✗</div>
                <div>
                  <div className="problem__callout-title">Typical Tutor</div>
                  <div className="problem__callout-desc">"Let me re-explain this factoring problem step by step…"</div>
                </div>
              </div>
              <div className="problem__callout problem__callout--good">
                <div className="problem__callout-icon problem__callout-icon--good">✓</div>
                <div>
                  <div className="problem__callout-title">Root Cause</div>
                  <div className="problem__callout-desc">"You actually haven't mastered the distributive property. Let's fix <em>that</em> first."</div>
                </div>
              </div>
            </div>
          </div>

          <div className="problem__visual reveal">
            <div className="problem__diagram">
              <div className="problem__diagram-surface">
                <div className="problem__diagram-node problem__diagram-node--surface">
                  <span>Factoring</span>
                  <span className="problem__diagram-tag">Surface error</span>
                </div>
                <svg className="problem__diagram-arrow" viewBox="0 0 40 80" fill="none">
                  <path d="M20 0 L20 60 M10 50 L20 65 L30 50" stroke="var(--signal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="problem__diagram-chain">
                <div className="problem__diagram-node problem__diagram-node--mid">
                  Sign rules
                </div>
                <svg className="problem__diagram-arrow-sm" viewBox="0 0 40 50" fill="none">
                  <path d="M20 0 L20 35 M12 27 L20 40 L28 27" stroke="var(--slate)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="problem__diagram-node problem__diagram-node--root">
                  <span>Integer addition</span>
                  <span className="problem__diagram-tag problem__diagram-tag--root">← Root cause</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
