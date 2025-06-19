import React, { useState } from "react";
import "./App.css";
import "./ExamMentorAI.css";
import GoalsSection from "./components/GoalsSection";
import FocusModeSection from "./components/FocusModeSection";
import ProgressMapSection from "./components/ProgressMapSection";
import PerformanceCoachSection from "./components/PerformanceCoachSection";
import CommunitySection from "./components/CommunitySection";
import MoodFocusSection from "./components/MoodFocusSection";
import EmergencyBoostSection from "./components/EmergencyBoostSection";
import CareerPathSection from "./components/CareerPathSection";
import QnAHelperSection from "./components/QnAHelperSection";
import RewardSystemSection from "./components/RewardSystemSection";
import DailyRecapSection from "./components/DailyRecapSection";
import AccountSettingsSection from "./components/AccountSettingsSection";

// PUBLIC_INTERFACE
function App() {
  const [showSettings, setShowSettings] = useState(false);

  // Handle navigation to settings (Account/API Integration)
  function handleSettingsNav(e) {
    e.preventDefault();
    setShowSettings(true);
    // Optional: Scroll to top for clarity
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function handleHomeNav(e) {
    e.preventDefault();
    setShowSettings(false);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  return (
    <div className="mmprep-dashboard">
      {/* Navbar */}
      <nav className="ema-navbar">
        <div className="ema-navbar-inner">
          <div className="ema-logo" style={{cursor:"pointer"}} onClick={handleHomeNav}>
            <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "2rem" }}>📍</span>
            MapMyPrep
            <span style={{ color: "var(--secondary)", fontWeight: "600", fontSize: "1.35rem", marginLeft: "0.4rem" }}>AI</span>
          </div>
          <div className="ema-nav-links">
            <a href="#goals" className="ema-nav-link">Goals</a>
            <a href="#progress" className="ema-nav-link">Progress</a>
            <a href="#community" className="ema-nav-link">Community</a>
            <a href="#tools" className="ema-nav-link">Tools</a>
            <a
              href="#account-settings"
              className="ema-nav-link"
              style={{
                background: "#FF7A59", color: "#fff", borderRadius: 4, padding: "5px 13px", marginLeft: 18, fontWeight:600
              }}
              onClick={handleSettingsNav}
            >
              Account & API
            </a>
          </div>
        </div>
      </nav>

      <main>
        {!showSettings ? (
          <div className="ema-dashboard-grid">
            {/* Left: Goals and Focus */}
            <div>
              <GoalsSection />
              <FocusModeSection />
              <EmergencyBoostSection />
              <CareerPathSection />
            </div>
            {/* Center: Progress & Tools */}
            <div>
              <ProgressMapSection />
              <PerformanceCoachSection />
              <RewardSystemSection />
              <DailyRecapSection />
            </div>
            {/* Right: Community and Mood */}
            <div>
              <CommunitySection />
              <MoodFocusSection />
              <QnAHelperSection />
            </div>
          </div>
        ) : (
          <div style={{maxWidth:760, margin:"38px auto 0", padding:"18px 0"}}>
            <AccountSettingsSection onSettingsChange={() => {}} />
            <div style={{textAlign:"center",margin:"32px 0 0"}}>
              <button
                className="ema-btn"
                style={{
                  fontWeight: 600,
                  background: "#A259FF", marginTop: "20px"
                }}
                onClick={handleHomeNav}
              >← Back to Dashboard</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;