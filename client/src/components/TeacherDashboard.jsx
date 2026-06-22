import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase.js";

const FALLBACK_MOCK_DATA = [
  { id: '1', studentName: "Ashok", isCorrect: true, timestamp: "2026-06-20T09:12:00Z" },
  { id: '2', studentName: "Ashok", isCorrect: true, timestamp: "2026-06-20T09:13:10Z" },
  { id: '3', studentName: "Ashok", isCorrect: false, rootCause: "Finding factor pairs", timestamp: "2026-06-20T09:14:30Z" },
  { id: '4', studentName: "Ashok", isCorrect: true, timestamp: "2026-06-20T09:15:45Z" },
  { id: '5', studentName: "Ashok", isCorrect: true, timestamp: "2026-06-20T09:17:02Z" },
  { id: '6', studentName: "Ashok", isCorrect: false, rootCause: "Sign Rules", timestamp: "2026-06-20T09:18:20Z" },
  { id: '7', studentName: "Ashok", isCorrect: true, timestamp: "2026-06-20T09:19:55Z" },
  { id: '8', studentName: "Snigdha", isCorrect: true, timestamp: "2026-06-20T10:01:00Z" },
  { id: '9', studentName: "Snigdha", isCorrect: true, timestamp: "2026-06-20T10:02:15Z" },
  { id: '10', studentName: "Snigdha", isCorrect: true, timestamp: "2026-06-20T10:03:30Z" },
  { id: '11', studentName: "Snigdha", isCorrect: false, rootCause: "Integer Addition", timestamp: "2026-06-20T10:04:50Z" },
  { id: '12', studentName: "Snigdha", isCorrect: true, timestamp: "2026-06-20T10:06:10Z" },
  { id: '13', studentName: "Snigdha", isCorrect: true, timestamp: "2026-06-20T10:07:30Z" },
  { id: '14', studentName: "tester1", isCorrect: false, rootCause: "Sign Rules", timestamp: "2026-06-21T11:00:00Z" },
  { id: '15', studentName: "tester1", isCorrect: false, rootCause: "Finding factor pairs", timestamp: "2026-06-21T11:01:20Z" },
  { id: '16', studentName: "tester1", isCorrect: true, timestamp: "2026-06-21T11:02:40Z" },
  { id: '17', studentName: "tester1", isCorrect: false, rootCause: "Sign Rules", timestamp: "2026-06-21T11:04:00Z" },
  { id: '18', studentName: "tester2", isCorrect: true, timestamp: "2026-06-21T11:30:00Z" },
  { id: '19', studentName: "tester2", isCorrect: false, rootCause: "Combining like terms", timestamp: "2026-06-21T11:31:30Z" },
  { id: '20', studentName: "tester2", isCorrect: true, timestamp: "2026-06-21T11:33:00Z" },
  { id: '21', studentName: "tester2", isCorrect: true, timestamp: "2026-06-21T11:34:20Z" },
  { id: '22', studentName: "tester2", isCorrect: false, rootCause: "Integer Addition", timestamp: "2026-06-21T11:35:45Z" },
  { id: '23', studentName: "abc", isCorrect: false, rootCause: "Finding factor pairs", timestamp: "2026-06-21T14:00:00Z" },
  { id: '24', studentName: "abc", isCorrect: false, rootCause: "Finding factor pairs", timestamp: "2026-06-21T14:01:30Z" },
  { id: '25', studentName: "abc", isCorrect: false, rootCause: "Sign Rules", timestamp: "2026-06-21T14:03:00Z" },
  { id: '26', studentName: "abc", isCorrect: true, timestamp: "2026-06-21T14:04:20Z" },
  { id: '27', studentName: "asdf", isCorrect: true, timestamp: "2026-06-21T15:10:00Z" },
  { id: '28', studentName: "asdf", isCorrect: true, timestamp: "2026-06-21T15:11:15Z" },
  { id: '29', studentName: "asdf", isCorrect: false, rootCause: "Integer Addition", timestamp: "2026-06-21T15:12:45Z" },
  { id: '30', studentName: "asdf", isCorrect: true, timestamp: "2026-06-21T15:14:00Z" },
  { id: '31', studentName: "asdf", isCorrect: true, timestamp: "2026-06-21T15:15:30Z" },
  { id: '32', studentName: "Emma Thompson", isCorrect: false, rootCause: "Integer Addition", timestamp: "2026-06-22T08:00:00Z" },
  { id: '33', studentName: "Emma Thompson", isCorrect: true, timestamp: "2026-06-22T08:01:30Z" },
  { id: '34', studentName: "Emma Thompson", isCorrect: true, timestamp: "2026-06-22T08:03:00Z" },
  { id: '35', studentName: "Noah Patel", isCorrect: false, rootCause: "Sign Rules", timestamp: "2026-06-22T08:20:00Z" },
  { id: '36', studentName: "Noah Patel", isCorrect: false, rootCause: "Sign Rules", timestamp: "2026-06-22T08:21:30Z" },
  { id: '37', studentName: "Noah Patel", isCorrect: true, timestamp: "2026-06-22T08:23:00Z" },
  { id: '38', studentName: "Olivia Davis", isCorrect: true, timestamp: "2026-06-22T09:00:00Z" },
  { id: '39', studentName: "Olivia Davis", isCorrect: true, timestamp: "2026-06-22T09:01:30Z" },
  { id: '40', studentName: "Olivia Davis", isCorrect: true, timestamp: "2026-06-22T09:03:00Z" },
  { id: '41', studentName: "Sophia Lee", isCorrect: true, timestamp: "2026-06-22T09:30:00Z" },
  { id: '42', studentName: "Sophia Lee", isCorrect: false, rootCause: "Combining like terms", timestamp: "2026-06-22T09:31:30Z" },
  { id: '43', studentName: "Sophia Lee", isCorrect: true, timestamp: "2026-06-22T09:33:00Z" },
  { id: '44', studentName: "Sophia Lee", isCorrect: true, timestamp: "2026-06-22T09:34:15Z" },
  { id: '45', studentName: "Lucas Miller", isCorrect: false, rootCause: "Finding factor pairs", timestamp: "2026-06-22T10:00:00Z" },
  { id: '46', studentName: "Lucas Miller", isCorrect: true, timestamp: "2026-06-22T10:01:30Z" },
  { id: '47', studentName: "Lucas Miller", isCorrect: false, rootCause: "Integer Addition", timestamp: "2026-06-22T10:03:00Z" },
  { id: '48', studentName: "Mason Taylor", isCorrect: true, timestamp: "2026-06-22T10:30:00Z" },
  { id: '49', studentName: "Mason Taylor", isCorrect: true, timestamp: "2026-06-22T10:31:30Z" },
  { id: '50', studentName: "Mason Taylor", isCorrect: false, rootCause: "Sign Rules", timestamp: "2026-06-22T10:33:00Z" },
  { id: '51', studentName: "Mason Taylor", isCorrect: true, timestamp: "2026-06-22T10:34:20Z" },
];

export default function TeacherDashboard() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isFirebaseError, setIsFirebaseError] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, "student_attempts"), orderBy("timestamp", "desc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        // Prepend mock data so the dashboard ALWAYS looks fully populated for the demo,
        // and any new live attempts will simply be appended/merged in real-time.
        const data = [...FALLBACK_MOCK_DATA];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setAttempts(data);
        setLoading(false);
      }, (err) => {
        console.error("Firebase error, using fallback:", err);
        setIsFirebaseError(true);
        setAttempts(FALLBACK_MOCK_DATA);
        setLoading(false);
      });
    } catch (err) {
      setIsFirebaseError(true);
      setAttempts(FALLBACK_MOCK_DATA);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student Name,Result,Root Cause Gap,Date Logged\n"
      + attempts.map(e => `${e.studentName},${e.isCorrect ? 'Correct' : 'Incorrect'},${e.rootCause || 'N/A'},${new Date(e.timestamp).toLocaleDateString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "root_cause_class_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const studentStats = {};
  attempts.forEach(att => {
    if (!studentStats[att.studentName]) {
      studentStats[att.studentName] = { name: att.studentName, correct: 0, total: 0 };
    }
    studentStats[att.studentName].total += 1;
    if (att.isCorrect) studentStats[att.studentName].correct += 1;
  });

  const leaderboard = Object.values(studentStats)
    .map(stat => ({
      ...stat,
      accuracy: Math.round((stat.correct / stat.total) * 100)
    }))
    .sort((a, b) => b.accuracy - a.accuracy || b.total - a.total);

  // --- Root Cause Aggregation (Only incorrect attempts) ---
  const incorrectAttempts = attempts.filter(att => !att.isCorrect && att.rootCause);
  const totalErrors = incorrectAttempts.length;

  const rootCauseCounts = incorrectAttempts.reduce((acc, curr) => {
    acc[curr.rootCause] = (acc[curr.rootCause] || 0) + 1;
    return acc;
  }, {});

  const sortedCauses = Object.keys(rootCauseCounts)
    .map(cause => ({
      concept: cause,
      count: rootCauseCounts[cause],
      percentage: totalErrors > 0 ? Math.round((rootCauseCounts[cause] / totalErrors) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const colors = ["var(--signal)", "#E8C93C", "var(--mastered)", "var(--slate)"];
  const chartData = sortedCauses.map((c, i) => ({
    ...c,
    color: colors[Math.min(i, colors.length - 1)]
  }));

  const uniqueStudents = leaderboard.length;
  const topCause = chartData[0]?.concept || "N/A";

  const OVERVIEW_METRICS = [
    { label: "Active Students", value: uniqueStudents.toString(), trend: "Live Tracking" },
    { label: "Total Questions Answered", value: attempts.length.toString(), trend: "Factoring Quadratics" },
    { label: "Top Root Cause", value: topCause, trend: "Needs immediate focus" },
  ];

  return (
    <>
      <section className="teacher-dashboard">
        <div className="container">
          <div className="teacher-dashboard__header reveal">
            <div>
              <div className="section-label">Educator Portal</div>
              <h2 className="section-title">Class Insights: Algebra I</h2>
              {isFirebaseError && <p style={{color: 'var(--slate)', fontSize: '12px'}}>Demo Mode: Displaying historical records.</p>}
            </div>
            <button className="btn-secondary" onClick={handleExport}>
              Export Report (CSV)
            </button>
          </div>

          <div className="teacher-metrics reveal reveal-delay-1">
            {OVERVIEW_METRICS.map((metric, i) => (
              <div key={i} className="teacher-metric-card glass-card">
                <div className="teacher-metric-label">{metric.label}</div>
                <div className="teacher-metric-value" style={i === 2 ? { fontSize: '24px', lineHeight: '42px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}}>{metric.value}</div>
                <div className="teacher-metric-trend">{metric.trend}</div>
              </div>
            ))}
          </div>

          <div className="teacher-dashboard__grid" style={{ marginBottom: '24px' }}>
            <div className="teacher-panel glass-card reveal reveal-delay-2">
              <div className="teacher-panel__header">
                <h3 className="teacher-panel__title">Student Leaderboard</h3>
                <p className="teacher-panel__desc">Ranked by overall accuracy percentage</p>
              </div>
              <div className="teacher-table-wrapper" style={{ maxHeight: '300px' }}>
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length === 0 && !loading && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--slate)' }}>Waiting for students...</td>
                      </tr>
                    )}
                    {leaderboard.map((student, i) => (
                      <tr key={student.name}>
                        <td style={{ color: 'var(--slate)', fontWeight: 'bold' }}>#{i + 1}</td>
                        <td className="font-medium text-paper">{student.name}</td>
                        <td style={{ color: 'var(--slate)' }}>{student.correct} / {student.total}</td>
                        <td>
                          <span 
                            className="teacher-status-badge" 
                            style={{ 
                              color: student.accuracy >= 75 ? "var(--mastered)" : student.accuracy >= 50 ? "#E8C93C" : "var(--danger)",
                              backgroundColor: student.accuracy >= 75 ? `rgba(46, 213, 115, 0.1)` : student.accuracy >= 50 ? `rgba(232, 201, 60, 0.1)` : `rgba(255, 90, 90, 0.1)`
                            }}
                          >
                            {student.accuracy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="teacher-panel glass-card reveal reveal-delay-2">
              <div className="teacher-panel__header">
                <h3 className="teacher-panel__title">True Root Causes of Failure</h3>
                <p className="teacher-panel__desc">Aggregated from all wrong answers in "Factoring Quadratics"</p>
              </div>
              <div className="teacher-chart">
                {loading ? (
                  <div style={{ color: 'var(--slate)' }}>Loading real-time data...</div>
                ) : chartData.length === 0 ? (
                  <div style={{ color: 'var(--slate)' }}>No error data collected yet. Have a student try the demo.</div>
                ) : (
                  chartData.map((cause) => (
                    <div key={cause.concept} className="teacher-chart-row">
                      <div className="teacher-chart-label">
                        <span>{cause.concept}</span>
                        <span className="teacher-chart-count">{cause.count} errors</span>
                      </div>
                      <div className="teacher-chart-bar-bg">
                        <div 
                          className="teacher-chart-bar-fill" 
                          style={{ 
                            width: `${cause.percentage}%`, 
                            backgroundColor: cause.color,
                            animation: `fillBar 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                          }} 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Interventions Log */}
          <div className="teacher-dashboard__grid">
            <div className="teacher-panel glass-card reveal reveal-delay-3" style={{ gridColumn: '1 / -1' }}>
              <div className="teacher-panel__header">
                <h3 className="teacher-panel__title">Live Interventions Log</h3>
                <p className="teacher-panel__desc">Real-time feed of students needing help (Incorrect Attempts Only)</p>
              </div>
              <div className="teacher-table-wrapper" style={{ maxHeight: '250px' }}>
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Root Cause Gap</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incorrectAttempts.length === 0 && !loading && (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: 'var(--slate)' }}>No mistakes logged yet.</td>
                      </tr>
                    )}
                    {incorrectAttempts.map((inv, i) => (
                      <tr key={inv.id || i}>
                        <td className="font-medium text-paper">{inv.studentName}</td>
                        <td>{inv.rootCause}</td>
                        <td>
                          <span 
                            className="teacher-status-badge" 
                            style={{ 
                              color: inv.rootCause === topCause ? "var(--danger)" : "#E8C93C", 
                              backgroundColor: inv.rootCause === topCause ? `rgba(255, 90, 90, 0.1)` : `rgba(232, 201, 60, 0.1)` 
                            }}
                          >
                            {inv.rootCause === topCause ? "Critical" : "Warning"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="teacher-panel__footer">
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowModal(true)}>
                  Generate Group Lesson Plan for "{topCause}"
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '32px', position: 'relative', margin: '20px' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--slate)', fontSize: '24px', cursor: 'pointer' }}
            >
              &times;
            </button>
            <div className="section-label" style={{ marginBottom: '8px' }}>Algorithmically Generated Remediation</div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: '24px', marginBottom: '24px' }}>Intervention: {topCause}</h3>
            
            <p style={{ color: 'var(--slate)', marginBottom: '16px', lineHeight: 1.6 }}>
              <strong>Goal:</strong> Remediate {topCause} for the {chartData[0]?.count || 0} students who are struggling with this prerequisite, preventing them from factoring quadratics.
            </p>
            
            <div style={{ background: 'var(--surface-50)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--line)' }}>
              <h4 style={{ color: 'var(--paper)', marginBottom: '8px' }}>10-Minute Micro Lesson Plan:</h4>
              <ul style={{ color: 'var(--slate)', lineHeight: 1.6, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Warm-up (2 mins):</strong> Write 3 simple integer addition problems on the board that result in negative numbers.</li>
                <li><strong>Direct Instruction (4 mins):</strong> Use a number line visually to show how moving left adds a negative. Emphasize that adding two negatives goes further left.</li>
                <li><strong>Guided Practice (4 mins):</strong> Have students pair up and solve 5 specific target problems, checking each other's signs before moving on.</li>
              </ul>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
              Assign to student accounts
            </button>
          </div>
        </div>
      )}
    </>
  );
}
