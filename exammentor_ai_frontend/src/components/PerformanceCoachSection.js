/**
 * PerformanceCoachSection: AI-driven feedback and study analytics (interactive, with mock AI & API stub)
 */
// PUBLIC_INTERFACE
import React, { useState, useEffect, useRef } from "react";

const FEEDBACK_KEY = "mm.performance-feedback-v1";

// Simulate AI feedback (mocked function)
function mockAIResponse(text) {
  const responses = [
    q => `👍 Your effort is impressive this week! For "${q}", try reviewing your focus logs and reward yourself for consistency.`,
    q => `🧠 For "${q}", consider adjusting your study blocks—balance Pomodoro with break time.`,
    q => `💡 "Keep tracking moods and focus; consistency pays off." For "${q}" join a challenge or set a micro-goal!`,
    q => `🔥 Great streak lately! For "${q}", analyze which sessions felt most productive and double down on what works.`,
    q => `📝 My AI tip: Reflect on your biggest accomplishment for "${q}", and make that your new baseline!`
  ];
  return responses[Math.floor(Math.random()*responses.length)](text);
}

// PUBLIC_INTERFACE
function PerformanceCoachSection() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(""); // stub for future OpenAI/API
  const [showKeyBox, setShowKeyBox] = useState(false);
  const msgEnd = useRef(null);

  // Load history
  useEffect(()=>{
    try {
      setFeedback(JSON.parse(localStorage.getItem(FEEDBACK_KEY)||"[]"));
    } catch(e){}
  },[]);
  useEffect(()=>{
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
  },[feedback]);

  useEffect(()=>{
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  },[feedback]);

  // PUBLIC_INTERFACE
  function handleCoach() {
    if (!input.trim()) return;
    setGenerating(true);
    // If API key provided, in future: send to OpenAI backend here (stub)
    setTimeout(()=>{
      const mockResp = mockAIResponse(input.trim());
      setFeedback(f=>[...f, {q:input.trim(), a:mockResp, ts:Date.now()}]);
      setGenerating(false);
      setInput("");
    }, 1100);
  }
  function clearFeedback() {
    setFeedback([]);
  }
  function saveKey() {
    setShowKeyBox(false);
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🤖 Performance Coach</div>
      <div className="ema-section-desc">
        Get personalized insights on your productivity, habits and strengths!
      </div>
      <div style={{margin:"10px 0"}}>
        <input
          type="text"
          placeholder="Describe your progress or ask for a study tip..."
          aria-label="Performance prompt"
          value={input}
          disabled={generating}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"?handleCoach():undefined}
          style={{
            width:"72%",padding:"7px 9px",marginRight:7,
            borderRadius:4,border:"1px solid #ccd",fontSize:"1rem"
          }}
        />
        <button className="ema-btn" disabled={generating||!input.trim()} onClick={handleCoach}>
          {generating ? "Analyzing..." : "Get AI Feedback"}
        </button>
      </div>
      <div style={{
        minHeight:54, maxHeight:132, overflowY:"auto", background:"#f8f9ff",
        borderRadius:7,padding:"6px 11px",margin:"3px 0",border:"1px solid #eaeaea"
      }}>
        {feedback.length===0 && <div style={{color:"#aaa",fontStyle:"italic"}}>No feedback yet—type a progress update!</div>}
        {feedback.map((f,i)=>
          <div key={i} style={{marginBottom:9}}>
            <span style={{color:"#00B8D9",fontWeight:500}}>You:</span> {f.q}
            <div style={{
              margin:"3px 0 0 12px",color:"#565994"
            }}>
              <span style={{color:"#FFD600",fontWeight:600}}>Coach:</span> {f.a}
            </div>
          </div>
        )}
        <div ref={msgEnd}/>
      </div>
      <button className="ema-btn" style={{marginTop:8,background:"#FFD600",color:"#232943"}} onClick={clearFeedback}>Clear</button>
      <button
        className="ema-btn"
        style={{marginTop:8,marginLeft:7,background:"#A259FF"}}
        onClick={()=>setShowKeyBox(s=>!s)}
      >{apiKey?"Change API Key (future)":"Connect OpenAI API"} </button>
      {showKeyBox && (
        <div style={{
          marginTop:10,background:"#EEE",padding:8,borderRadius:7,
          display:"flex",gap:7,alignItems:"center"
        }}>
          <input
            type="password"
            placeholder="Enter OpenAI/GPT-4 API Key"
            value={apiKey}
            onChange={e=>setApiKey(e.target.value)}
            style={{padding:'5px 8px',border:"1px solid #BBB",borderRadius:5,fontSize:"1rem"}}
          />
          <button className="ema-btn" onClick={saveKey} style={{background:"#FF7A59"}}>Save</button>
          <span style={{fontSize:"0.98rem",color:"#777"}}>This is a demo – not yet connected.</span>
        </div>
      )}
      <div style={{fontSize:"0.96rem",marginTop:11,color:"#555994"}}>
        {apiKey
          ? "API Connected (test-mode). Answers are currently generated locally. Future: Your API key will be used to power true AI feedback, never stored on our servers."
          : "Upgrade: Soon you can link your own OpenAI key for live performance analytics & tips."}
      </div>
    </section>
  );
}

export default PerformanceCoachSection;
