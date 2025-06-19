// PUBLIC_INTERFACE
import React from "react";

/**
 * GoalsSection displays AI Goal Breakdown Generator and related actions.
 */
const GoalsSection = () => (
  <section className="ema-section-card">
    <div className="ema-section-title">🎯 AI Goal Breakdown</div>
    <div className="ema-section-desc">
      Generate your exam prep plan with topic-wise breakdowns & checkpoints.
    </div>
    <button className="ema-btn" disabled>Generate Plan (coming soon)</button>
  </section>
);

export default GoalsSection;
