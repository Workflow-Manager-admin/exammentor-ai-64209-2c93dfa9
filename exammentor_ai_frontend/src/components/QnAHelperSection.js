// PUBLIC_INTERFACE
import React, { useState, useEffect, useRef } from "react";

/**
 * QnAHelperSection: GPT-4 Q&A Helper (mocked).
 * User asks questions, gets (fake) instant answers, chat saved per session.
 */

const QNA_KEY = "mm.gpt4qna-v1";

// Simple mock-GPT: generates trivial but plausible answer
function mockAIAnswer(question) {
  const templates = [
    q => `Great question! Here's a quick overview:\n\n"${q}" means... [explanation omitted].`,
    q => `The key to "${q}" is to focus on the core concepts.`,
    q => `Imagine you are teaching someone "${q}": break it into small steps.`,
    q => `If you need more examples for "${q}", try visual aids or analogies!`,
    q => `Let's summarize "${q}" in simple words: [summary here].`
  ];
  return templates[Math.floor(Math.random()*templates.length)](question);
}

// PUBLIC_INTERFACE
function QnAHelperSection() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const msgEndRef = useRef(null);

  useEffect(()=>{
    try {
      setHistory(JSON.parse(localStorage.getItem(QNA_KEY)||"[]"));
    } catch(e){}
  },[]);
  useEffect(()=>{
    localStorage.setItem(QNA_KEY, JSON.stringify(history));
  },[history]);

  // Scroll to latest QnA on update
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // PUBLIC_INTERFACE
  function askQnA() {
    if (!input.trim()) return;
    const q = input.trim();
    const fakeAnswer = mockAIAnswer(q);
    setHistory(h=>[...h, { q, a: fakeAnswer }]);
    setInput("");
  }
  function clearHistory() {
    setHistory([]);
  }

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
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"?askQnA():undefined}
          style={{width:"78%",padding:"8px 7px",borderRadius:4,border:"1px solid #ccc",marginRight:7}}
        />
        <button className="ema-btn" onClick={askQnA} disabled={!input.trim()}>Ask</button>
        <button className="ema-btn" onClick={clearHistory} style={{marginLeft:8,background:"#FFD600",color:"#223046"}}>Clear</button>
      </div>
      <div style={{minHeight:60,maxHeight:180,overflowY:"auto",background:"#F8FAFF",borderRadius:7,padding:"7px 11px",border:"1px solid #eaeaea"}}>
        {history.length === 0 && <div style={{color:"#AAA",fontStyle:"italic"}}>No Q&A yet—start by typing a question!</div>}
        {history.map((h,i)=>
          <div key={i} style={{marginBottom:7}}>
            <span style={{fontWeight:500, color:"#00B8D9"}}>You:</span> {h.q}
            <div style={{margin:"3px 0 0 12px",color:"#555994"}}>
              <span style={{fontWeight:600,color:"#FFD600"}}>GPT-4:</span> {h.a}
            </div>
          </div>
        )}
        <div ref={msgEndRef} />
      </div>
    </section>
  );
}

export default QnAHelperSection;
