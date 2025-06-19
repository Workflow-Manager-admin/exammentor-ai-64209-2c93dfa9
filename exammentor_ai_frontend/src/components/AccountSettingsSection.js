//
// AccountSettingsSection: External API key management and integrations (OpenAI/API-ready)
// Allows users to input, test, and enable/disable advanced features requiring external backends.
//

import React, { useState, useEffect } from "react";

// Key where API credentials/settings are stored in localStorage
const INTEGRATION_KEY = "mm.api-integrations-v1";
const AVAILABLE_APIS = [
  {
    name: "OpenAI GPT-4",
    keyName: "openai",
    description: "Enable AI-powered features such as Q&A Helper, Goal Breakdown, and Coach.",
    docUrl: "https://platform.openai.com/account/api-keys",
    icon: "🤖"
  }
  // Extendable: add other APIs here!
];

// PUBLIC_INTERFACE
function AccountSettingsSection({ onSettingsChange }) {
  // { openai: { key: "...", enabled: true, testStatus: "success"/"fail"/null } }
  const [settings, setSettings] = useState({});
  const [editing, setEditing] = useState({});
  const [busy, setBusy] = useState({}); // { [keyName]: bool }
  const [feedback, setFeedback] = useState({}); // { [keyName]: status string }

  // Load settings from storage
  useEffect(() => {
    try {
      const s = localStorage.getItem(INTEGRATION_KEY);
      if (s) setSettings(JSON.parse(s));
    } catch {}
  }, []);

  // Save to localStorage and inform parent
  function saveSettings(newSettings) {
    setSettings(newSettings);
    localStorage.setItem(INTEGRATION_KEY, JSON.stringify(newSettings));
    if (onSettingsChange) onSettingsChange(newSettings);
  }

  // Update input state during editing
  function handleEditChange(keyName, field, value) {
    setEditing(edit => ({ ...edit, [keyName]: { ...(edit[keyName]||{}), [field]: value } }));
  }

  // Save API key for an integration
  function saveApiKey(keyName) {
    const newValue = (editing[keyName]?.key||"").trim();
    saveSettings({
      ...settings,
      [keyName]: {
        ...(settings[keyName]||{}),
        key: newValue,
        enabled: true,
        testStatus: null
      }
    });
    setEditing(edit => ({ ...edit, [keyName]: { key: "" } }));
  }

  // Toggle API feature enable/disable
  function toggleEnabled(keyName, flag) {
    saveSettings({
      ...settings,
      [keyName]: { ...(settings[keyName]||{}), enabled: flag }
    });
  }

  // Remove API key
  function removeApiKey(keyName) {
    // eslint-disable-next-line no-unused-vars
    const { [keyName]: omit, ...rest } = settings;
    saveSettings(rest);
    setEditing(edit => ({ ...edit, [keyName]: { key: "" } }));
  }

  // Stub: "Test" API key connection with a simulated async call for demo
  async function testConnection(keyName, key) {
    setBusy(b => ({ ...b, [keyName]: true }));
    setFeedback(f => ({ ...f, [keyName]: null }));
    // Simulate network latency
    await new Promise(r => setTimeout(r, 1200));
    // For demo: fail if "invalid" in key, else pass
    if (key && key.toLowerCase().includes("invalid")) {
      setFeedback(f => ({ ...f, [keyName]: "fail" }));
      saveSettings({
        ...settings,
        [keyName]: { ...(settings[keyName]||{}), testStatus: "fail" }
      });
    } else if (key) {
      setFeedback(f => ({ ...f, [keyName]: "success" }));
      saveSettings({
        ...settings,
        [keyName]: { ...(settings[keyName]||{}), testStatus: "success" }
      });
    } else {
      setFeedback(f => ({ ...f, [keyName]: "fail" }));
    }
    setBusy(b => ({ ...b, [keyName]: false }));
  }

  return (
    <section className="ema-section-card">
      <div className="ema-section-title">🔐 Account & API Integrations</div>
      <div className="ema-section-desc">
        Connect third-party APIs to unlock advanced features.<br/>API keys are securely stored in your browser (never sent to our servers).
      </div>
      <div style={{marginTop:12, marginBottom:6}}>
        {AVAILABLE_APIS.map(api => {
          const state = settings[api.keyName] || {};
          const editState = editing[api.keyName] || {};
          const keyPresent = !!state.key;
          const enableSwitch = typeof state.enabled === "boolean" ? state.enabled : keyPresent;
          return (
            <div key={api.keyName} style={{
              background:"#FAFBFF",border:"1px solid #D6EAF8", borderRadius:8,marginBottom:14,
              padding:"14px 14px 12px", position:"relative"
            }}>
              <div style={{
                fontWeight:600, fontSize:"1.13rem", marginBottom:2, display:"flex", alignItems:"center", gap:8
              }}>
                <span style={{fontSize:"1.28rem"}}>{api.icon}</span>
                {api.name}
                <span style={{marginLeft:6, fontSize:"0.92rem",color:"#AAA"}}>{enableSwitch ? "Enabled" : "Disabled"}</span>
              </div>
              <div style={{fontSize:"0.96rem", color:"#777", marginBottom:7}}>
                {api.description}
              </div>
              {!keyPresent ? (
                // Input API key
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                  <input
                    type={api.keyName==="openai" ? "password" : "text"}
                    placeholder={`Enter ${api.name} API key`}
                    aria-label={`${api.name} API key`}
                    value={editState.key || ""}
                    style={{
                      padding:"7px 10px",minWidth:210,border:"1px solid #DDD",borderRadius:5,fontSize:"1rem"
                    }}
                    onChange={e=>handleEditChange(api.keyName, "key", e.target.value)}
                  />
                  <button
                    className="ema-btn"
                    style={{background:"#00B8D9"}}
                    onClick={()=>saveApiKey(api.keyName)}
                    disabled={!(editState.key && editState.key.trim() && !busy[api.keyName])}
                  >Save Key</button>
                  <a
                    href={api.docUrl}
                    style={{marginLeft:6,fontSize:"0.96rem",color:"#356DE6",textDecoration:"underline"}}
                    target="_blank" rel="noopener noreferrer"
                  >Get API Key</a>
                </div>
              ) : (
                <div>
                  <div style={{
                    display:"flex",alignItems:"center",gap:8,margin:"2px 0 2px"
                  }}>
                    <span style={{fontFamily:"monospace",background:"#eee",padding:"3px 8px",borderRadius:4,fontSize:"1.00rem"}}>
                      {"*".repeat(Math.max(6,(state.key||"").length))}
                    </span>
                    <button
                      className="ema-btn"
                      style={{background:"#FFD600",color:"#232943",fontWeight:600,padding:"6px 14px"}}
                      onClick={()=>removeApiKey(api.keyName)}
                    >Remove Key</button>
                    <button
                      className="ema-btn"
                      style={{background:"#4A90E2"}}
                      onClick={()=>testConnection(api.keyName, state.key)}
                      disabled={busy[api.keyName]}
                    >
                      {busy[api.keyName] ? "Testing..." : "Test Connection"}
                    </button>
                    <label style={{marginLeft:10,cursor:"pointer",fontSize:"0.98rem",fontWeight:"500"}}>
                      <input
                        type="checkbox"
                        checked={enableSwitch}
                        onChange={e=>toggleEnabled(api.keyName,e.target.checked)}
                        style={{marginRight:3}}
                        aria-label="Enable feature"
                      />
                      Enable
                    </label>
                  </div>
                  {state.testStatus && (
                    <div style={{
                      marginTop:3,
                      color: state.testStatus==="success"?"#00B8D9":"#FF7A59",
                      fontWeight:500
                    }}>
                      {state.testStatus==="success"
                        ? "Connection successful! Advanced features unlocked."
                        : "Test failed – please check your API key."}
                    </div>
                  )}
                </div>
              )}
              {feedback[api.keyName]==="fail" && (
                <div style={{color:"#FF7A59", marginTop:4,fontWeight:500,fontSize:"0.97rem"}}>
                  Failed to connect. Invalid API key or network error.
                </div>
              )}
              {feedback[api.keyName]==="success" && (
                <div style={{color:"#21b871", marginTop:4,fontWeight:500,fontSize:"0.97rem"}}>
                  Connection test passed! Features enabled.
                </div>
              )}
            </div>
          );
        })}
      </div>
      <hr className="ema-divider" />
      <div>
        <div style={{fontWeight:600,marginBottom:4,fontSize:"1.04rem"}}>About Security & Privacy</div>
        <ul style={{margin:0,paddingLeft:24,fontSize:"0.97rem"}}>
          <li>API keys are <b>never</b> sent to our servers — stored only in your browser for integrations.</li>
          <li>You are in full control: API features work locally and are fully optional.</li>
          <li>When real integrations are enabled, only direct calls to those APIs will be made from your browser.</li>
        </ul>
      </div>
    </section>
  );
}

export default AccountSettingsSection;
