// PUBLIC_INTERFACE
import React, { useEffect, useState } from "react";

/**
 * RewardSystemSection: Shows coins, badges, and streaks.
 * Synced with goal completions and focus sessions (localStorage).
 */

const COIN_KEY = "mm.reward-coins-v1";
const BADGE_KEY = "mm.reward-badges-v1";

// Helper to get count of checklist completions from Goals/Focus
function fetchAchievements() {
  let goalsDone = 0, totalGoals = 0;
  let focusSessions = 0, focusStreak = 0;
  try {
    // From goals plan
    const gs = JSON.parse(localStorage.getItem("mm.ai-goals-plan-v1")||"{}");
    if (gs.plan && Array.isArray(gs.plan)) {
      totalGoals = gs.plan.length;
      goalsDone = gs.plan.filter(t=>t.done).length;
    }
    // From focus sessions (see FocusModeSection)
    const fs = JSON.parse(localStorage.getItem("mm.focus-pomodoro-v1")||"{}");
    focusSessions = fs.sessions || 0;
    focusStreak = fs.streak || 0;
  } catch(e) {}
  return { goalsDone, totalGoals, focusSessions, focusStreak };
}

// PUBLIC_INTERFACE
function RewardSystemSection() {
  // Local coins/badges are loosely coupled to progress for demo
  const [coins, setCoins] = useState(0);
  const [badges, setBadges] = useState([]);
  const [achievement, setAchievement] = useState({goalsDone:0, totalGoals:0, focusSessions:0, focusStreak:0});

  // Load state
  useEffect(()=>{
    try {
      setCoins(Number(localStorage.getItem(COIN_KEY)||"0"));
    } catch(e) {}
    try {
      setBadges(JSON.parse(localStorage.getItem(BADGE_KEY)||"[]"));
    } catch(e) {}
    updateAchievements();
    // Listen on storage to auto-sync
    window.addEventListener("storage", updateAchievements);
    return () => window.removeEventListener("storage", updateAchievements);
    // eslint-disable-next-line
  },[]);

  // When achievements change, auto-award coins/badges
  useEffect(()=>{
    const { goalsDone, focusSessions } = achievement;
    let c = 10*goalsDone + 2*focusSessions;
    let awardBadges = [];
    if (goalsDone>=3) awardBadges.push("🥇 Goal Getter");
    if (focusSessions>=10) awardBadges.push("⚡ Focus Champ");
    if (goalsDone>=5) awardBadges.push("🏆 Consistency Star");
    setCoins(c);
    setBadges(awardBadges);
    localStorage.setItem(COIN_KEY, String(c));
    localStorage.setItem(BADGE_KEY, JSON.stringify(awardBadges));
  },[achievement]);

  function updateAchievements() {
    setAchievement(fetchAchievements());
  }

  // PUBLIC_INTERFACE
  function resetAll() {
    setCoins(0);
    setBadges([]);
    localStorage.setItem(COIN_KEY,"0");
    localStorage.setItem(BADGE_KEY,"[]");
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🎉 Reward System</div>
      <div className="ema-section-desc">
        Earn coins, badges, and level up by completing goals!
      </div>
      <div style={{margin: "10px 0 12px 0", textAlign:"center"}}>
        <span style={{fontWeight:600,fontSize:"2.1rem",color:"#FFD600"}}>🪙 {coins}</span>
        <div style={{fontWeight:500, fontSize:"1.04rem",marginTop:2}}>Coins Earned</div>
      </div>
      <div style={{marginBottom:10,display:"flex",justifyContent:"center",gap:13,alignItems:"center"}}>
        {badges.length>0?(
          badges.map(b=>
            <span style={{fontSize:"2.1rem"}} key={b} title={b}>{b}</span>
          )
        ):(
          <span style={{fontStyle:"italic",color:"#AAA"}}>No badges earned yet</span>
        )}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.97rem",color:"#555994",marginBottom:4}}>
        <div>Goals:</div>
        <div><b>{achievement.goalsDone}</b>/<b>{achievement.totalGoals}</b></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.97rem",color:"#555994"}}>
        <div>Pomodoro Sessions:</div>
        <div><b>{achievement.focusSessions}</b></div>
      </div>
      <button className="ema-btn" style={{marginTop:13, background:'#FF7A59'}} onClick={resetAll}>Reset Rewards</button>
    </section>
  );
}

export default RewardSystemSection;
