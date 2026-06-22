import React, { useMemo } from "react";

const LAYOUT = {
  factoring_quadratics:   { x: 300, y: 40 },
  distributive_property:  { x: 150, y: 160 },
  sign_rules:              { x: 450, y: 160 },
  finding_factor_pairs:   { x: 300, y: 160 },
  integer_multiplication: { x: 90,  y: 290 },
  variable_notation:      { x: 230, y: 290 },
  integer_addition:       { x: 450, y: 290 },
  combining_like_terms:   { x: 340, y: 290 },
};

export default function ConceptGraph({ nodes, path }) {
  const pathSet = useMemo(() => new Set(path || []), [path]);
  const rootId = path && path.length ? path[path.length - 1] : null;

  const edges = useMemo(() => {
    const list = [];
    nodes.forEach((n) => {
      n.depends_on.forEach((depId) => {
        if (LAYOUT[n.id] && LAYOUT[depId]) {
          list.push({ from: n.id, to: depId });
        }
      });
    });
    return list;
  }, [nodes]);

  return (
    <svg viewBox="0 0 560 360" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* Background grid for depth */}
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => {
        const a = LAYOUT[e.from];
        const b = LAYOUT[e.to];
        const isHighlighted = pathSet.has(e.from) && pathSet.has(e.to);
        return (
          <line
            key={i}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={isHighlighted ? "var(--signal)" : "rgba(91,100,120,0.25)"}
            strokeWidth={isHighlighted ? 2.5 : 1}
            strokeDasharray={isHighlighted ? "none" : "4 4"}
            style={{ transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
            filter={isHighlighted ? "url(#glow)" : "none"}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const pos = LAYOUT[n.id];
        if (!pos) return null;
        const isRoot = n.id === rootId;
        const isOnPath = pathSet.has(n.id);
        const isSurface = n.id === "factoring_quadratics";

        let fill = "#2A3248";
        let stroke = "#3D4660";
        let r = 8;
        let labelColor = "#8A8578";

        if (isSurface) { fill = "#3D4660"; stroke = "#5B6478"; r = 10; labelColor = "#C9C5BA"; }
        if (isOnPath && !isRoot) { fill = "#4A3A28"; stroke = "var(--signal)"; r = 9; labelColor = "var(--signal-light)"; }
        if (isRoot) { fill = "var(--signal)"; stroke = "var(--signal)"; r = 13; labelColor = "var(--signal)"; }

        return (
          <g key={n.id}>
            {/* Root cause pulse ring */}
            {isRoot && (
              <>
                <circle cx={pos.x} cy={pos.y} r={r} fill="var(--signal)" opacity={0.15}>
                  <animate attributeName="r" values={`${r};${r + 20}`} dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx={pos.x} cy={pos.y} r={r} fill="var(--signal)" opacity={0.1}>
                  <animate attributeName="r" values={`${r};${r + 14}`} dur="1.8s" begin="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            {/* Node fill */}
            <circle
              cx={pos.x} cy={pos.y} r={r}
              fill={fill}
              stroke={stroke}
              strokeWidth={isRoot ? 0 : 1.5}
              style={{ transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
            {/* Label */}
            <text
              x={pos.x} y={pos.y + r + 18}
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize={isRoot ? "10" : "9"}
              fontWeight={isRoot || isSurface ? 600 : 400}
              fill={labelColor}
              style={{ transition: "fill 0.5s" }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
