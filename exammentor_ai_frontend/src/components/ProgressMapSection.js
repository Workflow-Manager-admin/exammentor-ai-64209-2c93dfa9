// PUBLIC_INTERFACE
import React, { useState, useEffect } from "react";

/**
 * ProgressMapSection shows the Progress Map & Skill Tree view.
 * Features selectable skill 'nodes', progress saving in localStorage, and progress percentage.
 */

const PROGRESS_KEY = "mm.skill-tree-v1";
const skillsData = [
  { id: "s1", label: "Basics/Introduction" },
  { id: "s2", label: "Intermediate Concepts" },
  { id: "s3", label: "Advanced Topics" },
  { id: "s4", label: "Practice Tests" },
  { id: "s5", label: "Revision Mastery" }
];

// PUBLIC_INTERFACE
function ProgressMapSection() {
  const [unlocked, setUnlocked] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      setUnlocked(saved);
    } catch(e) { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  const total = skillsData.length;
  const done = skillsData.reduce((acc, s)=>unlocked[s.id]?acc+1:acc,0);

  // PUBLIC_INTERFACE
  function handleToggle(id) {
    setUnlocked(u=>({ ...u, [id]: !u[id] }));
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🗺️ Progress Map & Skill Tree</div>
      <div className="ema-section-desc">
        Visualize your journey, unlock topics, and track mastery levels.
      </div>
      <div style={{marginTop:8,marginBottom:8}}>
        <div style={{display:"flex", justifyContent:"center", gap:22, margin: "17px 0"}}>
          {skillsData.map((skill,i)=>(
            <div 
              key={skill.id}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center",
                opacity: unlocked[skill.id]?1: 0.5
              }}
            >
              <button
                style={{
                  height:38, width:38, borderRadius:"50%",
                  border: unlocked[skill.id]?"2px solid #00B8D9":"2px solid #ddd",
                  background: unlocked[skill.id]?"#B2FEFA":"#f8f8f8",
                  fontWeight:700, color:"#434344", marginBottom:2,
                  cursor:"pointer"
                }}
                aria-label={unlocked[skill.id]?"Mark as incomplete":"Unlock skill"}
                onClick={()=>handleToggle(skill.id)}
              >
                {unlocked[skill.id]?"✓":i+1}
              </button>
              <div style={{
                fontSize: "0.93rem",
                color:unlocked[skill.id]?"#00B8D9":"#555994"
              }}>{skill.label}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",color:"#555994",fontSize:"0.98rem"}}>
          Progress: <b>{done}/{total}</b> ({Math.round((done/total)*100)}%)
        </div>
      </div>
    </section>
  );
}

export default ProgressMapSection;
