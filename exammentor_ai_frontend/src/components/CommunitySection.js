// PUBLIC_INTERFACE
import React, { useState } from "react";

/**
 * CommunitySection displays challenges, leaderboards, and study buddy options.
 * Demo provides a local leaderboard and a (randomized) buddy-match.
 */

const mockLeaders = [
  { name: "Riya", points: 980 },
  { name: "Aman", points: 920 },
  { name: "Sara", points: 905 },
  { name: "Kabir", points: 860 },
  { name: "You", points: 730 }
];
const buddies = ["Priya the Bio Wiz", "Arjun Focus Guru", "Zara Math Master", "Dev Test Ace", "StudyBot (AI)"];

// PUBLIC_INTERFACE
function CommunitySection() {
  const [buddy, setBuddy] = useState(null);

  // Fake 'matcher'
  function matchBuddy() {
    setBuddy(buddies[Math.floor(Math.random() * buddies.length)]);
  }
  function resetBuddy() {
    setBuddy(null);
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🏆 Community & Study Buddies</div>
      <div className="ema-section-desc">
        Join challenges, view leaderboards, and match with study buddies.
      </div>
      <div style={{margin:"10px 0 8px"}}>
        <div style={{
          fontWeight:500,marginBottom:3
        }}>🏆 Leaderboard (Demo)</div>
        <table style={{width:"100%",fontSize:"0.96rem",background:"#f8faff",borderRadius:4,margin:0,marginBottom:5}}>
          <thead>
            <tr><th style={{textAlign:"left",color:"#555994"}}>Name</th><th style={{textAlign:"right",color:"#555994"}}>Points</th></tr>
          </thead>
          <tbody>
            {mockLeaders.map((row,i)=>(
              <tr key={row.name} style={{fontWeight:row.name==="You"?"700":"400"}}>
                <td>{row.name==="You"?<span style={{color:'#00B8D9'}}>You</span>:row.name}</td>
                <td style={{textAlign:"right"}}>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{margin:"7px 0"}}>
        <div style={{fontWeight:500}}>🤝 Study Buddy Match</div>
        {buddy?(
          <div style={{
            margin:"6px 0",padding:"8px 11px",background:"#F3F9E4",borderRadius:6
          }}>
            Matched with: <span style={{fontWeight:600,color:"#50E3C2"}}>{buddy}</span>
            <button className="ema-btn" style={{marginLeft:10,background:"#FFD600",color:"#223046"}} onClick={resetBuddy}>Try Again</button>
          </div>
        ):(
          <button className="ema-btn" onClick={matchBuddy}>Find Study Buddy</button>
        )}
      </div>
    </section>
  );
}

export default CommunitySection;
