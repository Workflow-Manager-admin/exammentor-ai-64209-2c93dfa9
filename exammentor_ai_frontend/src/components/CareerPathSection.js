// PUBLIC_INTERFACE
import React, { useState, useEffect } from "react";

/**
 * CareerPathSection: Visualize exam to career goal mapping.
 * User can select a career field, and see mapped exams and a simple "roadmap".
 */
const CAREER_KEY = "mm.career-visualizer-v1";
const fields = [
  { name: "Doctor", exams: ["NEET", "AIIMS"], roadmap: ["School", "NEET", "Medical College", "PG Entrance", "Residency"] },
  { name: "Engineer", exams: ["JEE Main", "JEE Advanced"], roadmap: ["School", "JEE", "B.Tech", "GATE", "M.Tech/Industry"] },
  { name: "Civil Services", exams: ["UPSC CSE"], roadmap: ["School", "Graduation", "UPSC Prelims", "Mains", "Interview"] },
  { name: "Law", exams: ["CLAT"], roadmap: ["School", "CLAT", "Law School", "Bar Exam"] },
];

function getFieldData(fieldName) {
  return fields.find(f => f.name === fieldName);
}

// PUBLIC_INTERFACE
function CareerPathSection() {
  const [career, setCareer] = useState("");
  const [data, setData] = useState(null);

  useEffect(()=>{
    try {
      const saved = localStorage.getItem(CAREER_KEY);
      if (saved) {
        const c = JSON.parse(saved);
        setCareer(c.field);
        setData(getFieldData(c.field));
      }
    } catch(e){}
  },[]);

  // PUBLIC_INTERFACE
  function handleSelect(field) {
    setCareer(field);
    setData(getFieldData(field));
    localStorage.setItem(CAREER_KEY, JSON.stringify({field}));
  }

  // PUBLIC_INTERFACE
  function reset() {
    setCareer("");
    setData(null);
    localStorage.removeItem(CAREER_KEY);
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🚀 Career-Path Visualizer</div>
      <div className="ema-section-desc">
        Map your exam prep to long-term career and academic goals.
      </div>
      {!career ? (
        <div style={{marginTop:8}}>
          <div style={{fontWeight:500}}>Choose your Field:</div>
          <div style={{display:"flex",gap:10,marginTop:6}}>
            {fields.map(f=>
              <button className="ema-btn"
                style={{background:"#00B8D9",color:"#fff"}}
                key={f.name}
                onClick={()=>handleSelect(f.name)}
              >{f.name}</button>
            )}
          </div>
        </div>
      ) : (
        <div style={{marginTop:8}}>
          <div>
            <b>{career}</b> mapped exams: <span style={{fontWeight:500,color:"#FFD600"}}>{data?.exams.join(", ")}</span>
          </div>
          <div style={{margin:"10px 0 5px",fontWeight:500}}>📍 Roadmap:</div>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
            {data?.roadmap.map((step,i)=>
              <span key={i} style={{
                background:"#F4F5FF",borderRadius:6,padding:"6px 11px",marginRight:4,
                fontWeight:i===0?"600":"400",color:i===0?"#00B8D9":"#565994"
              }}>
                {step}
                {i<data.roadmap.length-1&&<span style={{margin:"0 6px",color:"#bbb"}}>→</span>}
              </span>
            )}
          </div>
          <button className="ema-btn" style={{marginTop:9, background:'#FF7A59'}}
            onClick={reset}
          >Change Goal</button>
        </div>
      )}
    </section>
  );
}

export default CareerPathSection;
