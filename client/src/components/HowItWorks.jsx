import React from "react";

const STEPS = [
  {
    num: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l2 2 4-4" />
      </svg>
    ),
    title: "Student answers wrong",
    desc: "A student selects an incorrect answer to a practice question. Instead of just marking it wrong, Root Cause activates its diagnostic engine.",
  },
  {
    num: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
    ),
    title: "Diagnostic Classification",
    desc: "A deterministic parsing engine mathematically analyzes the wrong answer against a fixed set of known misconception categories.",
  },
  {
    num: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
    ),
    title: "Graph Traversal",
    desc: "A deterministic graph search traces the path from the surface topic backward through the prerequisite dependency chain.",
  },
  {
    num: "04",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <circle cx="11" cy="11" r="3" />
      </svg>
    ),
    title: "Root cause identified",
    desc: "The actual prerequisite concept the student hasn't mastered is pinpointed — not the surface topic they got wrong, but the real underlying gap.",
  },
  {
    num: "05",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--mastered)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    title: "Micro-lesson generated",
    desc: "A short, targeted lesson on that one prerequisite concept is generated — addressing the real gap, not just re-explaining the symptom.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="container">
        <div className="how-it-works__header">
          <div className="section-label reveal">How It Works</div>
          <h2 className="section-title reveal">
            Five steps from wrong answer<br />
            to <span className="gradient-text">real understanding</span>
          </h2>
        </div>

        <div className="how-it-works__steps">
          {STEPS.map((step, i) => (
            <div key={step.num} className={`how-it-works__step reveal reveal-delay-${i + 1}`}>
              <div className="how-it-works__step-head">
                <div className="how-it-works__step-icon">{step.icon}</div>
                <span className="how-it-works__step-num">{step.num}</span>
              </div>
              <h3 className="how-it-works__step-title">{step.title}</h3>
              <p className="how-it-works__step-desc">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="how-it-works__connector" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
