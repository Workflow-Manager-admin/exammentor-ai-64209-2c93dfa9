// PUBLIC_INTERFACE
import React, { useState, useEffect } from "react";

/**
 * MoodFocusSection allows users to log mood, focus and visualize trends.
 * Users select a mood emoji, set a focus (1-10), logs are saved per day, with short history.
 */

const MOOD_KEY = "mm.moodfocus-log-v1";
const moodList = ["😃","🙂","😐","😟","😭"];
const moodLabels = [
  "Excellent/Happy","Content","Neutral","Low/Easily Distracted","Very Stressed"
];

// PUBLIC_INTERFACE
function MoodFocusSection() {
  const today = new Date().toISOString().slice(0,10);
  const [log, setLog] = useState({});
  const [mood, setMood] = useState("");
  const [focus, setFocus] = useState("5");

  // On load
  useEffect(()=>{
    try {
      const saved = JSON.parse(localStorage.getItem(MOOD_KEY)||"{}");
      setLog(saved);
      if (saved[today]) {
        setMood(saved[today].mood||"");
        setFocus(saved[today].focus||"5");
      }
    } catch(e) {}
    // eslint-disable-next-line
  },[]);

  // Update log for today if mood/focus changes
  useEffect(()=>{
    if (mood||focus) {
      const newLog = { ...log, [today]: { mood, focus } };
      setLog(newLog);
      localStorage.setItem(MOOD_KEY, JSON.stringify(newLog));
    }
    // eslint-disable-next-line
  },[mood, focus]);

  // PUBLIC_INTERFACE
  function clearToday() {
    const newLog = { ...log };
    delete newLog[today];
    setLog(newLog);
    setMood("");
    setFocus("5");
    localStorage.setItem(MOOD_KEY, JSON.stringify(newLog));
  }

  // Display last 6 days log (including today)
  const sortedDays = Object.keys(log).sort().reverse().slice(0,6);

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">😊 Mood & Focus Tracker</div>
      <div className="ema-section-desc">
        Log daily mood, focus, and distractions to track your study wellbeing.
      </div>
      <div style={{marginTop:12,marginBottom:4}}>
        <div>
          <div style={{display:"flex", gap:7, alignItems:"center"}}>
            <div style={{fontWeight:500}}>Today's Mood:</div>
            {moodList.map((m,idx)=>(
              <button
                key={m}
                style={{
                  fontSize:"1.4rem",border:"none",background:"transparent",
                  opacity:mood===m?1:0.45, cursor:"pointer"
                }}
                title={moodLabels[idx]}
                aria-label={moodLabels[idx]}
                onClick={()=>setMood(m)}
              >{m}</button>
            ))}
          </div>
          <div style={{marginTop:5,display:"flex",alignItems:"center",gap:7}}>
            <div style={{fontWeight:500}}>Focus:</div>
            <input
              type="range"
              min={1}
              max={10}
              value={focus}
              onChange={e=>setFocus(e.target.value)}
              style={{width:90}}
              aria-label="Focus Score"
            />
            <span style={{
              color:focus>7?"#00B8D9":focus<4?"#FF7A59":"#FFD600",
              fontWeight:"bold"
            }}>{focus}</span>
          </div>
        </div>
        <button className="ema-btn" style={{marginTop:7,background:"#FFD600",color:"#232943"}}
          onClick={clearToday}
        >Clear</button>
      </div>
      <div style={{marginTop:18}}>
        <div style={{fontWeight:500,fontSize:"1.02rem",marginBottom:4}}>
          Last 6 Days
        </div>
        <table style={{width:"100%",fontSize:"0.97rem",background:"#f9f9fa",borderRadius:5,margin:0}}>
          <thead>
            <tr>
              <th style={{textAlign:"left",color:"#555994"}}>Date</th>
              <th style={{textAlign:"center",color:"#555994"}}>Mood</th>
              <th style={{textAlign:"center",color:"#555994"}}>Focus</th>
            </tr>
          </thead>
          <tbody>
            {sortedDays.map((d)=>(
              <tr key={d}>
                <td>{d}</td>
                <td style={{textAlign:"center"}}>{log[d].mood}</td>
                <td style={{textAlign:"center"}}>{log[d].focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MoodFocusSection;
