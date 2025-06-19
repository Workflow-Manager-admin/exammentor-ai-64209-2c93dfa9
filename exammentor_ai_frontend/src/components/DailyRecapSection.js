// PUBLIC_INTERFACE
import React from "react";

/**
 * DailyRecapSection: Shows smart daily summary of progress.
 */
const DailyRecapSection = () => (
  <section className="ema-section-card">
    <div className="ema-section-title">📆 Smart Daily Recap</div>
    <div className="ema-section-desc">
      Get daily summaries with emojis, milestones and progress!
    </div>
    <button className="ema-btn" disabled>See Today's Recap</button>
  </section>
);

export default DailyRecapSection;
