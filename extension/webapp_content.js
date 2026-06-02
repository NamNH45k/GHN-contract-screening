// GHN Legal AI Extension - WebApp Bridge Content Script
console.log("GHN Legal AI WebApp Bridge Content Script loaded.");

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "push_contract_from_background") {
    console.log("Bridge forwarding pushed contract:", message.payload.fileName);
    
    // Forward the payload directly to the WebApp page window
    window.postMessage({
      action: "push_contract_from_extension",
      payload: message.payload
    }, "*");
    
    sendResponse({ success: true });
  }
  return true;
});
