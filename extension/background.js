// Antigravity AI Contract Screening - Background Service Worker

// Initialize default storage values upon extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    scannedCount: 12,
    pushedCount: 9,
    webAppConnected: true
  });
  console.log("AI Contract Screening Extension initialized successfully.");
});

// Listen for messages from Content Scripts (Gmail UI) or Popup UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan_gmail") {
    // Simulating scanning process
    chrome.storage.local.get(["scannedCount", "pushedCount"], (result) => {
      const currentScanned = result.scannedCount || 0;
      const currentPushed = result.pushedCount || 0;
      
      // Increment stats as a mock trigger
      const updatedScanned = currentScanned + 1;
      const updatedPushed = currentPushed + 1;
      
      chrome.storage.local.set({
        scannedCount: updatedScanned,
        pushedCount: updatedPushed
      }, () => {
        console.log(`Scan complete. Scanned: ${updatedScanned}, Pushed: ${updatedPushed}`);
        sendResponse({ success: true, scanned: updatedScanned, pushed: updatedPushed });
      });
    });
    return true; // Keeps the message channel open for asynchronous responses
  }
  
  if (request.action === "scan_url_adhoc") {
    // Simulating ad-hoc URL scan and push
    chrome.storage.local.get(["scannedCount", "pushedCount"], (result) => {
      const currentScanned = result.scannedCount || 0;
      const currentPushed = result.pushedCount || 0;
      chrome.storage.local.set({
        scannedCount: currentScanned + 1,
        pushedCount: currentPushed + 1
      }, () => {
        sendResponse({ success: true, url: request.url });
      });
    });
    return true;
  }

  if (request.action === "push_contract_to_webapp") {
    const contractData = request.payload;
    console.log("Received contract push request from content script:", contractData.fileName);

    chrome.storage.local.get(["pushedContracts", "pushedCount"], (result) => {
      const pushedContracts = result.pushedContracts || [];
      const currentPushed = result.pushedCount || 0;
      
      // Avoid duplicate filenames in storage
      if (!pushedContracts.some(c => c.fileName === contractData.fileName)) {
        pushedContracts.push(contractData);
      }
      
      const updatedPushed = currentPushed + 1;

      chrome.storage.local.set({ 
        pushedContracts: pushedContracts,
        pushedCount: updatedPushed
      }, () => {
        // Send to open WebApp tab immediately
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            const decodedUrl = tab.url ? decodeURIComponent(tab.url) : "";
            const isWebAppTab = (tab.title && tab.title.includes("GHN Legal AI")) ||
                                (tab.url && (decodedUrl.includes("Screen hợp đồng") || tab.url.includes("index.html") || tab.url.includes("localhost") || tab.url.includes("127.0.0.1")));
            if (isWebAppTab) {
              chrome.tabs.sendMessage(tab.id, {
                action: "push_contract_from_background",
                payload: contractData
              }).catch(err => console.log("Failed to send message to webapp tab:", err));
            }
          });
        });

        // Mock pushing to WebApp API
        fetch("http://localhost:3000/api/contracts/receive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(contractData)
        })
        .then(response => response.json())
        .then(data => {
          chrome.storage.local.set({ webAppConnected: true }, () => {
            sendResponse({ success: true, serverResponse: data });
          });
        })
        .catch(error => {
          console.log("WebApp local server offline. Pushing locally in browser storage.");
          chrome.storage.local.set({ webAppConnected: false }, () => {
            sendResponse({ success: true, localSimulation: true });
          });
        });
      });
    });
    return true;
  }
});

// Listen for tab loading to sync stored contracts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const decodedUrl = tab.url ? decodeURIComponent(tab.url) : "";
  const isWebAppTab = (tab.title && tab.title.includes("GHN Legal AI")) ||
                      (tab.url && (decodedUrl.includes("Screen hợp đồng") || tab.url.includes("index.html") || tab.url.includes("localhost") || tab.url.includes("127.0.0.1")));
  if (changeInfo.status === 'complete' && isWebAppTab) {
    chrome.storage.local.get(["pushedContracts"], (result) => {
      const pushedContracts = result.pushedContracts || [];
      if (pushedContracts.length > 0) {
        // Wait a short duration for webapp_content.js to register its listener
        setTimeout(() => {
          pushedContracts.forEach(contract => {
            chrome.tabs.sendMessage(tabId, {
              action: "push_contract_from_background",
              payload: contract
            }).catch(err => console.log("Failed to sync contract to webapp tab:", err));
          });
        }, 800);
      }
    });
  }
});
