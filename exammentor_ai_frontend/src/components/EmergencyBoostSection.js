// PUBLIC_INTERFACE
import React, { useState, useEffect } from "react";

/**
 * EmergencyBoostSection provides last-minute revision tools.
 * User can set exam date, see time to exam, and activate a (mock) boost plan.
 */
const BOOST_KEY = "mm.emergencyboost-v1";
const mockPlan = [
  "Review all weak topics",
  "Go through marked formulas",
  "Take a quick mock test",
  "Breathe, hydrate, and stay positive!"
];

// PUBLIC_INTERFACE
function EmergencyBoostSection() {
  const todayStr = new Date().toISOString().slice(0,10);
  const [examDate, setExamDate] = useState("");
  const [active, setActive] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(()=>{
    try {
      const data = JSON.parse(localStorage.getItem(BOOST_KEY)||"{}");
      setExamDate(data.examDate||"");
      setActive(!!data.active);
    } catch(e){}
  },[]);

  // PUBLIC_INTERFACE
  function activateBoost() {
    setActive(true);
    setShowPlan(true);
    localStorage.setItem(BOOST_KEY, JSON.stringify({ examDate, active: true }));
  }
  function resetBoost() {
    setActive(false);
    setShowPlan(false);
    localStorage.setItem(BOOST_KEY, JSON.stringify({ examDate, active: false }));
  }

  // Utility: days until exam
  function getDaysLeft() {
    if (!examDate) return null;
    const now = new Date(todayStr);
    const exam = new Date(examDate);
    const diff = Math.ceil((exam-now)/(1000*60*60*24));
    return diff;
  }

  let daysLeft = getDaysLeft();
  let urgent = typeof daysLeft === 'number' && daysLeft <= 7;

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🚨 Emergency Boost Mode</div>
      <div className="ema-section-desc">
        One-click last-minute revision alerts and focused plans.
      </div>
      {!examDate ? (
        <div style={{marginTop:9}}>
          <label style={{fontWeight:500,marginRight:5}}>Exam Date:</label>
          <input
            type="date"
            value={examDate}
            onChange={e=>setExamDate(e.target.value)}
            style={{borderRadius:3,padding:"3px 7px",border:"1px solid #DDD"}}
            min={todayStr}
            aria-label="Exam date"
          />
          <button className="ema-btn" style={{marginLeft:10}} onClick={()=>{
            if (examDate) localStorage.setItem(BOOST_KEY, JSON.stringify({ examDate, active }));
          }}>Save</button>
        </div>
      ) : (
        <div style={{marginTop:7}}>
          <div>
            Exam: <b>{examDate}</b>
            <button className="ema-btn" style={{marginLeft:7, background:"#FFD600",color:"#223046"}}
              onClick={()=>{
                setExamDate("");
                setActive(false);
                setShowPlan(false);
                localStorage.removeItem(BOOST_KEY);
              }}
            >Change</button>
          </div>
          {typeof daysLeft === "number" && (
            <div style={{margin:"7px 0",fontWeight:500,color:urgent?"#FF7A59":"#00B8D9"}}>
              {urgent
                ? `⏰ Only ${daysLeft} days to go!`
                : `${daysLeft} days remaining`}
            </div>
          )}
          <button className="ema-btn" style={{marginTop:6}} onClick={activateBoost} disabled={active}>
            {active ? "Boost Activated" : "Activate Boost Mode"}
          </button>
        </div>
      )}
      {showPlan || active ? (
        <div style={{
          background:"#FEF6E6",padding:"12px",margin:"12px 0",borderRadius:6,
          border:"1px solid #FFD600"
        }}>
          <b>🚀 Boost Revision Plan</b>
          <ul style={{paddingLeft:18,marginBottom:0}}>
            {mockPlan.map((t,i) => <li key={i}>{t}</li>)}
          </ul>
          <button className="ema-btn" style={{marginTop:7, background:'#FF7A59'}}
            onClick={resetBoost}
          >Deactivate Boost</button>
        </div>
      ):null}
    </section>
  );
}

export default EmergencyBoostSection;
