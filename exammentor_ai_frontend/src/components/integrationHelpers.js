//
// integrationHelpers.js
// Utility helpers for using/exposing feature upgrades with external APIs (future-ready)
//
// All sections can import { getApiIntegration, isApiFeatureEnabled } for seamless API usage.
//

// PUBLIC_INTERFACE
export function getApiIntegration(keyName) {
  // Returns settings for a given API (or null if not available)
  try {
    const data = JSON.parse(localStorage.getItem("mm.api-integrations-v1") || "{}");
    return data[keyName] || null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function isApiFeatureEnabled(keyName) {
  // Returns true if API key exists AND feature is enabled in settings
  const s = getApiIntegration(keyName);
  return !!(s && s.key && (typeof s.enabled === "undefined" || s.enabled === true));
}

/*
  USAGE EXAMPLES (in QnA or Coach):
    import { getApiIntegration, isApiFeatureEnabled } from "./integrationHelpers";

    if (isApiFeatureEnabled("openai")) {
       const settings = getApiIntegration("openai");
       // settings.key, settings.enabled, settings.testStatus
       // ... Call to real OpenAI API!
    } else {
       // Fallback to mock/local response
    }
*/
