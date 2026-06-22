import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchQuestions, fetchGraph, diagnose } from "../api.js";
import ConceptGraph from "../ConceptGraph.jsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function LiveDemo() {
  const [questions, setQuestions] = useState([]);
  const [graphNodes, setGraphNodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isWrong, setIsWrong] = useState(null); // true/false immediately on click
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initError, setInitError] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [qs, graph] = await Promise.all([fetchQuestions(), fetchGraph()]);
        qs.forEach(q => {
          q.options = shuffleArray(q.options);
        });
        setQuestions(shuffleArray(qs));
        setGraphNodes(graph.nodes);
      } catch (e) {
        setInitError(e.message);
      }
    }
    init();
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const currentQuestion = questions[currentIndex];

  const diagnoseWithRetry = async (qId, answer, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await diagnose(qId, answer);
      } catch (e) {
        const isRateLimit = e.message?.includes("429") || e.message?.includes("quota") || e.message?.includes("rate");
        if (isRateLimit && i < retries - 1) {
          await new Promise(r => setTimeout(r, (i + 1) * 3000));
          continue;
        }
        throw e;
      }
    }
  };

  const handleSelect = useCallback(
    async (option) => {
      if (selectedAnswer || !currentQuestion) return;
      setSelectedAnswer(option);
      setError(null);

      const correct = option.trim() === currentQuestion.correct_answer.trim();
      setIsWrong(!correct);

      // Log correct attempt to Firebase immediately
      if (correct) {
        try {
          await addDoc(collection(db, "student_attempts"), {
            studentName,
            questionTopic: "Factoring Quadratics",
            isCorrect: true,
            rootCause: null,
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.error("Failed to save to Firebase:", err);
        }
        setDiagnosis({ correct: true });
        return;
      }

      setLoading(true);
      const savedIndex = currentIndexRef.current;
      
      try {
        const result = await diagnoseWithRetry(currentQuestion.id, option);
        
        if (savedIndex !== currentIndexRef.current) return;
        
        setDiagnosis(result);

        // Save wrong attempt to Firebase
        if (result && result.correct === false) {
          try {
            await addDoc(collection(db, "student_attempts"), {
              studentName,
              questionTopic: "Factoring Quadratics",
              isCorrect: false,
              misconception: result.misconception.label || "Wrong Option",
              rootCause: result.root_cause.label || "Finding factor pairs",
              timestamp: new Date().toISOString()
            });
          } catch (err) {
            console.error("Failed to save to Firebase:", err);
          }
        }

      } catch (e) {
        if (savedIndex !== currentIndexRef.current) return;
        const msg = e.message?.includes("quota") || e.message?.includes("429")
          ? "Rate limit reached — please wait a few seconds and try the next question."
          : e.message;
        setError(msg);
      } finally {
        if (savedIndex === currentIndexRef.current) {
          setLoading(false);
        }
      }
    },
    [selectedAnswer, currentQuestion]
  );

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsWrong(null);
    setDiagnosis(null);
    setError(null);
    setCurrentIndex((i) => (i + 1) % questions.length);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsWrong(null);
    setDiagnosis(null);
    setError(null);
  };

  return (
    <section className="section demo-section" id="demo">
      <div className="container">
        <div className="demo-section__header">
          <div className="section-label reveal">Live Demo</div>
          <h2 className="section-title reveal">
            See the diagnosis in action
          </h2>
          <p className="section-subtitle reveal">
            Select a wrong answer below and watch Root Cause trace the error back to its true prerequisite gap.
          </p>
        </div>

        <div className="demo-panel glass-card reveal">
          <div className="demo-panel__topbar">
            <div className="demo-panel__topbar-left">
              <div className="demo-panel__dots">
                <span /><span /><span />
              </div>
              <span className="demo-panel__label">deterministic parser</span>
            </div>
            {currentQuestion && (
              <span className="demo-panel__counter">
                {currentIndex + 1} / {questions.length}
              </span>
            )}
          </div>

          {initError ? (
            <div className="demo-panel__error-state">
              <div className="demo-panel__error-icon">⚠</div>
              <div className="demo-panel__error-title">Backend not reachable</div>
              <p>{initError}</p>
              <code>cd server && node index.js</code>
            </div>
          ) : !currentQuestion ? (
            <div className="demo-panel__loading">
              <div className="demo-panel__spinner" />
              <span>Connecting to deterministic parser…</span>
            </div>
          ) : !hasEnteredName ? (
            <div className="demo-panel__body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: '24px', marginBottom: '16px' }}>Welcome to Root Cause</h3>
              <p style={{ color: 'var(--slate)', marginBottom: '32px', maxWidth: '400px' }}>Enter your name to begin the diagnostic tutoring session. Your progress will be sent to the Teacher Dashboard in real-time.</p>
              <form onSubmit={(e) => { e.preventDefault(); if (studentName.trim()) setHasEnteredName(true); }} style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '300px' }}>
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)} 
                  placeholder="Your Name" 
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--paper)', color: '#fff', fontFamily: 'var(--mono)', fontSize: '14px', outline: 'none' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>Start</button>
              </form>
            </div>
          ) : (
            <>
              <div className="demo-panel__body">
                <div className="demo-panel__left">
                  <div className="demo-panel__q-header">
                    <span className="demo-panel__q-badge">Question {currentQuestion.id.toUpperCase()}</span>
                    <span className="demo-panel__q-topic">Factoring Quadratics</span>
                  </div>

                  <div className="demo-panel__question">
                    {currentQuestion.prompt}
                  </div>

                  <div className="demo-panel__options-label">Select an answer:</div>
                  <div className="demo-panel__options">
                    {currentQuestion.options.map((opt, i) => {
                      const isSelected = selectedAnswer === opt;
                      const isCorrectOption = opt === currentQuestion.correct_answer;
                      let cls = "demo-panel__opt";
                      if (selectedAnswer) {
                        if (isSelected && isWrong) cls += " demo-panel__opt--wrong";
                        if (isCorrectOption) cls += " demo-panel__opt--correct";
                      }
                      return (
                        <button
                          key={opt}
                          className={cls}
                          disabled={Boolean(selectedAnswer)}
                          onClick={() => handleSelect(opt)}
                        >
                          <span className="demo-panel__opt-letter">{String.fromCharCode(65 + i)}</span>
                          <span className="demo-panel__opt-text">{opt}</span>
                          {isSelected && isWrong && (
                            <span className="demo-panel__opt-tag">your pick</span>
                          )}
                          {isCorrectOption && selectedAnswer && isWrong && (
                            <span className="demo-panel__opt-tag demo-panel__opt-tag--correct">correct</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="demo-panel__diagnosis">
                    {isWrong === true && !diagnosis && !loading && !error && (
                      <div className="demo-panel__diag-line demo-panel__diag-wrong-immediate">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        Incorrect — starting deterministic trace…
                      </div>
                    )}
                    {error && (
                      <div className="demo-panel__diag-line demo-panel__diag-error">
                        {error}
                      </div>
                    )}
                    {isWrong === false && (
                      <div className="demo-panel__diag-line demo-panel__diag-correct">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mastered)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        Correct — no diagnosis needed. This concept is mastered.
                      </div>
                    )}
                    {diagnosis?.correct === false && (
                      <div className="demo-panel__diag-result">
                        <div className="demo-panel__diag-line">
                          <span className="demo-panel__diag-badge">MISCONCEPTION</span>
                          {diagnosis.misconception.explanation}
                        </div>
                        <div className="demo-panel__diag-line demo-panel__diag-root">
                          <span className="demo-panel__diag-badge demo-panel__diag-badge--root">ROOT CAUSE</span>
                          {diagnosis.root_cause.label}
                          <span className="demo-panel__diag-note">
                            — not {graphNodes.find(n => n.id === "factoring_quadratics")?.label.toLowerCase() || "factoring"} itself
                          </span>
                        </div>
                        <div className="demo-panel__diag-lesson">
                          <div className="demo-panel__diag-lesson-header">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mastered)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                            Micro-lesson
                          </div>
                          {diagnosis.micro_lesson}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="demo-panel__right">
                  <div className="demo-panel__graph-header">Concept Dependency Graph</div>
                  {graphNodes.length > 0 && (
                    <ConceptGraph nodes={graphNodes} path={diagnosis?.path} />
                  )}
                  {!diagnosis && (
                    <div className="demo-panel__graph-hint">
                      Select a wrong answer to see the diagnostic path light up
                    </div>
                  )}
                </div>
              </div>

              <div className="demo-panel__footer">
                {selectedAnswer && (
                  <button className="btn-primary" onClick={handleNext}>
                    Next question
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                <button
                  className="demo-panel__reset"
                  onClick={handleReset}
                  disabled={!selectedAnswer}
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
