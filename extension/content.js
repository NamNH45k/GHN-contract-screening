// GHN Legal AI Contract Screening - Haraworks & Lisa Content Script

console.log("GHN Legal AI Contract Screening: Content script loaded on Haraworks / Lisa.");

// Inject CSS styles for the push button directly into the page
const style = document.createElement("style");
style.textContent = `
  .antigravity-push-btn {
    background: #ff6c0a !important;
    border-radius: 4px !important;
    border: none !important;
    color: #ffffff !important;
    font-family: inherit !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    padding: 4px 8px !important;
    margin-left: 10px !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 2px 5px rgba(255, 108, 10, 0.2) !important;
    vertical-align: middle !important;
  }
  .antigravity-push-btn:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 4px 8px rgba(255, 108, 10, 0.4) !important;
  }
  .antigravity-push-btn.success {
    background: #16a34a !important;
    color: #ffffff !important;
    box-shadow: 0 2px 5px rgba(22, 163, 74, 0.2) !important;
  }
`;
document.head.appendChild(style);

// Global debug counter
let scanIteration = 0;

// Function to aggressively find contracts and inject button
function injectPushButtons() {
  scanIteration++;
  const matchedElements = [];

  // --- ENGINE 1: Scan all A (anchor) elements ---
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    if (link.querySelector(".antigravity-push-btn") || link.classList.contains("antigravity-push-btn") || link.closest(".antigravity-push-btn")) {
      return;
    }

    const text = (link.textContent || "").trim();
    const textLower = text.toLowerCase();
    const href = (link.getAttribute("href") || "").toLowerCase();
    const title = (link.getAttribute("title") || "").toLowerCase();

    // Must contain a document extension
    const hasDocExtension = textLower.endsWith(".pdf") || textLower.endsWith(".docx") || textLower.endsWith(".doc") ||
                            title.endsWith(".pdf") || title.endsWith(".docx") || title.endsWith(".doc") ||
                            /\.(pdf|docx|doc)(\?|$)/i.test(href);

    if (!hasDocExtension) {
      return;
    }

    // Filter out very long subjects or navigation menus
    if (text.length > 120) {
      return;
    }

    matchedElements.push({
      element: link,
      fileName: text || title || "hop_dong",
      type: "link"
    });
  });

  // --- ENGINE 2: Scan other potential container elements if A didn't capture them ---
  const containers = document.querySelectorAll("div, span, li, tr, p");
  containers.forEach(container => {
    // Only check leaves (elements with no element children or simple text)
    if (container.children.length > 2) return;
    if (container.querySelector(".antigravity-push-btn") || container.classList.contains("antigravity-push-btn")) {
      return;
    }

    const text = container.textContent.trim();
    const textLower = text.toLowerCase();
    
    // Check if container text itself ends with the extension
    const hasDocExtension = textLower.endsWith(".pdf") || textLower.endsWith(".docx") || textLower.endsWith(".doc");

    if (hasDocExtension && text.length < 120) {
      matchedElements.push({
        element: container,
        fileName: text,
        type: "container"
      });
    }
  });

  // Unique elements to prevent double injection on same container
  const uniqueMatches = [];
  const seenParents = new Set();

  matchedElements.forEach(match => {
    const parent = match.element.parentElement;
    if (parent && !seenParents.has(parent)) {
      seenParents.add(parent);
      uniqueMatches.push(match);
    }
  });

  if (uniqueMatches.length > 0 && scanIteration % 5 === 0) {
    console.log(`[GHN Legal AI] Scanned DOM: Found ${uniqueMatches.length} contract elements.`, uniqueMatches);
  }

  // Inject buttons next to matched elements
  uniqueMatches.forEach(match => {
    const targetElement = match.element;
    
    // Check if target or parent already has button
    if (targetElement.parentNode.querySelector(".antigravity-push-btn")) {
      return;
    }

    const button = document.createElement("button");
    button.className = "antigravity-push-btn";
    button.innerHTML = "🚚 Đẩy sang WebApp";
    // SEC-009: Sanitize DOM-sourced text before using in attributes
    const safeFileName = match.fileName.replace(/[<>"'&\x00-\x1f]/g, "").substring(0, 100);
    button.title = `Rà soát tài liệu: ${safeFileName}`;

    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      button.textContent = "⌛ Đang đẩy...";
      button.disabled = true;

      // Extract metadata
      let sender = window.location.hostname === "ic.haraworks.vn" ? "Haraworks User" : "Lisa User";
      let dateText = new Date().toLocaleDateString("vi-VN");
      
      try {
        // Attempt to extract sender from email/task headers if available
        const senderElement = document.querySelector("[class*='sender'], [class*='author'], .mail-from, .user-name, .created-by");
        if (senderElement) {
          sender = senderElement.textContent.trim();
        }
        const dateElement = document.querySelector("[class*='date'], [class*='time'], .mail-time, .created-at");
        if (dateElement) {
          dateText = dateElement.textContent.trim() || dateText;
        }
      } catch (err) {
        console.warn("Could not parse sender or date info:", err);
      }

      // Cleanup filename
      let cleanFileName = match.fileName.replace(/[\n\r\t]/g, "").trim();
      // If it is too long, truncate it
      if (cleanFileName.length > 80) {
        cleanFileName = cleanFileName.substring(0, 77) + "...";
      }

      const payload = {
        fileName: cleanFileName,
        sender: sender,
        receivedDate: dateText,
        fileSize: "1.5 MB",
        contentHash: Math.random().toString(36).substring(7)
      };

      // Send message to background script to trigger fetch
      chrome.runtime.sendMessage({
        action: "push_contract_to_webapp",
        payload: payload
      }, (response) => {
        if (response && response.success) {
          button.innerHTML = "✓ Đã đẩy";
          button.classList.add("success");
          targetElement.style.boxShadow = "0 0 10px rgba(80, 250, 123, 0.4)";
          targetElement.style.border = "1px solid #50fa7b";
        } else {
          button.innerHTML = "❌ Lỗi";
          button.disabled = false;
          setTimeout(() => {
            button.innerHTML = "🚚 Đẩy sang WebApp";
          }, 2000);
        }
      });
    });

    // Inject next to matched element
    if (targetElement.nextSibling) {
      targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
    } else {
      targetElement.parentNode.appendChild(button);
    }
  });
}

// Run the injector periodically using a MutationObserver
const observer = new MutationObserver((mutations) => {
  injectPushButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run once on load
injectPushButtons();

// Listen for manual trigger from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan_active_tab_manual") {
    injectPushButtons();
    
    // Find the first push button that is not pushed yet and trigger it
    const pushButtons = document.querySelectorAll(".antigravity-push-btn:not(.success)");
    if (pushButtons.length > 0) {
      pushButtons[0].click();
      sendResponse({ success: true });
    } else {
      // Check if there is already a pushed success button
      const successButtons = document.querySelectorAll(".antigravity-push-btn.success");
      if (successButtons.length > 0) {
        sendResponse({ success: true, alreadyPushed: true });
      } else {
        // Output DOM search results for debug console
        console.warn("[GHN Legal AI] Scan request failed. No match elements found on page.");
        sendResponse({ success: false });
      }
    }
    return true;
  }
});
