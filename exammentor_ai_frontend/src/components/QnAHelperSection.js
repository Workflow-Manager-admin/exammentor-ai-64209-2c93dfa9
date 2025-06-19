import React, { useState, useEffect, useRef } from "react";
import { fetchGpt4QA } from "./openaiQnaHelper";
import { getApiIntegration, isApiFeatureEnabled } from "./integrationHelpers";

/**
 * QnAHelperSection: GPT-4 Q&A Helper (real, using OpenAI if enabled).
 * User asks questions, gets live GPT-4 answers (streamed if available), chat saved per session.
 */

const QNA_KEY = "mm.gpt4qna-v1";

function mockAIAnswer(question) {
  const templates = [
    q => `Great question! Here's a quick overview:\n\n"${q}" means... [explanation omitted].`,
    q => `The key to "${q}" is to focus on the core concepts.`,
    q => `Imagine you are teaching someone "${q}": break it into small steps.`,
    q => `If you need more examples for "${q}", try visual aids or analogies!`,
    q => `Let's summarize "${q}" in simple words: [summary here].`
  ];
  return templates[Math.floor(Math.random() * templates.length)](question);
}

// PUBLIC_INTERFACE
function QnAHelperSection() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamAnswer, setStreamAnswer] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef(null);
  const msgEndRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem(QNA_KEY) || "[]"));
    } catch (e) {}
  }, []);
  useEffect(() => {
    localStorage.setItem(QNA_KEY, JSON.stringify(history));
  }, [history]);

  // Scroll to latest QnA on update
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, streamAnswer]);

  // PUBLIC_INTERFACE
  async function askQnA() {
    if (!input.trim() || loading) return;
    setError("");
    setLoading(true);
    setStreamAnswer("");
    const question = input.trim();
    const prevHistory = [...history];

    // Prepare streaming functions
    let aiAnswer = "";

    // Use OpenAI if enabled, else fallback to mock
    if (isApiFeatureEnabled("openai")) {
      // Setup abort controller for cancellation
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await fetchGpt4QA(
          question,
          prevHistory,
          {
            signal: controller.signal,
            onToken: (delta) => {
              aiAnswer += delta;
              setStreamAnswer(aiAnswer);
            }
          }
        );
        // finalize
        setHistory(h => [...h, { q: question, a: aiAnswer }]);
        setInput("");
        setStreamAnswer("");
        setLoading(false);
      } catch (e) {
        // Error handler: fallback to nice message if possible
        let fallback = "Sorry, couldn't get a reply from GPT-4 right now. Please try again later!";
        if (e?.message && /key|integration|unauthorized/i.test(e.message)) {
          fallback = "OpenAI API not configured or enabled. Check Account & API settings.";
        }
        setError(`${e.message || "Error"} — ${fallback}`);
        setHistory(h => [...h, { q: question, a: fallback }]);
        setLoading(false);
        setInput("");
        setStreamAnswer("");
      }
    } else {
      // fallback to fast mock in absence of API
      setTimeout(() => {
        const ans = mockAIAnswer(question);
        setHistory(h => [...h, { q: question, a: ans }]);
        setLoading(false);
        setInput("");
        setStreamAnswer("");
      }, 700);
    }
  }

  // Keyboard Enter triggers
  function handleKey(e) {
    if (e.key === "Enter") askQnA();
  }

  function clearHistory() {
    setHistory([]);
    setError("");
  }

  // Clean up abort on component unmount
  useEffect(() => {
    return () => {
      abortRef.current && abortRef.current.abort();
    };
  }, []);

  // Handle loading and streaming for the last message slot
  const answers = streamAnswer && loading
    ? [...history, { q: input, a: streamAnswer }]
    : history;

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">💡 GPT-4 Q&A Helper</div>
      <div className="ema-section-desc">
        Ask questions, get instant explanations and study help.
      </div>
      <div style={{margin:"12px 0 4px"}}>
        <input
          type="text"
          placeholder="Type your study question..."
          aria-label="Question"
          value={input}
          disabled={loading}
          onChange={e => { setInput(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          style={{width:"78%",padding:"8px 7px",borderRadius:4,border:"1px solid #ccc",marginRight:7}}
        />
        <button className="ema-btn" onClick={askQnA} disabled={!input.trim() || loading}>
          {loading
            ? (
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
                Waiting...
              </span>
            ) : "Ask"}
        </button>
        <button className="ema-btn" onClick={clearHistory} style={{marginLeft:8,background:"#FFD600",color:"#223046"}} disabled={loading}>
          Clear
        </button>
      </div>
      {error && (
        <div style={{ color: "#FF7A59", marginTop: 7, fontWeight: 500, fontSize: "0.98rem" }}>
          {error}
        </div>
      )}
      <div style={{minHeight:60,maxHeight:180,overflowY:"auto",background:"#F8FAFF",borderRadius:7,padding:"7px 11px",border:"1px solid #eaeaea"}}>
        {answers.length === 0 && !loading &&
          <div style={{ color: "#AAA", fontStyle: "italic" }}>No Q&A yet—start by typing a question!</div>
        }
        {answers.map((h, i) =>
          <div key={i} style={{marginBottom:7}}>
            <span style={{fontWeight:500, color:"#00B8D9"}}>You:</span> {h.q}
            <div style={{margin:"3px 0 0 12px",color:"#555994"}}>
              <span style={{fontWeight:600,color:"#FFD600"}}>GPT-4:</span> {h.a || <span style={{ color: "#B2B2B2", fontStyle: "italic" }}>…</span>}
            </div>
            {streamAnswer && loading && i === answers.length - 1 &&
              <span style={{color: "#ccc", fontSize: "0.97rem", marginLeft: 20}}>AI is typing…</span>
            }
          </div>
        )}
        <div ref={msgEndRef} />
      </div>
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

export default QnAHelperSection;
