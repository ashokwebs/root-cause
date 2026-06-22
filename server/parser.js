const { getMisconceptionTypes } = require("./diagnostics");

async function classifyMisconception({ questionPrompt, correctAnswer, studentAnswer }) {
  // Parse B and C from "Factor completely: x^2 + Bx + C"
  let bVal = 0;
  let cVal = 0;
  
  // Clean up whitespace to make regex matching easier
  const cleanPrompt = questionPrompt.replace(/\s+/g, '');
  // Matches x^2+Bx+C or x^2-Bx-C etc.
  // Note: this is a simple regex that assumes standard quadratic form formatting
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

  // If both B and C are parsed as 0 (e.g. regex failed), fallback to generic string
  const cDisplay = cVal !== 0 ? cVal : "C";
  const bDisplay = bVal !== 0 ? bVal : "B";

  // Return the exact hardcoded response requested by the user
  return {
    misconception_id: "wrong_factor_pair",
    explanation: "You used the coefficients as the factors.",
    micro_lesson: `The factors must multiply to the constant term (${cDisplay}) and add to the middle coefficient (${bDisplay}).`
  };
}

module.exports = { classifyMisconception };
