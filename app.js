document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let activeFilter = "all";
  let activeContractId = null;

  const TEMPLATE_MAP = {
    "buu_cuc": "Hợp đồng thuê bưu cục (Mẫu có cọc)",
    "ktc": "Hợp đồng thuê kho bãi KTC",
    "tai": "Hợp đồng vận chuyển (Thuê tải trung chuyển)",
    "khach_hang": "Hợp đồng khách hàng (Cung cấp dịch vụ giao chặng cuối)",
    "finetoday": "HĐ Bưu Chính B2B (Dự án Fine Today)",
    "non_ecom": "Hợp đồng khách hàng Non-ecom (Mẫu chuẩn)"
  };

  // Load contracts from localStorage if available
  let localDb = localStorage.getItem("CONTRACTS_DB");
  if (localDb) {
    try {
      const parsed = JSON.parse(localDb);
      parsed.forEach(c => {
        if (!CONTRACTS_DB.some(orig => orig.id === c.id || orig.fileName === c.fileName)) {
          CONTRACTS_DB.unshift(c);
        }
      });
    } catch (e) {
      console.error("Error loading CONTRACTS_DB from localStorage:", e);
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem("CONTRACTS_DB", JSON.stringify(CONTRACTS_DB));
  };

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================
  const totalCntEl = document.getElementById("total-cnt");
  const aCntEl = document.getElementById("a-cnt");
  const bCntEl = document.getElementById("b-cnt");
  const contractsListContainer = document.getElementById("contracts-list-container");
  const workEmptyState = document.getElementById("work-empty-state");
  const panelGroupA = document.getElementById("panel-group-a");
  const panelGroupB = document.getElementById("panel-group-b");

  // Nav menu filters
  const filterItems = document.querySelectorAll(".nav-menu li");

  // ==========================================================================
  // FUNCTIONS
  // ==========================================================================

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const diffWords = (str1, str2) => {
    const words1 = str1.split(/(\s+)/).filter(Boolean);
    const words2 = str2.split(/(\s+)/).filter(Boolean);

    const n = words1.length;
    const m = words2.length;
    const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (words1[i - 1] === words2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    let i = n, j = m;
    const diff = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
        diff.unshift({ type: 'equal', value: words1[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        diff.unshift({ type: 'insert', value: words2[j - 1] });
        j--;
      } else {
        diff.unshift({ type: 'delete', value: words1[i - 1] });
        i--;
      }
    }

    let originalHtml = "";
    let modifiedHtml = "";

    diff.forEach(token => {
      const escapedValue = escapeHtml(token.value);
      if (token.type === 'equal') {
        originalHtml += escapedValue;
        modifiedHtml += escapedValue;
      } else if (token.type === 'delete') {
        if (/\s+/.test(token.value)) {
          originalHtml += escapedValue;
        } else {
          originalHtml += `<span class="diff-del">${escapedValue}</span>`;
        }
      } else if (token.type === 'insert') {
        if (/\s+/.test(token.value)) {
          modifiedHtml += escapedValue;
        } else {
          modifiedHtml += `<span class="diff-ins">${escapedValue}</span>`;
        }
      }
    });

    return { originalHtml, modifiedHtml };
  };

  const isPlaceholderField = (clause, originalText, modifiedText) => {
    const clauseUpper = clause.toUpperCase();
    const origUpper = (originalText || "").toUpperCase();
    const modUpper = (modifiedText || "").toUpperCase();

    // 1. Preamble & Customer Details: If clause contains "ĐIỀU KHOẢN CHUNG", "ĐIỀU KHOẢN THI HÀNH", or starts with "CĂN CỨ"
    if (clauseUpper.includes("ĐIỀU KHOẢN CHUNG") || clauseUpper.includes("ĐIỀU KHOẢN THI HÀNH") || clauseUpper.startsWith("CĂN CỨ")) {
      return true;
    }

    // 1.5 Bracketed placeholders (like [HỌ TÊN], [CHỨC VỤ], etc.) in signature block
    if (/\[[A-ZÀ-Ỹ\s]+\]/.test(originalText || "") || /\[[A-ZÀ-Ỹ\s]+\]/.test(modifiedText || "")) {
      return true;
    }

    // 2. Original or modified contains placeholder lines (___ or ...)
    if (origUpper.includes("___") || origUpper.includes("...") || 
        modUpper.includes("___") || modUpper.includes("...")) {
      return true;
    }

    // 3. Bank Account & Invoicing specific fields (only if they are short lines/labels)
    const isShort = origUpper.length < 90 && modUpper.length < 90;
    const isBankInvoiceField = /số tài khoản|chủ tài khoản|tên tài khoản|tên chủ tài khoản|ngân hàng|chi nhánh|email nhận|nhận hóa đơn|địa chỉ nhận|người nhận hóa đơn/i;
    if (isShort && (isBankInvoiceField.test(origUpper) || isBankInvoiceField.test(modUpper))) {
      return true;
    }

    // 4. Pricing Tables and Surcharges (Phụ lục Bảng giá / Phụ phí)
    if (clauseUpper.includes("BẢNG GIÁ") || clauseUpper.includes("CƯỚC PHÍ") || clauseUpper.includes("PHỤ PHÍ") || 
        clauseUpper.includes("PHỤ LỤC 01") || clauseUpper.includes("PHỤ LỤC 02") || clauseUpper.includes("PHỤ LỤC BẢNG GIÁ")) {
      return true;
    }

    // 5. Payment clause specific filled fields (tax code, company name, address, contact name, phone, etc.)
    if (clauseUpper.includes("THANH TOÁN") || clauseUpper.includes("THANH TOAN")) {
      const nonEmptyText = origUpper || modUpper;
      if (nonEmptyText.length < 150) {
        const isTaxOrPhone = /^[0-9. -]+$/.test(nonEmptyText);
        const isCompany = /CÔNG TY|TNHH|CỔ PHẦN|CP|GROUP|LOGISTICS/i.test(nonEmptyText);
        const isAddress = /số\b|đường\b|phường\b|quận\b|huyện\b|tỉnh\b|thành phố\b|tp\b|kđt\b|p\.\b|q\.\b|tổ\b|ấp\b|việt nam\b/i.test(nonEmptyText);
        const isShortLabel = nonEmptyText.length < 50;
        if (isTaxOrPhone || isCompany || isAddress || isShortLabel) {
          return true;
        }
      }
    }

    return false;
  };

  const computeTextDiff = (templateText, contractText) => {
    const lines1 = templateText.split("\n").map(l => l.trim()).filter(Boolean);
    const lines2 = contractText.split("\n").map(l => l.trim()).filter(Boolean);

    const n = lines1.length;
    const m = lines2.length;
    const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (lines1[i - 1] === lines2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    let i = n, j = m;
    const rawEdits = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
        rawEdits.unshift({ type: 'equal', line1: lines1[i - 1], line2: lines2[j - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        rawEdits.unshift({ type: 'insert', line: lines2[j - 1] });
        j--;
      } else {
        rawEdits.unshift({ type: 'delete', line: lines1[i - 1] });
        i--;
      }
    }

    const groupedEdits = [];
    for (let k = 0; k < rawEdits.length; k++) {
      const current = rawEdits[k];
      if (current.type === 'delete' && k + 1 < rawEdits.length && rawEdits[k + 1].type === 'insert') {
        groupedEdits.push({
          type: 'modify',
          line1: current.line,
          line2: rawEdits[k + 1].line
        });
        k++;
      } else {
        groupedEdits.push(current);
      }
    }

    const diffCards = [];
    const findClauseHeader = (textLine, idxInLines1) => {
      const maxIdx = Math.min(idxInLines1, lines1.length - 1);
      for (let k = maxIdx; k >= 0; k--) {
        const line = lines1[k];
        if (line && /^(ĐIỀU|PHỤ LỤC|CHƯƠNG|Căn cứ)/i.test(line)) {
          return line;
        }
      }
      return "Điều khoản chung";
    };

    let indexInLines1 = 0;
    groupedEdits.forEach((edit) => {
      if (edit.type === 'equal') {
        indexInLines1++;
        return;
      }

      let clause = "Điều khoản chung";
      let originalHtml = "";
      let modifiedHtml = "";
      let origText = "";
      let modText = "";

      if (edit.type === 'delete') {
        clause = findClauseHeader(edit.line, indexInLines1);
        originalHtml = `<span class="diff-del">${escapeHtml(edit.line)}</span>`;
        modifiedHtml = `<span style="color: var(--text-muted); font-style: italic;">[Không có điều khoản này trong đề xuất]</span>`;
        origText = edit.line;
        indexInLines1++;
      } else if (edit.type === 'insert') {
        clause = findClauseHeader(edit.line, indexInLines1);
        originalHtml = `<span style="color: var(--text-muted); font-style: italic;">[Không có điều khoản này trong mẫu chuẩn]</span>`;
        modifiedHtml = `<span class="diff-ins">${escapeHtml(edit.line)}</span>`;
        modText = edit.line;
      } else if (edit.type === 'modify') {
        clause = findClauseHeader(edit.line1, indexInLines1);
        
        const wordDiff = diffWords(edit.line1, edit.line2);
        originalHtml = wordDiff.originalHtml;
        modifiedHtml = wordDiff.modifiedHtml;
        origText = edit.line1;
        modText = edit.line2;

        indexInLines1++;
      }

      const isPlaceholder = isPlaceholderField(clause, origText, modText);

      diffCards.push({
        clause: clause.toUpperCase(),
        original: originalHtml,
        modified: modifiedHtml,
        originalRaw: origText,
        modifiedRaw: modText,
        isPlaceholder: isPlaceholder
      });
    });

    return diffCards;
  };

  const extractDynamicCorpInfo = (templateText, contractText, templateId) => {
    const isLease = templateId === "buu_cuc" || templateId === "ktc";
    const labelA = isLease ? "Bên Cho Thuê (Bên A)" : "Tên Khách Hàng (Bên A)";
    const labelRepA = isLease ? "Đại Diện Bên Cho Thuê" : "Người Đại Diện Bên A";
    const labelTaxA = isLease ? "MST / CCCD Bên Cho Thuê" : "Mã Số Thuế Bên A";
    const labelB = isLease ? "Đại Diện Bên Thuê (GHN - Bên B)" : "Người Đại Diện GHN (Bên B)";

    const parseContractWide = (text) => {
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      let contractNo = "Chưa xác định";
      let effectiveDate = "Chưa xác định";

      for (let i = 0; i < Math.min(lines.length, 30); i++) {
        const line = lines[i];
        
        // 1. Contract number
        if (/^Số:|^Số:/i.test(line)) {
          const numMatch = line.match(/^(?:Số|Số)[:\s]+([A-Za-z0-9/\\_-]+)/i);
          if (numMatch && numMatch[1].trim().length > 3) {
            contractNo = numMatch[1].trim();
          } else {
            // look ahead
            for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
              const nextLine = lines[k].trim();
              if (!nextLine || nextLine === ":" || nextLine === "::") continue;
              if (nextLine.includes("[]") || nextLine.includes("___")) break;
              contractNo = nextLine;
              break;
            }
          }
        }

        // 2. Effective date
        if (/được lập vào ngày|lập ngày|ngày hiệu lực/i.test(line)) {
          const dateMatch = line.match(/ngày\s+([0-9]+)\s+tháng\s+([0-9]+)\s+năm\s+([0-9]+)/i);
          if (dateMatch) {
            effectiveDate = `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`;
          }
        }
      }
      return { contractNo, effectiveDate };
    };

    const parseCorp = (text) => {
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      let companyName = "Chưa xác định";
      let rep = "Chưa xác định";
      let tax = "Chưa xác định";
      let address = "Chưa xác định";
      let phone = "Chưa xác định";
      let birthDate = "Chưa xác định";

      let isA = false;
      for (let i = 0; i < Math.min(lines.length, 60); i++) {
        const line = lines[i];
        const lineUpper = line.toUpperCase();

        if (lineUpper.includes("BÊN CHO THUÊ") || lineUpper.includes("BÊN SỬ DỤNG DỊCH VỤ") || lineUpper.includes("BÊN A") || lineUpper.includes("KHÁCH HÀNG")) {
          isA = true;
          continue;
        }
        if ((lineUpper.includes("BÊN THUÊ") && !lineUpper.includes("BÊN CHO THUÊ")) || lineUpper.includes("BÊN CUNG CẤP DỊCH VỤ") || lineUpper.includes("BÊN B") || lineUpper.includes("CÔNG TY CỔ PHẦN DỊCH VỤ GIAO HÀNG NHANH")) {
          isA = false;
          continue;
        }

        if (isA) {
          // Individual Lessor name parsing (look ahead)
          if (/^Ông\/Bà$/i.test(line) || /^Ông\s*Bà$/i.test(line) || /^Họ và tên$/i.test(line)) {
            for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
              const nextLine = lines[k].trim();
              if (!nextLine || nextLine === ":" || nextLine === "::") continue;
              if (nextLine.includes("[]") || nextLine.includes("___")) break;
              if (rep === "Chưa xác định") rep = nextLine;
              if (companyName === "Chưa xác định") companyName = nextLine;
              break;
            }
          }

          // Single-line individual lessor name match
          const singleLineMatch = line.match(/^(?:Ông\/Bà|Họ và tên)[:\s]+(?:Ông\b|Bà\b)?\s*([A-Za-zÀ-ỹ\s_.]+)/i);
          if (singleLineMatch && singleLineMatch[1].trim().length > 3) {
            const parsedName = singleLineMatch[1].trim();
            if (rep === "Chưa xác định") rep = parsedName;
            if (companyName === "Chưa xác định") companyName = parsedName;
          }

          // Individual CCCD/CMND parsing
          if (/CCCD|CMND/i.test(line)) {
            for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
              const nextLine = lines[k].trim();
              if (!nextLine || nextLine === ":" || nextLine === "::") continue;
              if (nextLine.includes("[]") || nextLine.includes("___")) break;
              const numMatch = nextLine.match(/^([0-9A-Za-z]+)/);
              if (numMatch) {
                if (tax === "Chưa xác định") tax = numMatch[1].trim();
              }
              break;
            }
          }

          // 1. Tax code parsing
          if (/Mã số thuế|MST/i.test(line)) {
            const taxMatch = line.match(/(?:Mã số thuế|MST)[:\s]+([0-9A-Za-z\-]+)/i);
            if (taxMatch && taxMatch[1].trim().length >= 8) {
              if (tax === "Chưa xác định") tax = taxMatch[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                if (/^[0-9A-Za-z\-]{8,15}$/.test(nextLine)) {
                  if (tax === "Chưa xác định") tax = nextLine;
                  break;
                }
                break; // stop on other text
              }
            }
          }

          // 2. Representative parsing
          if (/Đại diện|Người đại diện/i.test(line) && !lineUpper.includes("PHÁP LUẬT")) {
            const repMatch = line.match(/(?:Đại diện|Người đại diện)[:\s]+(?:Ông\b|Bà\b)?\s*([A-Za-zÀ-ỹ\s_.]+)/i);
            if (repMatch && repMatch[1].trim().length > 3) {
              if (rep === "Chưa xác định") rep = repMatch[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                const upperNext = nextLine.toUpperCase();
                if (upperNext.includes("CHỨC VỤ") || upperNext.includes("ĐỊA CHỈ") || upperNext.includes("MST") || upperNext.includes("MÃ SỐ THUẾ") || upperNext.includes("TÊN ĐƠN VỊ")) {
                  break;
                }
                if (/^[A-Za-zÀ-ỹ\s_.]+$/.test(nextLine) && nextLine.length > 3) {
                  if (rep === "Chưa xác định") rep = nextLine;
                  break;
                }
                break;
              }
            }
          }

          // 3. Company Name parsing
          if (/^(CÔNG TY TNHH|CÔNG TY CỔ PHẦN|CÔNG TY CP)\b/i.test(line)) {
            if (companyName === "Chưa xác định") companyName = line.split(/[,:\n]/)[0].trim();
          } else if (/Tên đơn vị|Tên công ty/i.test(line)) {
            const parts = line.split(/[:：]/);
            if (parts[1] && parts[1].trim().length > 3) {
              if (companyName === "Chưa xác định") companyName = parts[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                const upperNext = nextLine.toUpperCase();
                if (upperNext.includes("ĐỊA CHỈ") || upperNext.includes("MST") || upperNext.includes("MÃ SỐ THUẾ") || upperNext.includes("ĐẠI DIỆN")) {
                  break;
                }
                if (nextLine.length > 3) {
                  if (companyName === "Chưa xác định") companyName = nextLine;
                  break;
                }
                break;
              }
            }
          }

          // 4. Address parsing
          if (/Địa chỉ|Cư trú tại/i.test(line)) {
            const addrMatch = line.match(/(?:Địa chỉ|Cư trú tại địa chỉ)[:\s]+([A-Za-z0-9À-ỹ\s,./_#-]+)/i);
            if (addrMatch && addrMatch[1].trim().length > 5) {
              if (address === "Chưa xác định") address = addrMatch[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                if (nextLine.includes("[]") || nextLine.includes("___")) break;
                if (address === "Chưa xác định") address = nextLine;
                break;
              }
            }
          }

          // 5. Phone parsing
          if (/Điện thoại|Số điện thoại/i.test(line)) {
            const phoneMatch = line.match(/(?:Điện thoại|Số điện thoại)[:\s]+([0-9. -]+)/i);
            if (phoneMatch && phoneMatch[1].trim().length >= 8) {
              if (phone === "Chưa xác định") phone = phoneMatch[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                if (nextLine.includes("[]") || nextLine.includes("___")) break;
                const matchNum = nextLine.match(/^([0-9. -]{8,20})/);
                if (matchNum) {
                  if (phone === "Chưa xác định") phone = matchNum[1].trim();
                } else if (/^[0-9. -]+$/.test(nextLine)) {
                  if (phone === "Chưa xác định") phone = nextLine;
                }
                break;
              }
            }
          }

          // 6. Birth date parsing
          if (/Sinh ngày/i.test(line)) {
            const birthMatch = line.match(/Sinh ngày[:\s]+([0-9/.-]+)/i);
            if (birthMatch && birthMatch[1].trim().length >= 8) {
              if (birthDate === "Chưa xác định") birthDate = birthMatch[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                if (nextLine.includes("[]") || nextLine.includes("___")) break;
                if (birthDate === "Chưa xác định") birthDate = nextLine;
                break;
              }
            }
          }
        }
      }
      return { companyName, rep, tax, address, phone, birthDate };
    };

    const parseGHNInfo = (text) => {
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      let rep = "Chưa xác định";
      let address = "Chưa xác định";
      let isB = false;
      for (let i = 0; i < Math.min(lines.length, 60); i++) {
        const line = lines[i];
        const lineUpper = line.toUpperCase();
        if ((lineUpper.includes("BÊN THUÊ") && !lineUpper.includes("BÊN CHO THUÊ")) || lineUpper.includes("BÊN CUNG CẤP DỊCH VỤ") || lineUpper.includes("BÊN B") || lineUpper.includes("CÔNG TY CỔ PHẦN DỊCH VỤ GIAO HÀNG NHANH")) {
          isB = true;
          continue;
        }
        if (lineUpper.includes("BÊN CHO THUÊ") || lineUpper.includes("BÊN SỬ DỤNG DỊCH VỤ") || lineUpper.includes("BÊN A") || lineUpper.includes("KHÁCH HÀNG")) {
          isB = false;
          continue;
        }
        if (isB) {
          if (rep !== "Chưa xác định" && address !== "Chưa xác định") {
            break;
          }
          // Representative
          if (/Đại diện|Người đại diện/i.test(line) && !lineUpper.includes("PHÁP LUẬT")) {
            const repMatch = line.match(/(?:Đại diện|Người đại diện)[:\s]+(?:Ông\b|Bà\b)?\s*([A-Za-zÀ-ỹ\s_.]+)/i);
            if (repMatch && repMatch[1].trim().length > 3) {
              rep = repMatch[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                const upperNext = nextLine.toUpperCase();
                if (upperNext.includes("CHỨC VỤ") || upperNext.includes("ĐỊA CHỈ") || upperNext.includes("MST") || upperNext.includes("MÃ SỐ THUẾ") || upperNext.includes("TÊN ĐƠN VỊ")) {
                  break;
                }
                if (/^[A-Za-zÀ-ỹ\s_.]+$/.test(nextLine) && nextLine.length > 3) {
                  rep = nextLine;
                  break;
                }
                break;
              }
            }
          }

          // Address
          if (/Địa chỉ/i.test(line)) {
            const addrMatch = line.match(/Địa chỉ[:\s]+([A-Za-z0-9À-ỹ\s,./_#-]+)/i);
            if (addrMatch && addrMatch[1].trim().length > 5) {
              address = addrMatch[1].trim();
            } else {
              // look ahead
              for (let k = i + 1; k < Math.min(lines.length, i + 5); k++) {
                const nextLine = lines[k].trim();
                if (!nextLine || nextLine === ":" || nextLine === "::") continue;
                if (nextLine.includes("[]") || nextLine.includes("___")) break;
                address = nextLine;
                break;
              }
            }
          }
        }
      }
      return { rep, address };
    };

    const templateWide = parseContractWide(templateText);
    const contractWide = parseContractWide(contractText);

    const templateInfo = parseCorp(templateText);
    const contractInfo = parseCorp(contractText);

    const templateGhn = parseGHNInfo(templateText);
    const contractGhn = parseGHNInfo(contractText);

    const normalizeName = (name) => {
      return name
        .replace(/^(Ông|Bà|Mr|Mrs|Ms)\b/i, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    };

    const checkMatch = (val1, val2) => {
      if (val1 === "Chưa xác định" || val2 === "Chưa xác định") return false;
      return normalizeName(val1) === normalizeName(val2);
    };

    return [
      {
        field: "Số Hợp Đồng",
        original: templateWide.contractNo,
        incoming: contractWide.contractNo,
        match: checkMatch(templateWide.contractNo, contractWide.contractNo),
        detail: checkMatch(templateWide.contractNo, contractWide.contractNo)
          ? "Số hợp đồng khớp với mẫu chuẩn."
          : `Số hợp đồng lệch: Bản chuẩn là "${templateWide.contractNo}", bản đề xuất là "${contractWide.contractNo}".`
      },
      {
        field: "Ngày Lập / Hiệu Lực",
        original: templateWide.effectiveDate,
        incoming: contractWide.effectiveDate,
        match: checkMatch(templateWide.effectiveDate, contractWide.effectiveDate),
        detail: checkMatch(templateWide.effectiveDate, contractWide.effectiveDate)
          ? "Ngày lập khớp với mẫu chuẩn."
          : `Ngày lập lệch: Bản chuẩn là "${templateWide.effectiveDate}", bản đề xuất là "${contractWide.effectiveDate}".`
      },
      {
        field: labelA,
        original: templateInfo.companyName,
        incoming: contractInfo.companyName,
        match: checkMatch(templateInfo.companyName, contractInfo.companyName),
        detail: checkMatch(templateInfo.companyName, contractInfo.companyName) 
          ? "Thông tin pháp nhân khớp với mẫu chuẩn." 
          : `Tên pháp nhân lệch: Bản chuẩn là "${templateInfo.companyName}", bản đề xuất là "${contractInfo.companyName}".`
      },
      {
        field: labelRepA,
        original: templateInfo.rep,
        incoming: contractInfo.rep,
        match: checkMatch(templateInfo.rep, contractInfo.rep),
        detail: checkMatch(templateInfo.rep, contractInfo.rep)
          ? "Người đại diện khớp với mẫu chuẩn."
          : `Người đại diện lệch: Bản chuẩn là "${templateInfo.rep}", bản đề xuất là "${contractInfo.rep}".`
      },
      {
        field: labelTaxA,
        original: templateInfo.tax,
        incoming: contractInfo.tax,
        match: checkMatch(templateInfo.tax, contractInfo.tax),
        detail: checkMatch(templateInfo.tax, contractInfo.tax)
          ? "Mã số thuế khớp với mẫu chuẩn."
          : `Mã số thuế lệch: Bản chuẩn là "${templateInfo.tax}", bản đề xuất là "${contractInfo.tax}".`
      },
      {
        field: isLease ? "Địa Chỉ Bên Cho Thuê" : "Địa Chỉ Khách Hàng (Bên A)",
        original: templateInfo.address,
        incoming: contractInfo.address,
        match: checkMatch(templateInfo.address, contractInfo.address),
        detail: checkMatch(templateInfo.address, contractInfo.address)
          ? "Địa chỉ Bên A khớp với mẫu chuẩn."
          : `Địa chỉ Bên A lệch: Bản chuẩn là "${templateInfo.address}", bản đề xuất là "${contractInfo.address}".`
      },
      ...(isLease ? [
        {
          field: "Ngày Sinh Bên Cho Thuê",
          original: templateInfo.birthDate,
          incoming: contractInfo.birthDate,
          match: checkMatch(templateInfo.birthDate, contractInfo.birthDate),
          detail: checkMatch(templateInfo.birthDate, contractInfo.birthDate)
            ? "Ngày sinh Bên Cho Thuê khớp."
            : `Ngày sinh Bên Cho Thuê lệch: Bản chuẩn là "${templateInfo.birthDate}", bản đề xuất là "${contractInfo.birthDate}".`
        },
        {
          field: "Số Điện Thoại Bên Cho Thuê",
          original: templateInfo.phone,
          incoming: contractInfo.phone,
          match: checkMatch(templateInfo.phone, contractInfo.phone),
          detail: checkMatch(templateInfo.phone, contractInfo.phone)
            ? "Số điện thoại Bên Cho Thuê khớp."
            : `Số điện thoại Bên Cho Thuê lệch: Bản chuẩn là "${templateInfo.phone}", bản đề xuất là "${contractInfo.phone}".`
        }
      ] : [
        {
          field: "Số Điện Thoại Khách Hàng",
          original: templateInfo.phone,
          incoming: contractInfo.phone,
          match: checkMatch(templateInfo.phone, contractInfo.phone),
          detail: checkMatch(templateInfo.phone, contractInfo.phone)
            ? "Số điện thoại Khách Hàng khớp."
            : `Số điện thoại Khách Hàng lệch: Bản chuẩn là "${templateInfo.phone}", bản đề xuất là "${contractInfo.phone}".`
        }
      ]),
      {
        field: labelB,
        original: templateGhn.rep,
        incoming: contractGhn.rep,
        match: checkMatch(templateGhn.rep, contractGhn.rep),
        detail: checkMatch(templateGhn.rep, contractGhn.rep)
          ? "Đại diện ký kết phía GHN khớp với mẫu chuẩn."
          : `Người đại diện GHN lệch: Bản chuẩn đăng ký là "${templateGhn.rep}", bản ký kết đề xuất là "${contractGhn.rep}".`
      },
      {
        field: "Địa Chỉ GHN (Bên B)",
        original: templateGhn.address,
        incoming: contractGhn.address,
        match: checkMatch(templateGhn.address, contractGhn.address),
        detail: checkMatch(templateGhn.address, contractGhn.address)
          ? "Địa chỉ GHN khớp với mẫu chuẩn."
          : `Địa chỉ GHN lệch: Bản chuẩn là "${templateGhn.address}", bản đề xuất là "${contractGhn.address}".`
      }
    ];
  };

  const loadLocalScript = (src) => {
    return new Promise((resolve, reject) => {
      const cleanSrc = src.split("?")[0];
      const oldScript = document.querySelector(`script[data-src="${cleanSrc}"]`);
      if (oldScript) oldScript.remove();
      
      const script = document.createElement("script");
      // Under file:// protocol, query parameters can cause file resolution errors on local filesystems.
      if (window.location.protocol === "file:") {
        script.src = cleanSrc;
      } else {
        script.src = `${cleanSrc}?t=${Date.now()}`;
      }
      script.setAttribute("data-src", cleanSrc);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Không thể tải tệp tin ${cleanSrc}. Đảm bảo bạn đã chạy file trích xuất extract_text.py.`));
      document.head.appendChild(script);
    });
  };

  const performVerbatimCompare = async (contract, statusBadge) => {
    try {
      const templateId = contract.selectedTemplate;
      
      let contractText = "";
      if (contract.inMemoryText) {
        contractText = contract.inMemoryText;
        // Only load standard template script since target is already in memory
        await loadLocalScript(`./temp/${templateId}.js`);
      } else {
        const baseName = contract.fileName.substring(0, contract.fileName.lastIndexOf('.')) || contract.fileName;
        const contractJsPath = `./temp/${baseName}.js`;

        await Promise.all([
          loadLocalScript(contractJsPath),
          loadLocalScript(`./temp/${templateId}.js`)
        ]);
        contractText = window.CONTRACT_TEXT;
      }

      const templateText = window[`TEMPLATE_TEXT_${templateId}`];

      if (contractText === undefined || templateText === undefined) {
        throw new Error("Không thể tải dữ liệu từ tệp tin script.");
      }

      const corpInfo = extractDynamicCorpInfo(templateText, contractText, templateId);
      const diffResults = computeTextDiff(templateText, contractText);

      if (statusBadge) {
        statusBadge.textContent = TEMPLATE_MAP[templateId] || "Hợp đồng mẫu";
        statusBadge.className = "badge";
        statusBadge.style.background = "rgba(22, 163, 74, 0.05)";
        statusBadge.style.color = "var(--success)";
        statusBadge.style.borderColor = "rgba(22, 163, 74, 0.15)";
      }

      const corpInfoTbody = document.getElementById("corp-info-tbody");
      if (corpInfoTbody) {
        corpInfoTbody.innerHTML = "";
        corpInfo.forEach(info => {
          const isFilled = info.incoming && info.incoming !== "Chưa xác định" && info.incoming.trim() !== "";
          const statusBadge = isFilled
            ? `<span class="corp-match-badge success">✓ Đã bổ sung</span>`
            : `<span class="corp-match-badge danger">⚠ Chưa bổ sung</span>`;
          
          corpInfoTbody.innerHTML += `
            <tr>
              <td><strong>${info.field}</strong></td>
              <td>${info.original}</td>
              <td style="${isFilled ? 'color: var(--success);' : 'color: var(--danger); font-weight: 600;'}">${info.incoming}</td>
              <td>${statusBadge}</td>
            </tr>
          `;
        });
      }

      const realDeviations = diffResults.filter(d => !d.isPlaceholder);
      const placeholderFills = diffResults.filter(d => d.isPlaceholder);

      // Filter out preamble and signature clauses from placeholder cards entirely
      const otherPlaceholders = placeholderFills.filter(item => 
        !item.clause.includes("ĐIỀU KHOẢN CHUNG") && !item.clause.includes("ĐIỀU KHOẢN THI HÀNH") && !item.clause.startsWith("CĂN CỨ")
      );

      const qtyTotalChangesEl = document.getElementById("qty-total-changes");
      if (qtyTotalChangesEl) {
        qtyTotalChangesEl.textContent = realDeviations.length;
      }

      const diffContainer = document.getElementById("diff-list-container");
      if (diffContainer) {
        diffContainer.innerHTML = "";
        if (realDeviations.length === 0) {
          diffContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted); font-size: 0.9rem;">
              🎉 Tuyệt vời! Không phát hiện sai lệch nào giữa hợp đồng cần screen và hợp đồng template chuẩn.
            </div>
          `;
        } else {
          realDeviations.forEach(diff => {
            diffContainer.innerHTML += `
              <div class="diff-card">
                <div class="diff-card-header">${diff.clause}</div>
                <div class="diff-split-columns">
                  <div class="diff-col">
                    <span class="diff-col-lbl">Mẫu chuẩn công ty</span>
                    <div class="diff-text">${diff.original}</div>
                  </div>
                  <div class="diff-col">
                    <span class="diff-col-lbl">Hợp đồng đối tác đề xuất</span>
                    <div class="diff-text">${diff.modified}</div>
                  </div>
                </div>
              </div>
            `;
          });
        }
      }

      // Render other filled placeholders in Section 4 (Additional Info)
      const placeholdersContainer = document.getElementById("placeholders-list-container");
      if (placeholdersContainer) {
        placeholdersContainer.innerHTML = "";
        if (otherPlaceholders.length === 0) {
          placeholdersContainer.innerHTML = `
            <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.8rem; background: rgba(255,255,255,0.01); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.08);">
              Không phát hiện thông tin bổ sung nào khác.
            </div>
          `;
        } else {
          otherPlaceholders.forEach(item => {
            placeholdersContainer.innerHTML += `
              <div class="placeholder-fill-card">
                <div class="placeholder-fill-header">
                  <span>${item.clause}</span>
                  <span class="placeholder-fill-badge">✓ Đã bổ sung</span>
                </div>
                <div class="placeholder-fill-body">
                  <div class="placeholder-val-row">
                    <span class="lbl">Mẫu chuẩn:</span>
                    <span class="val template">${item.original}</span>
                  </div>
                  <div class="placeholder-val-row">
                    <span class="lbl">Đã điền:</span>
                    <span class="val filled">${item.modified}</span>
                  </div>
                </div>
              </div>
            `;
          });
        }
      }
    } catch (err) {
      console.error(err);
      const diffContainer = document.getElementById("diff-list-container");
      if (diffContainer) {
        diffContainer.innerHTML = `
          <div style="color: var(--danger); padding: 1.5rem; border: 1px dashed var(--danger); border-radius: 8px; font-size: 0.85rem; text-align: center;">
            ⚠️ Lỗi khi tải tệp văn bản đối chiếu: ${err.message}. Đảm bảo các tệp tin txt của template và hợp đồng đã được trích xuất trong thư mục temp/.
          </div>
        `;
      }
    }
  };

  // Initialize and update stats counters
  const updateStats = () => {
    totalCntEl.textContent = CONTRACTS_DB.length;
    
    const countA = CONTRACTS_DB.filter(c => c.group === "a").length;
    const countB = CONTRACTS_DB.filter(c => c.group === "b" && c.selectedTemplate !== null).length;
    
    aCntEl.textContent = countA;
    bCntEl.textContent = countB;
  };

  // Render Left Panel Contracts List
  const renderContractsList = () => {
    contractsListContainer.innerHTML = "";

    const filtered = CONTRACTS_DB.filter(c => {
      if (activeFilter === "group_a") return c.group === "a";
      if (activeFilter === "group_b") return c.group === "b";
      return true; // "all"
    });

    if (filtered.length === 0) {
      contractsListContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.8rem;">
          Không có hợp đồng nào trong bộ lọc này.
        </div>
      `;
      return;
    }

    filtered.forEach(contract => {
      const card = document.createElement("div");
      card.className = `contract-card ${contract.id === activeContractId ? 'active' : ''}`;
      card.setAttribute("data-id", contract.id);

      const groupBadge = contract.group === "a" 
        ? `<span class="badge badge-danger">Legal Review</span>` 
        : `<span class="badge badge-success">Đối soát</span>`;

      card.innerHTML = `
        <div class="card-header-row">
          <span class="contract-name" title="${contract.fileName}">${contract.fileName}</span>
          ${groupBadge}
        </div>
        <div class="card-meta">
          <span>${contract.fileSize}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        selectContract(contract.id);
      });

      contractsListContainer.appendChild(card);
    });
  };

  // Select a contract and render details in the right work panel
  const selectContract = (id) => {
    activeContractId = id;
    
    // Update active state in list UI
    document.querySelectorAll(".contract-card").forEach(card => {
      if (card.getAttribute("data-id") === id) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    const contract = CONTRACTS_DB.find(c => c.id === id);
    if (!contract) {
      showEmptyState();
      return;
    }

    // Hide empty state
    workEmptyState.style.display = "none";

    if (contract.group === "a") {
      // Show Panel A details
      panelGroupB.style.display = "none";
      panelGroupA.style.display = "flex";

      document.getElementById("review-title-a").textContent = contract.fileName;
      document.getElementById("review-reason-a").textContent = contract.reason;

      // Render timeline
      const timelineEl = document.getElementById("review-timeline-a");
      timelineEl.innerHTML = "";
      
      // Step 1: Received
      timelineEl.innerHTML += `
        <div class="timeline-item success">
          <div class="timeline-title">Đã tiếp nhận từ Chrome Extension</div>
          <div class="timeline-desc">Tải thành công tệp đính kèm lúc ${contract.receivedDate}.</div>
        </div>
      `;

      // Step 2: AI scanned
      timelineEl.innerHTML += `
        <div class="timeline-item success">
          <div class="timeline-title">Phân loại tự động hoàn tất (AI Classified)</div>
          <div class="timeline-desc">Phát hiện tệp tin thuộc mẫu soạn thảo đặc thù của đối tác. Đã chuyển sang luồng rà soát thủ công.</div>
        </div>
      `;

      // Step 3: Notifications
      contract.notifications.forEach(notif => {
        timelineEl.innerHTML += `
          <div class="timeline-item success">
            <div class="timeline-title">Đã phát thông báo qua ${notif.channel}</div>
            <div class="timeline-desc">Gửi tới: ${notif.recipient} | Trạng thái: ${notif.status}</div>
          </div>
        `;
      });

    } else if (contract.group === "b") {
      // Show Panel B details (Compare)
      panelGroupA.style.display = "none";
      panelGroupB.style.display = "flex";

      document.getElementById("review-title-b").textContent = contract.fileName;

      // Update Template Selector values
      const selectTemplateType = document.getElementById("select-template-type");
      const templateStatusBadge = document.getElementById("template-status-badge");
      
      if (selectTemplateType) {
        selectTemplateType.value = contract.selectedTemplate || "";
      }

      const placeholderEl = document.getElementById("compare-placeholder");
      const corpSection = document.getElementById("compare-corp-section");
      const qtySection = document.getElementById("compare-qty-section");
      const diffSection = document.getElementById("compare-diff-section");

      const compareSideNav = document.querySelector(".compare-side-nav");
      if (!contract.selectedTemplate) {
        // Show placeholder, hide content sections
        if (placeholderEl) placeholderEl.style.display = "flex";
        if (corpSection) corpSection.style.display = "none";
        if (qtySection) qtySection.style.display = "none";
        if (diffSection) diffSection.style.display = "none";
        if (compareSideNav) compareSideNav.style.display = "none";

        if (templateStatusBadge) {
          templateStatusBadge.textContent = "Chưa Chọn Mẫu";
          templateStatusBadge.className = "badge";
          templateStatusBadge.style.background = "rgba(220, 38, 38, 0.05)";
          templateStatusBadge.style.color = "var(--danger)";
          templateStatusBadge.style.borderColor = "rgba(220, 38, 38, 0.15)";
        }
      } else {
        // Hide placeholder, show content sections
        if (placeholderEl) placeholderEl.style.display = "none";
        if (corpSection) corpSection.style.display = "block";
        if (qtySection) qtySection.style.display = "block";
        if (diffSection) diffSection.style.display = "block";
        if (compareSideNav) compareSideNav.style.display = "flex";

        performVerbatimCompare(contract, templateStatusBadge);
      }
    }
  };

  const showEmptyState = () => {
    workEmptyState.style.display = "flex";
    panelGroupA.style.display = "none";
    panelGroupB.style.display = "none";
  };

  // Main Dashboard Setup
  const initDashboard = () => {
    updateStats();
    renderContractsList();
    if (activeContractId) {
      selectContract(activeContractId);
    } else {
      showEmptyState();
    }
  };

  // ==========================================================================
  // EVENT LISTENERS & INTEGRATION
  // ==========================================================================

  // Sidebar Filter items
  filterItems.forEach(item => {
    item.addEventListener("click", () => {
      // Remove active class
      filterItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      
      activeFilter = item.getAttribute("data-filter");
      renderContractsList();
    });
  });

  // Template Selector Dropdown Change Listener
  const selectTemplateType = document.getElementById("select-template-type");
  if (selectTemplateType) {
    selectTemplateType.addEventListener("change", (e) => {
      const selectedValue = e.target.value;
      if (!activeContractId) return;

      const contract = CONTRACTS_DB.find(c => c.id === activeContractId);
      if (!contract || contract.group !== "b") return;

      if (selectedValue) {
        contract.selectedTemplate = selectedValue;
        contract.status = "Đã đối soát";
        contract.templateName = TEMPLATE_MAP[selectedValue] || "Hợp đồng mẫu";
      } else {
        contract.selectedTemplate = null;
        contract.status = "Chờ đối soát";
        contract.templateName = "Chưa xác định";
      }

      // Update stats and list
      updateStats();
      renderContractsList();

      // Re-select and re-render contract details
      selectContract(contract.id);
    });
  }

  // Listen for pushed contracts from Chrome Extension
  window.addEventListener("message", (event) => {
    if (event.data && event.data.action === "push_contract_from_extension") {
      const newContract = event.data.payload;
      
      // Avoid duplicate filenames
      if (!CONTRACTS_DB.some(c => c.fileName === newContract.fileName)) {
        // Prepare new contract entry
        const contractEntry = {
          id: newContract.id || "contract_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          fileName: newContract.fileName,
          receivedDate: newContract.receivedDate || new Date().toLocaleDateString("vi-VN"),
          sender: newContract.sender || "Extension User",
          fileSize: newContract.fileSize || "1.5 MB",
          group: "b", // default to group b
          status: "Chờ đối soát",
          templateName: "Chưa xác định",
          selectedTemplate: null
        };
        
        CONTRACTS_DB.unshift(contractEntry);
        saveToLocalStorage();
        
        // Update stats and list
        updateStats();
        renderContractsList();
        
        // Auto select the new contract
        selectContract(contractEntry.id);
      }
    }
  });

  // Set up compare sidebar navigation (scrollspy & smooth scrolling)
  const setupCompareSideNav = () => {
    const scrollContainer = document.getElementById("compare-scroll-body");
    const navItems = document.querySelectorAll(".compare-side-nav .nav-item");

    if (!scrollContainer) return;

    // 1. Click to scroll
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = item.getAttribute("data-target");
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Calculate offset relative to the scrollContainer
          const topOffset = targetElement.offsetTop - scrollContainer.offsetTop;
          scrollContainer.scrollTo({
            top: topOffset - 15, // 15px margin
            behavior: "smooth"
          });
        }
      });
    });

    // 2. Scrollspy to highlight active section
    const sections = [
      document.getElementById("compare-corp-section"),
      document.getElementById("compare-qty-section"),
      document.getElementById("compare-diff-section"),
      document.getElementById("compare-placeholders-section")
    ];

    scrollContainer.addEventListener("scroll", () => {
      let activeId = null;
      const scrollTop = scrollContainer.scrollTop;

      sections.forEach(section => {
        if (section && section.style.display !== "none") {
          const sectionTop = section.offsetTop - scrollContainer.offsetTop;
          // Set section active if it scrolled into view (with some threshold)
          if (scrollTop >= sectionTop - 120) {
            activeId = section.id;
          }
        }
      });

      if (activeId) {
        navItems.forEach(item => {
          if (item.getAttribute("data-target") === activeId) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      }
    });
  };

  // Set up Word File Upload (.docx) Change Listener
  const docxUploadInput = document.getElementById("docx-upload-input");
  if (docxUploadInput) {
    docxUploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Check if mammoth library is loaded
      if (typeof mammoth === "undefined") {
        alert("Lỗi: Thư viện mammoth.js chưa được tải thành công. Vui lòng kiểm tra kết nối mạng!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
          .then((result) => {
            const extractedText = result.value;
            if (!extractedText || extractedText.trim() === "") {
              alert("Không thể đọc được nội dung chữ từ tệp Word này. Đảm bảo đây không phải tệp rỗng.");
              return;
            }

            const newId = "upload_" + Date.now();
            const newContract = {
              id: newId,
              fileName: file.name,
              receivedDate: new Date().toLocaleDateString("vi-VN") + " (Tải lên)",
              sender: "Người dùng (Upload)",
              fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
              group: "b",
              status: "Chờ đối soát",
              selectedTemplate: null,
              inMemoryText: extractedText
            };

            CONTRACTS_DB.unshift(newContract);
            saveToLocalStorage();
            
            // Clear file input value to allow uploading same file again
            docxUploadInput.value = "";

            updateStats();
            renderContractsList();
            selectContract(newId);
            
            alert(`Tải file "${file.name}" thành công! Vui lòng chọn mẫu hợp đồng chuẩn để đối soát.`);
          })
          .catch((err) => {
            console.error("Mammoth error:", err);
            alert("Có lỗi xảy ra khi đọc tệp tin Word: " + err.message);
          });
      };
      reader.onerror = (err) => {
        alert("Không thể đọc tệp tin: " + err.message);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Start
  setupCompareSideNav();
  initDashboard();
});
