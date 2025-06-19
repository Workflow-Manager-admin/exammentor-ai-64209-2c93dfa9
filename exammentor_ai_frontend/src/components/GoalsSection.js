// PUBLIC_INTERFACE
import React, { useState, useEffect } from "react";

/**
 * GoalsSection displays AI Goal Breakdown Generator and related actions.
 * Fully interactive: lets user input exam, generates topic plan, lets user check off topics, and saves to localStorage.
 */
const LOCAL_KEY = "mm.ai-goals-plan-v1";

const defaultPlans = {
  NEET: [
    { topic: "Biology: Human Physiology", done: false },
    { topic: "Chemistry: Physical & Organic", done: false },
    { topic: "Physics: Mechanics", done: false },
    { topic: "Biology: Plant Physiology", done: false },
    { topic: "Mock Test & Revision", done: false }
  ],
  JEE: [
    { topic: "Maths: Algebra", done: false },
    { topic: "Physics: Mechanics", done: false },
    { topic: "Chemistry: Organic", done: false },
    { topic: "Maths: Calculus", done: false },
    { topic: "Test Series", done: false }
  ]
};

function aiGenerateBreakdown(exam) {
  // Mock "AI": Pick from default, otherwise generic
  if (defaultPlans[exam]) return defaultPlans[exam];
  return [
    { topic: `${exam} Paper: Syllabus Overview`, done: false },
    { topic: "Major Topics", done: false },
    { topic: "Key Concepts & Formulas", done: false },
    { topic: "Practice Questions", done: false },
    { topic: "Final Revision", done: false }
  ];
}

// PUBLIC_INTERFACE
function GoalsSection() {
  const [exam, setExam] = useState("");
  const [plan, setPlan] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load plan from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setExam(data.exam);
        setPlan(data.plan);
      }
    } catch (e) { /* ignore */ }
  }, []);

  // PUBLIC_INTERFACE
  function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const _exam = input.trim();
      const _plan = aiGenerateBreakdown(_exam);
      setExam(_exam);
      setPlan(_plan);
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ exam: _exam, plan: _plan }));
      setLoading(false);
    }, 900);
  }

  // PUBLIC_INTERFACE
  function handleTopicToggle(idx) {
    const newPlan = plan.map((t, i) =>
      i === idx ? { ...t, done: !t.done } : t
    );
    setPlan(newPlan);
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ exam, plan: newPlan }));
  }

  // PUBLIC_INTERFACE
  function resetPlan() {
    setExam("");
    setPlan(null);
    setInput("");
    localStorage.removeItem(LOCAL_KEY);
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🎯 AI Goal Breakdown</div>
      <div className="ema-section-desc">
        Generate your exam prep plan with topic-wise breakdowns & checkpoints.
      </div>
      {plan && exam ? (
        <div style={{marginBottom: 12}}>
          <div style={{fontWeight:500, marginBottom: 4}}>Plan for: <span style={{color:'var(--secondary)', fontWeight:600}}>{exam}</span></div>
          <ol style={{margin:0, paddingLeft:24}}>
            {plan.map((t,i)=>(
              <li key={i}>
                <label style={{textDecoration:t.done?'line-through':'',color:t.done?'#b2b2b2':'inherit'}}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    style={{marginRight:6}}
                    onChange={()=>handleTopicToggle(i)}
                  /> {t.topic}
                </label>
              </li>
            ))}
          </ol>
          <button className="ema-btn" style={{marginTop:10,background:"#FF7A59"}} onClick={resetPlan}>Clear Plan</button>
        </div>
      ) : (
        <div>
          <input
            placeholder="Enter your exam (e.g. NEET, JEE, UPSC)"
            className="ema-section-input"
            style={{
              padding: "8px 10px", borderRadius: 4, border: "1px solid #DDD", marginRight: 9
            }}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"?handleGenerate():undefined}
            disabled={loading}
            aria-label="Exam Name"
          />
          <button className="ema-btn" onClick={handleGenerate} disabled={!input.trim()||loading}>
            {loading?"Generating...":"Generate Plan"}
          </button>
        </div>
      )}
    </section>
  );
}

export default GoalsSection;
