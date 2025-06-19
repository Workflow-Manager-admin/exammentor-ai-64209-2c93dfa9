// PUBLIC_INTERFACE
import React, { useState, useRef, useEffect } from "react";

/**
 * FocusModeSection displays the Real-Time Study Focus Mode (Pomodoro).
 * Includes functional timer, session count, and localStorage save.
 */

const LOCAL_KEY = "mm.focus-pomodoro-v1";
const POMODORO_TIME = 25 * 60; // 25 min in seconds
const SHORT_BREAK = 5 * 60; // 5 min
const LONG_BREAK = 15 * 60; // 15 min

// PUBLIC_INTERFACE
function FocusModeSection() {
  const [mode, setMode] = useState("work"); // work, short, long
  const [seconds, setSeconds] = useState(POMODORO_TIME);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const timer = useRef(null);

  // load stats from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        const { sessions, streak, mode, seconds } = JSON.parse(saved);
        setSessions(sessions);
        setStreak(streak);
        setMode(mode||"work");
        setSeconds(typeof seconds==="number"?seconds:POMODORO_TIME);
      }
    } catch (e) { /* ignore */ }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({
      sessions, streak, mode, seconds
    }));
  }, [sessions, streak, mode, seconds]);

  // Timer logic: tick every second if running
  useEffect(() => {
    if (!running) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setSeconds(prev => {
        if (prev > 0) return prev - 1;
        // Timer ends
        onSessionEnd();
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line
  }, [running, mode]);

  // PUBLIC_INTERFACE
  function startTimer() {
    setRunning(true);
  }
  // PUBLIC_INTERFACE
  function pauseTimer() {
    setRunning(false);
  }
  // PUBLIC_INTERFACE
  function resetTimer() {
    setRunning(false);
    setMode("work");
    setSeconds(POMODORO_TIME);
  }
  // PUBLIC_INTERFACE
  function switchMode(newMode) {
    setMode(newMode);
    setRunning(false);
    setSeconds(
      newMode==="work" ? POMODORO_TIME
      : newMode==="short"? SHORT_BREAK
      : LONG_BREAK
    );
  }
  // PUBLIC_INTERFACE
  function onSessionEnd() {
    setRunning(false);
    if (mode === "work") {
      setSessions(s=>s+1);
      setStreak(s=>s+1);
      setMode("short");
      setSeconds(SHORT_BREAK);
    } else if (mode==="short") {
      setMode("work");
      setSeconds(POMODORO_TIME);
    } else { // long
      setMode("work");
      setSeconds(POMODORO_TIME);
      setStreak(0);
    }
  }

  // Format seconds as mm:ss
  function fmt(sec) {
    const m = Math.floor(sec/60);
    const s = sec%60;
    return `${m.toString().padStart(2,0)}:${s.toString().padStart(2,0)}`;
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">⏰ Study Focus Mode</div>
      <div className="ema-section-desc">
        Pomodoro timer, live check-ins, and accountability partners.
      </div>
      <div style={{
        display:"flex", alignItems:"center", flexDirection:"column",
        gap:10, marginTop:8
      }}>
        <div style={{
          fontWeight:700,fontSize:"2.1rem",marginBottom:6,
          color:mode==="work"?"#00B8D9":mode==="short"?"#FFD600":"#A259FF"
        }}>
          {fmt(seconds)}
          <span style={{
            fontSize:"0.95rem", fontWeight:400, marginLeft:6,
            color:"#555994"
          }}> {mode==="work"?"Work":"Break"}</span>
        </div>
        <div>
          {running?(
            <button className="ema-btn" onClick={pauseTimer} style={{marginRight:8}}>Pause</button>
          ):(
            <button className="ema-btn" onClick={startTimer} style={{marginRight:8}}>Start</button>
          )}
          <button className="ema-btn" style={{background:'#FF7A59'}} onClick={resetTimer}>Reset</button>
        </div>
        <div style={{marginTop:7, color:"#555994",fontSize:"0.98rem"}}>
          Sessions: <b>{sessions}</b> | Streak: <b>{streak}</b>
        </div>
        <div style={{marginTop:9}}>
          <button onClick={()=>switchMode("work")} style={{
            background: mode==="work"?'#00B8D9':'#f1f1f1', color:mode==="work"?'#fff':'#565994',border:"none",borderRadius:3,padding:"4px 10px"
          }}>Work</button>
          <button onClick={()=>switchMode("short")} style={{
            background: mode==="short"?'#FFD600':'#f1f1f1', color:mode==="short"?'#232943':'#565994',border:"none",borderRadius:3,padding:"4px 10px",marginLeft:7
          }}>Short Break</button>
          <button onClick={()=>switchMode("long")} style={{
            background: mode==="long"?'#A259FF':'#f1f1f1', color:mode==="long"?'#fff':'#565994',border:"none",borderRadius:3,padding:"4px 10px",marginLeft:7
          }}>Long Break</button>
        </div>
      </div>
    </section>
  );
}

export default FocusModeSection;
