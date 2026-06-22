const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? "http://localhost:4000" : "");

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.detail ? `${data.error} ${data.detail}` : data.error;
    throw new Error(errorMsg || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE}/api/questions`);
  const data = await handleResponse(res);
  return data.questions;
}

export async function fetchGraph() {
  const res = await fetch(`${API_BASE}/api/graph`);
  return handleResponse(res);
}

export async function diagnose(questionId, studentAnswer) {
  const res = await fetch(`${API_BASE}/api/diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, studentAnswer }),
  });
  return handleResponse(res);
}
