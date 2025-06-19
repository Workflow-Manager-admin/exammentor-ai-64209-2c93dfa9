// PUBLIC_INTERFACE
import React, { useState, useEffect } from "react";

/**
 * DailyRecapSection: Shows smart daily summary of progress.
 * Pulls from goals, mood, focus, and sessions; shows recap emoji and saves as history.
 */

const RECAP_KEY = "mm.dailyrecap-v1";
const MOOD_KEY = "mm.moodfocus-log-v1";

function genRecapMood(mood, goalsDone, totalGoals, focus, sessions) {
  // Weighted recap
  if (mood === "😃" && goalsDone > 2) return "🌟 Awesome!";
  if (goalsDone === totalGoals && totalGoals > 0) return "🏆 All Goals Done!";
  if (focus > 7) return "🤓 Highly Focused";
  if (mood === "😟" || mood === "😭") return "😔 Take Rest";
  if (sessions > 6) return "🔋 Productive Day!";
  if (goalsDone === 0) return "🙄 Need to Focus";
  return "🙂 Solid Effort";
}

// PUBLIC_INTERFACE
function DailyRecapSection() {
  const today = new Date().toISOString().slice(0,10);

  const [recap, setRecap] = useState({});
  const [summary, setSummary] = useState(null);

  // On load
  useEffect(()=>{
    try {
      setRecap(JSON.parse(localStorage.getItem(RECAP_KEY)||"{}"));
    } catch(e) {}
  },[]);

  // PUBLIC_INTERFACE
  function handleGenRecap() {
    // Gather mood
    let mood = "", focus = 5;
    try {
      const l = JSON.parse(localStorage.getItem(MOOD_KEY)||"{}");
      if (l[today]) {
        mood = l[today].mood || "";
        focus = +l[today].focus || 5;
      }
    } catch(e){}
    // Goals
    let goalsDone = 0, totalGoals = 0;
    try {
      const gs = JSON.parse(localStorage.getItem("mm.ai-goals-plan-v1")||"{}");
      if (gs.plan && Array.isArray(gs.plan)) {
        totalGoals = gs.plan.length;
        goalsDone = gs.plan.filter(t=>t.done).length;
      }
    } catch(e) {}
    let sessions = 0;
    try {
      const fs = JSON.parse(localStorage.getItem("mm.focus-pomodoro-v1")||"{}");
      sessions = fs.sessions || 0;
    } catch(e){}
    const moodTitle = genRecapMood(mood, goalsDone, totalGoals, focus, sessions);
    const msg = {
      date: today,
      mood, focus, goalsDone, totalGoals, sessions,
      moodTitle
    };
    const newRecap = { ...recap, [today]: msg };
    setRecap(newRecap);
    setSummary(msg);
    localStorage.setItem(RECAP_KEY, JSON.stringify(newRecap));
  }

  // PUBLIC_INTERFACE
  function clearRecap() {
    setSummary(null);
    const newRecap = { ...recap };
    delete newRecap[today];
    setRecap(newRecap);
    localStorage.setItem(RECAP_KEY, JSON.stringify(newRecap));
  }

  // Show last 5 recaps
  const sorted = Object.keys(recap).sort().reverse().slice(0,5);

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">📆 Smart Daily Recap</div>
      <div className="ema-section-desc">Get daily summaries with emojis, milestones and progress!</div>
      <button className="ema-btn" style={{marginTop:7}} onClick={handleGenRecap}>Generate Today's Recap</button>
      {summary||recap[today]?(
        <div style={{
          padding: "10px 0",
          background:"#e9f6f3", borderRadius:7, margin:"10px 0"
        }}>
          <div style={{fontWeight:600,fontSize:"1.02rem"}}>{(summary||recap[today]).moodTitle||"Daily Recap"}</div>
          <div>
            <span style={{color:"#FFD600",fontSize:"1.1rem"}}>Mood:</span> {(summary||recap[today]).mood||"not logged"}
            <span style={{marginLeft:8,color:"#00B8D9",fontSize:"1.1rem"}}>Focus: {(summary||recap[today]).focus}</span>
          </div>
          <div>
            Goals: <b>{(summary||recap[today]).goalsDone}</b>/{(summary||recap[today]).totalGoals}
            <span style={{marginLeft:8}}>Pomodoros: <b>{(summary||recap[today]).sessions}</b></span>
          </div>
          <button className="ema-btn" style={{marginTop:7, background:'#FF7A59'}}
            onClick={clearRecap}
          >Clear Recap</button>
        </div>
      ):null}
      <div style={{marginTop:10}}>
        <div style={{fontWeight:500,fontSize:"1.02rem",marginBottom:4}}>Recent Recaps</div>
        <ul style={{listStyleType:"disc",margin:0,paddingLeft:18}}>
          {sorted.map(day=>
            <li key={day} style={{marginBottom:1,fontSize:"0.98rem"}}>
              <span style={{fontWeight:600}}>{recap[day].moodTitle}</span> — {day}
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default DailyRecapSection;
