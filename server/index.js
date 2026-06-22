const http = require("http");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnv();

const {
  getAllQuestions,
  getQuestionById,
  getGraphSummary,
  getNode,
  getPathToRoot,
  getMisconceptionTypes,
} = require("./diagnostics");
const { classifyMisconception } = require("./parser");

const PORT = process.env.PORT || 4000;

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // GET /api/health
  if (url.pathname === "/api/health" && req.method === "GET") {
    return sendJson(res, 200, { status: "ok" });
  }

  // GET /api/questions
  if (url.pathname === "/api/questions" && req.method === "GET") {
    return sendJson(res, 200, { questions: getAllQuestions() });
  }

  // GET /api/graph
  if (url.pathname === "/api/graph" && req.method === "GET") {
    return sendJson(res, 200, getGraphSummary());
  }

  // POST /api/diagnose
  if (url.pathname === "/api/diagnose" && req.method === "POST") {
    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      return sendJson(res, 400, { error: "Invalid JSON body." });
    }

    const { questionId, studentAnswer } = body;
    if (!questionId || !studentAnswer) {
      return sendJson(res, 400, { error: "questionId and studentAnswer are required." });
    }

    const question = getQuestionById(questionId);
    if (!question) {
      return sendJson(res, 404, { error: `No question found with id "${questionId}".` });
    }

    const isCorrect = studentAnswer.trim() === question.correct_answer.trim();
    if (isCorrect) {
      return sendJson(res, 200, {
        correct: true,
        message: "Correct — no diagnosis needed. This node is mastered.",
      });
    }

    try {
      const diagnosis = await classifyMisconception({
        questionPrompt: question.prompt,
        correctAnswer: question.correct_answer,
        studentAnswer,
      });

      const misconceptionTypes = getMisconceptionTypes();
      const matchedType = misconceptionTypes.find((m) => m.id === diagnosis.misconception_id);
      const rootNodeId = matchedType.maps_to_node;
      const rootNode = getNode(rootNodeId);
      const traversalPath = getPathToRoot(rootNodeId);

      return sendJson(res, 200, {
        correct: false,
        misconception: {
          id: diagnosis.misconception_id,
          label: matchedType.label,
          explanation: diagnosis.explanation,
        },
        root_cause: {
          node_id: rootNodeId,
          label: rootNode.label,
          description: rootNode.description,
        },
        micro_lesson: diagnosis.micro_lesson,
        path: traversalPath,
      });
    } catch (err) {
      console.error("Diagnosis error:", err.message);
      return sendJson(res, 502, {
        error: "Diagnosis engine failed. Please try again.",
        detail: err.message,
      });
    }
  }

  // 404 fallback
  sendJson(res, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`Root Cause API listening on port ${PORT}`);
});
