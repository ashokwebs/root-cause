const {
  getQuestionById, getMisconceptionTypes, getNode,
  getPathToRoot, classifyMisconception
} = require("./_helpers");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { questionId, studentAnswer } = req.body || {};
  if (!questionId || !studentAnswer) {
    return res.status(400).json({ error: "questionId and studentAnswer are required." });
  }

  const question = getQuestionById(questionId);
  if (!question) {
    return res.status(404).json({ error: `No question found with id "${questionId}".` });
  }

  const isCorrect = studentAnswer.trim() === question.correct_answer.trim();
  if (isCorrect) {
    return res.status(200).json({
      correct: true,
      message: "Correct — no diagnosis needed.",
    });
  }

  try {
    const diagnosis = classifyMisconception({
      questionPrompt: question.prompt,
      correctAnswer: question.correct_answer,
      studentAnswer,
    });

    const misconceptionTypes = getMisconceptionTypes();
    const matchedType = misconceptionTypes.find((m) => m.id === diagnosis.misconception_id);
    const rootNodeId = matchedType.maps_to_node;
    const rootNode = getNode(rootNodeId);
    const traversalPath = getPathToRoot(rootNodeId);

    return res.status(200).json({
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
    return res.status(502).json({
      error: "Diagnosis engine failed.",
      detail: err.message,
    });
  }
};
