//
// openaiQnaHelper.js
// Simple helper for GPT-4 Q&A with conversation support and streaming for ExamMentor AI frontend
//
// Usage: import { fetchGpt4QA } from "./openaiQnaHelper";
//
import { getApiIntegration, isApiFeatureEnabled } from "./integrationHelpers";

/**
 * Calls OpenAI's GPT-4 chat/completions endpoint with Q&A prompt and conversation, streaming if supported.
 * @param {string} question - The new user question.
 * @param {Array} chatHistory - Array of {q, a} objects for previous messages.
 * @param {object} [opts] - { signal:AbortSignal, onToken(token:string):void }
 * @returns {Promise<string>} - Resolves to the answer, or throws Error.
 */
// PUBLIC_INTERFACE
export async function fetchGpt4QA(question, chatHistory, opts = {}) {
  if (!isApiFeatureEnabled("openai")) throw new Error("OpenAI integration not enabled.");
  const openai = getApiIntegration("openai");
  if (!openai?.key) throw new Error("OpenAI API key not set.");

  const messages = [
    {
      role: "system",
      content:
        "You are a helpful, expert study assistant providing clear, trustworthy answers for exam prep. Be concise, factual, and student-friendly.",
    },
    // Add prior context as alternating user/assistant turns:
    ...(chatHistory || []).flatMap((msg) => [
      { role: "user", content: msg.q },
      ...(msg.a ? [{ role: "assistant", content: msg.a }] : []),
    ]),
    { role: "user", content: question },
  ];

  const body = {
    model: "gpt-4",
    messages,
    temperature: 0.5,
    max_tokens: 512,
    stream: typeof opts.onToken === "function", // if streaming possible
  };

  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    Authorization: `Bearer ${openai.key}`,
    "Content-Type": "application/json",
  };

  if (body.stream) {
    // Streaming reply (for streaming-capable UIs)
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: opts.signal,
    });
    if (!resp.ok) {
      let msg = `OpenAI error: ${resp.status}`;
      try { const err = await resp.json(); msg += " - " + (err?.error?.message || ""); } catch {}
      throw new Error(msg);
    }
    // NDJSON stream: lines starting with "data: " until [DONE]
    const decoder = new TextDecoder("utf-8");
    const reader = resp.body.getReader();
    let done = false;
    let answer = "";
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (streamDone) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split("\n")) {
        if (!line.trim().startsWith("data:")) continue;
        const data = line.replace(/^data:\s*/, "");
        if (data === "[DONE]") { done = true; break; }
        if (!data) continue;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            answer += delta;
            opts.onToken && opts.onToken(delta);
          }
        } catch {}
      }
    }
    return answer.trim();
  } else {
    // Non-streaming: regular completion
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: opts.signal,
    });
    if (!resp.ok) {
      let msg = `OpenAI error: ${resp.status}`;
      try { const err = await resp.json(); msg += " - " + (err?.error?.message || ""); } catch {}
      throw new Error(msg);
    }
    const data = await resp.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  }
}
