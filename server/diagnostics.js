const fs = require("fs");
const path = require("path");

const graph = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "concept-graph.json"), "utf-8"));
const questionBank = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "questions.json"), "utf-8"));

/**
 * Walks the dependency graph from a starting node down to its prerequisites.
 * Used to build the "path" the frontend highlights, once a root misconception
 * node is known.
 */
function getPathToRoot(rootNodeId, surfaceNodeId = "factoring_quadratics") {
  // BFS/DFS from surface node down to rootNodeId following depends_on edges.
  const visited = new Set();
  const stack = [[surfaceNodeId]];

  while (stack.length) {
    const path = stack.pop();
    const current = path[path.length - 1];
    if (current === rootNodeId) return path;
    if (visited.has(current)) continue;
    visited.add(current);

    const node = graph.nodes[current];
    if (!node) continue;
    for (const dep of node.depends_on) {
      stack.push([...path, dep]);
    }
  }
  // Root not reachable from the surface node via real depends_on edges.
  // This indicates a graph data bug (a misconception mapped to an
  // unconnected node) — fail loudly rather than fabricate a fake edge,
  // since a fake edge would render as a real connection on the frontend.
  throw new Error(
    `Graph error: node "${rootNodeId}" is not reachable from "${surfaceNodeId}" via depends_on edges. Check concept-graph.json.`
  );
}

function getQuestionById(id) {
  return questionBank.questions.find((q) => q.id === id) || null;
}

function getAllQuestions() {
  return questionBank.questions;
}

function getMisconceptionTypes() {
  return graph.misconception_types;
}

function getNode(nodeId) {
  return graph.nodes[nodeId] || null;
}

function getGraphSummary() {
  // Compact representation for the frontend to render the full graph.
  return {
    subject: graph.subject,
    nodes: Object.entries(graph.nodes).map(([id, n]) => ({
      id,
      label: n.label,
      depends_on: n.depends_on,
    })),
  };
}

module.exports = {
  graph,
  getPathToRoot,
  getQuestionById,
  getAllQuestions,
  getMisconceptionTypes,
  getNode,
  getGraphSummary,
};
