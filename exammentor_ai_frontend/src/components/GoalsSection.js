import React, { useState, useEffect, useRef } from "react";
import { getApiIntegration, isApiFeatureEnabled } from "./integrationHelpers";

/**
 * Helper to fetch a plan from OpenAI API using the stored key.
 * Returns an array of { topic, done: false }.
 */
async function fetchOpenAIBreakdown(exam, apiKey, signal) {
  // Compose an effective prompt for exam plan breakdown
  const prompt = `Break down the preparation for the exam "${exam}" into a step-by-step topic-wise study plan. Respond as a numbered list. Only reply with the ordered plan.`;
  // We'll use OpenAI's chat/completions endpoint with gpt-3.5-turbo
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an expert study planner for competitive exams." },
      { role: "user", content: prompt }
    ],
    max_tokens: 500,
    temperature: 0.5
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    signal
  });
  if (!resp.ok) {
    throw new Error("OpenAI API error: " + resp.status);
  }
  const data = await resp.json();
  // Find the plan (raw text as a numbered list)
  const answer = data.choices?.[0]?.message?.content || "";
  // Parse into [{topic, done: false}]
  const lines = answer
    .split("\n")
    .map(s => s.trim().replace(/^\d+[\). ]\s*/, ""))
    .filter(s => s.length > 0 && !/^(step\s*\d+|breakdown|overview)/i.test(s));
  const deduped = [...new Set(lines)];
  return deduped.map(topic => ({ topic, done: false }));
}

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
  const [error, setError] = useState("");
  const abortRef = useRef(null);

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
  async function handleGenerate() {
    if (!input.trim()) return;
    setError("");
    setLoading(true);

    // Check for OpenAI integration
    if (isApiFeatureEnabled("openai")) {
      const openai = getApiIntegration("openai");
      if (!openai || !openai.key) {
        setLoading(false);
        setError("OpenAI API Key not set. Enable in Account & API Settings.");
        return;
      }
      // Setup abort controller so user can change their input quickly
      abortRef.current && abortRef.current.abort(); // abort any previous
      const controller = new AbortController();
      abortRef.current = controller;

      let _exam = input.trim(), _plan = null;
      try {
        _plan = await fetchOpenAIBreakdown(_exam, openai.key, controller.signal);
        // Sanity fallback, if AI gave no numbered list
        if (!_plan || !_plan.length) {
          _plan = [{ topic: `${_exam} Preparation Overview`, done: false }];
        }
        setExam(_exam);
        setPlan(_plan);
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ exam: _exam, plan: _plan }));
        setLoading(false);
      } catch(e) {
        if (e.name === "AbortError") return; // Silently ignore
        setLoading(false);
        setError("Failed to generate plan: " + (e.message || "Unknown error"));
      }
    } else {
      // Fallback to legacy: use mock/locally generated plans
      setTimeout(() => {
        const _exam = input.trim();
        const _plan = aiGenerateBreakdown(_exam);
        setExam(_exam);
        setPlan(_plan);
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ exam: _exam, plan: _plan }));
        setLoading(false);
      }, 900);
    }
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
    setError("");
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
            onChange={e => { setInput(e.target.value); setError(""); }}
            onKeyDown={e=>e.key==="Enter"?handleGenerate():undefined}
            disabled={loading}
            aria-label="Exam Name"
          />
          <button className="ema-btn" onClick={handleGenerate} disabled={!input.trim()||loading}>
            {loading?
              <span>
                <span
                  className="ema-loading-spinner"
                  style={{
                    display: "inline-block",
                    width: 17,
                    height: 17,
                    border: "2px solid #D6EAF8",
                    borderTop: "2px solid #00B8D9",
                    borderRadius: "50%",
                    animation: "spin 0.68s linear infinite",
                    marginRight: 7,
                    verticalAlign: "middle"
                  }}
                ></span>
                Generating...
              </span>
              :"Generate Plan"}
          </button>
          {error && (
            <div style={{color:"#FF7A59", marginTop:7, fontWeight:500, fontSize:"0.99rem"}}>
              {error}
            </div>
          )}
        </div>
      )}
      <style>
        {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .ema-loading-spinner { }
        `}
      </style>
    </section>
  );
}

export default GoalsSection;
