const path = require("path");
const fs = require("fs");

const graph = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "server", "data", "concept-graph.json"), "utf-8"));
const questionBank = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "server", "data", "questions.json"), "utf-8"));

function getPathToRoot(rootNodeId, surfaceNodeId = "factoring_quadratics") {
  const visited = new Set();
  const stack = [[surfaceNodeId]];
  while (stack.length) {
    const p = stack.pop();
    const current = p[p.length - 1];
    if (current === rootNodeId) return p;
    if (visited.has(current)) continue;
    visited.add(current);
    const node = graph.nodes[current];
    if (!node) continue;
    for (const dep of node.depends_on) {
      stack.push([...p, dep]);
    }
  }
  throw new Error(`Graph error: node "${rootNodeId}" is not reachable from "${surfaceNodeId}".`);
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
  return {
    subject: graph.subject,
    nodes: Object.entries(graph.nodes).map(([id, n]) => ({
      id,
      label: n.label,
      depends_on: n.depends_on,
    })),
  };
}

function classifyMisconception({ questionPrompt, correctAnswer, studentAnswer }) {
  let bVal = 0;
  let cVal = 0;
  const cleanPrompt = questionPrompt.replace(/\s+/g, '');
  const match = cleanPrompt.match(/x\^2([+-]\d*x)?([+-]\d+)?/);
  if (match) {
    if (match[1]) {
      let bStr = match[1].replace('x', '');
      if (bStr === '+') bStr = '1';
      if (bStr === '-') bStr = '-1';
      bVal = parseInt(bStr, 10);
    }
    if (match[2]) {
      cVal = parseInt(match[2], 10);
    }
  }
  const cDisplay = cVal !== 0 ? cVal : "C";
  const bDisplay = bVal !== 0 ? bVal : "B";
  return {
    misconception_id: "wrong_factor_pair",
    explanation: "You used the coefficients as the factors.",
    micro_lesson: `The factors must multiply to the constant term (${cDisplay}) and add to the middle coefficient (${bDisplay}).`
  };
}

module.exports = {
  getPathToRoot, getQuestionById, getAllQuestions,
  getMisconceptionTypes, getNode, getGraphSummary,
  classifyMisconception
};
