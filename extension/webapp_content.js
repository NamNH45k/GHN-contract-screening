// GHN Legal AI Extension - WebApp Bridge Content Script
console.log("GHN Legal AI WebApp Bridge Content Script loaded.");

// Trusted WebApp origins allowed to receive contract payloads
const TRUSTED_WEBAPP_ORIGINS = [
  "https://ghn-contract-screening.vercel.app",
  "http://localhost",
  "http://127.0.0.1"
];

// Determine the target origin for postMessage based on current page URL
const getTargetOrigin = () => {
  const loc = window.location;
  // If running on one of the known trusted hosts, use that exact origin
  for (const trusted of TRUSTED_WEBAPP_ORIGINS) {
    if (loc.href.startsWith(trusted)) {
      return loc.origin;
    }
  }
  // Fallback: use current page origin (safer than "*")
  return loc.origin;
};

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "push_contract_from_background") {
    const payload = message.payload;

    // Basic payload validation — ensure required fields exist and are strings
    if (!payload || typeof payload.fileName !== "string") {
      console.warn("GHN Bridge: Received invalid payload, rejecting.");
      sendResponse({ success: false, reason: "Invalid payload" });
      return true;
    }

    console.log("Bridge forwarding pushed contract:", payload.fileName);

    // Forward the payload to the WebApp page window with a specific trusted origin
    window.postMessage({
      action: "push_contract_from_extension",
      payload: payload
    }, getTargetOrigin());

    sendResponse({ success: true });
  }
  return true;
});
