document.addEventListener("DOMContentLoaded", () => {
  const btnScanTab = document.getElementById("btn-scan-current-tab");
  const btnScanUrl = document.getElementById("btn-scan-url");
  const urlInput = document.getElementById("adhoc-url-input");
  const statScanned = document.getElementById("stat-scanned");
  const statPushed = document.getElementById("stat-pushed");

  // Load stats from chrome storage
  const updateStats = () => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["scannedCount", "pushedCount"], (result) => {
        statScanned.textContent = result.scannedCount || 0;
        statPushed.textContent = result.pushedCount || 0;
      });
    } else {
      // Mock stats for developer preview
      statScanned.textContent = "12";
      statPushed.textContent = "9";
    }
  };

  updateStats();

  // Scan current active tab
  btnScanTab.addEventListener("click", () => {
    btnScanTab.textContent = "Đang rà soát...";
    btnScanTab.disabled = true;

    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
          // Send message to content script in the active tab to execute screening
          chrome.tabs.sendMessage(activeTab.id, { action: "scan_active_tab_manual" }, (response) => {
            setTimeout(() => {
              btnScanTab.textContent = "Rà soát trang hiện tại (Active Tab)";
              btnScanTab.disabled = false;
              updateStats();
              if (response && response.success) {
                alert("Đã hoàn thành rà soát tài liệu trên trang này và đồng bộ về WebApp!");
              } else {
                alert("Không tìm thấy tệp hợp đồng nào (.pdf/.docx) trên trang hiện tại để rà soát.");
              }
            }, 1200);
          });
        }
      });
    } else {
      // Simulation fallback
      setTimeout(() => {
        btnScanTab.textContent = "Rà soát trang hiện tại (Active Tab)";
        btnScanTab.disabled = false;
        alert("Đã quét tab hiện tại. Vui lòng mở Cổng Giả Lập ở thư mục gốc để click nút Đẩy thủ công từng file.");
      }, 1000);
    }
  });

  // Scan specific URL input (Ad-hoc)
  btnScanUrl.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (!url) {
      alert("Vui lòng nhập hoặc dán liên kết Haraworks/Lisa chứa hợp đồng cần quét.");
      return;
    }

    btnScanUrl.textContent = "⌛";
    btnScanUrl.disabled = true;

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: "scan_url_adhoc", url: url }, (response) => {
        setTimeout(() => {
          btnScanUrl.textContent = "Gửi Link Screen";
          btnScanUrl.disabled = false;
          urlInput.value = "";
          updateStats();
          if (response && response.success) {
            alert(`Đã nhận yêu cầu rà soát liên kết: ${url}\nKết quả đã được cập nhật trên WebApp.`);
          }
        }, 1500);
      });
    } else {
      // Simulation fallback
      setTimeout(() => {
        btnScanUrl.textContent = "Gửi Link Screen";
        btnScanUrl.disabled = false;
        urlInput.value = "";
        
        // Notify parent simulator window if running inside iframe
        if (window.parent) {
          window.parent.postMessage({ action: "simulator_scan_url", url: url }, window.location.origin);
        } else {
          alert(`Giả lập gửi link đối soát: ${url}`);
        }
      }, 1000);
    }
  });
});
