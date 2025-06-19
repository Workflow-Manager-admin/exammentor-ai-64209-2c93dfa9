import React from "react";
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

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="mmprep-dashboard">
      {/* Navbar */}
      <nav className="ema-navbar">
        <div className="ema-navbar-inner">
          <div className="ema-logo">
            <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "2rem" }}>📍</span>
            MapMyPrep
            <span style={{ color: "var(--secondary)", fontWeight: "600", fontSize: "1.35rem", marginLeft: "0.4rem" }}>AI</span>
          </div>
          <div className="ema-nav-links">
            <a href="#goals" className="ema-nav-link">Goals</a>
            <a href="#progress" className="ema-nav-link">Progress</a>
            <a href="#community" className="ema-nav-link">Community</a>
            <a href="#tools" className="ema-nav-link">Tools</a>
          </div>
        </div>
      </nav>

      <main>
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
      </main>
    </div>
  );
}

export default App;