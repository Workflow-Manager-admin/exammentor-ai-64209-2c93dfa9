// PUBLIC_INTERFACE
import React from "react";

/**
 * CommunitySection displays challenges, leaderboards, and study buddy options.
 */
const CommunitySection = () => (
  <section className="ema-section-card">
    <div className="ema-section-title">🏆 Community & Study Buddies</div>
    <div className="ema-section-desc">
      Join challenges, view leaderboards, and match with study buddies.
    </div>
    <button className="ema-btn" disabled>Explore Community (soon)</button>
  </section>
);

export default CommunitySection;
