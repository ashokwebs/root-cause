import React from "react";

const MEMBERS = [
  {
    name: "Ashok P",
    role: "Full-Stack Developer",
    initial: "A",
    color: "var(--signal)",
  },
  {
    name: "Snigdha Gorai",
    role: "System Architecture",
    initial: "S",
    color: "var(--mastered)",
  },
];

export default function Team() {
  return (
    <section className="section team" id="team">
      <div className="container">
        <div className="team__header">
          <div className="section-label reveal">Team</div>
          <h2 className="section-title reveal">
            Built by <span className="gradient-text">Team OSPRED</span>
          </h2>
        </div>

        <div className="team__grid">
          {MEMBERS.map((member) => (
            <div key={member.name} className="team__card glass-card reveal">
              <div className="team__avatar" style={{ borderColor: member.color }}>
                <span style={{ color: member.color }}>{member.initial}</span>
              </div>
              <div className="team__info">
                <div className="team__name">{member.name}</div>
                <div className="team__role">{member.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="team__scope glass-card reveal">
          <div className="team__scope-title">Current Prototype Scope</div>
          <p className="team__scope-text">
            Deliberately scoped to <strong>one subject — high school algebra, factoring quadratics</strong> — with
            an 8-node concept graph and 8 seed practice questions. The graph format is subject-agnostic:
            the same engine extends to any topic with a defined prerequisite chain.
          </p>
          <div className="team__scope-future">
            <div className="team__scope-future-title">Future Directions</div>
            <div className="team__scope-items">
              <div className="team__scope-item">
                <span className="team__scope-dot" />
                Multi-subject concept graphs (physics, chemistry)
              </div>
              <div className="team__scope-item">
                <span className="team__scope-dot" />
                Teacher dashboard for class-wide weak concept visibility
              </div>
              <div className="team__scope-item">
                <span className="team__scope-dot" />
                Adaptive graph learning from aggregated answer patterns
              </div>
              <div className="team__scope-item">
                <span className="team__scope-dot" />
                Mobile-first responsive experience
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
