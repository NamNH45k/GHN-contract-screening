document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let currentRole = "product_owner";
  let currentView = "explore"; // 'explore' | 'compare'
  let searchQuery = "";
  let checkedSkills = {};

  // Load checked skills from localStorage
  const loadCheckedSkills = () => {
    const saved = localStorage.getItem("skill_matrix_checked");
    if (saved) {
      try {
        checkedSkills = JSON.parse(saved);
      } catch (e) {
        checkedSkills = {};
      }
    }
  };

  // Save checked skills to localStorage
  const saveCheckedSkills = () => {
    localStorage.setItem("skill_matrix_checked", JSON.stringify(checkedSkills));
  };

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================
  const roleNavItems = document.querySelectorAll(".role-nav-item");
  const compareBtn = document.getElementById("nav-compare-btn");
  const roleNameEl = document.getElementById("role-name");
  const roleIconEl = document.getElementById("role-icon");
  const roleDescEl = document.getElementById("role-desc");
  const searchInput = document.getElementById("search-input");
  
  // Tab Mode Buttons
  const tabExplore = document.getElementById("tab-explore");
  const tabChecklist = document.getElementById("tab-checklist");
  
  // Dashboard content areas
  const metricsBoard = document.getElementById("metrics-board");
  const skillsContainer = document.getElementById("skills-container");

  // Dynamic Ambient Theme Background Blobs color mapping
  const roleColors = {
    product_owner: {
      primary: "var(--color-po)",
      accent: "rgba(255, 121, 198, 0.2)"
    },
    frontend_developer: {
      primary: "var(--color-fe)",
      accent: "rgba(139, 233, 253, 0.2)"
    },
    backend_developer: {
      primary: "var(--color-be)",
      accent: "rgba(80, 250, 123, 0.2)"
    },
    uiux_designer: {
      primary: "var(--color-uiux)",
      accent: "rgba(189, 147, 249, 0.2)"
    },
    tester: {
      primary: "var(--color-tester)",
      accent: "rgba(241, 250, 140, 0.2)"
    }
  };

  // ==========================================================================
  // VIEW RENDERERS
  // ==========================================================================

  // Update overall metrics (cards & circular gauge)
  const updateMetrics = () => {
    if (currentView === "compare") {
      metricsBoard.style.display = "none";
      return;
    }
    metricsBoard.style.display = "grid";

    const roleData = SKILLS_DATA[currentRole];
    const hardSkills = roleData.categories.hard_skills || [];
    const softSkills = roleData.categories.soft_skills || [];
    const totalSkillsList = [...hardSkills, ...softSkills];
    const totalSkills = totalSkillsList.length;

    // Count checked
    let checkedCount = 0;
    totalSkillsList.forEach(s => {
      if (checkedSkills[s.id]) {
        checkedCount++;
      }
    });

    const completionPercent = totalSkills > 0 ? Math.round((checkedCount / totalSkills) * 100) : 0;
    
    // Determine level estimation
    let levelRecommendation = "Đang tích lũy";
    let levelColor = "var(--text-muted)";
    if (completionPercent === 0) {
      levelRecommendation = "Chưa đánh giá";
    } else if (completionPercent <= 35) {
      levelRecommendation = "Junior (Cơ bản)";
      levelColor = "#ffb86c"; // Orange
    } else if (completionPercent <= 75) {
      levelRecommendation = "Mid-level (Thành thạo)";
      levelColor = "#8be9fd"; // Cyan
    } else {
      levelRecommendation = "Senior (Chuyên gia)";
      levelColor = "#bd93f9"; // Purple
    }

    // List of tools used across these skills
    const toolsSet = new Set();
    totalSkillsList.forEach(s => {
      if (s.tools) s.tools.forEach(t => toolsSet.add(t));
    });

    metricsBoard.innerHTML = `
      <!-- Metric 1: Total Skills -->
      <div class="metric-card">
        <div class="metric-info">
          <h4>Tổng số kỹ năng</h4>
          <div class="metric-val">${totalSkills}</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
            ${hardSkills.length} Chuyên môn | ${softSkills.length} Mềm
          </p>
        </div>
        <div style="font-size: 2.25rem; opacity: 0.8;">📚</div>
      </div>

      <!-- Metric 2: Tools Count -->
      <div class="metric-card">
        <div class="metric-info">
          <h4>Công cụ & Công nghệ</h4>
          <div class="metric-val">${toolsSet.size}</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 150px;">
            ${Array.from(toolsSet).slice(0, 3).join(", ")}...
          </p>
        </div>
        <div style="font-size: 2.25rem; opacity: 0.8;">🛠️</div>
      </div>

      <!-- Metric 3: Level Assessment -->
      <div class="metric-card">
        <div class="metric-info">
          <h4>Cấp độ ước lượng</h4>
          <div class="metric-val" style="color: ${levelColor}; font-size: 1.25rem; margin-top: 0.5rem; font-weight: 700;">
            ${levelRecommendation}
          </div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Dựa trên số kỹ năng đã đạt
          </p>
        </div>
        <div style="font-size: 2.25rem; opacity: 0.8;">🏆</div>
      </div>

      <!-- Metric 4: Progress Gauge -->
      <div class="metric-card">
        <div class="metric-info">
          <h4>Độ phù hợp vai trò</h4>
          <div class="metric-val" style="font-size: 1.8rem;">${completionPercent}%</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Đã đạt ${checkedCount} / ${totalSkills}
          </p>
        </div>
        <div class="metric-gauge">
          <svg class="gauge-svg">
            <circle class="gauge-track" cx="32" cy="32" r="28"></circle>
            <circle class="gauge-progress" cx="32" cy="32" r="28" 
                    style="stroke: ${roleColors[currentRole].primary}; stroke-dashoffset: ${175.9 - (175.9 * completionPercent) / 100}"></circle>
          </svg>
          <div class="gauge-text" style="color: ${roleColors[currentRole].primary}">${checkedCount}</div>
        </div>
      </div>
    `;
  };

  // Render Skill Cards Grid
  const renderSkills = () => {
    if (currentView === "compare") return;

    const roleData = SKILLS_DATA[currentRole];
    const categories = roleData.categories;
    let htmlContent = "";

    // Iterate through Hard Skills and Soft Skills categories
    const categoryKeys = [
      { key: "hard_skills", title: "Kỹ năng chuyên môn (Hard Skills)" },
      { key: "soft_skills", title: "Kỹ năng mềm & Tư duy (Soft Skills)" }
    ];

    let matchCount = 0;

    categoryKeys.forEach(cat => {
      const skills = categories[cat.key] || [];
      
      // Filter skills based on search query
      const filteredSkills = skills.filter(skill => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          skill.name.toLowerCase().includes(q) ||
          skill.desc.toLowerCase().includes(q) ||
          (skill.tools && skill.tools.some(t => t.toLowerCase().includes(q))) ||
          (skill.levels.junior && skill.levels.junior.toLowerCase().includes(q)) ||
          (skill.levels.mid && skill.levels.mid.toLowerCase().includes(q)) ||
          (skill.levels.senior && skill.levels.senior.toLowerCase().includes(q))
        );
      });

      if (filteredSkills.length > 0) {
        matchCount += filteredSkills.length;
        htmlContent += `
          <div class="skill-category-section">
            <h3 class="category-title" style="--accent: ${roleColors[currentRole].primary}">
              ${cat.title}
            </h3>
            <div class="skills-grid">
              ${filteredSkills.map(skill => {
                const isChecked = !!checkedSkills[skill.id];
                return `
                  <div class="skill-card ${isChecked ? 'checked' : ''}" data-id="${skill.id}" style="--accent: ${roleColors[currentRole].primary}">
                    <div class="skill-card-header">
                      <h4 class="skill-name">${skill.name}</h4>
                      <div class="skill-checkbox-wrapper">
                        <input type="checkbox" class="skill-checkbox" id="chk-${skill.id}" 
                               data-id="${skill.id}" ${isChecked ? 'checked' : ''} 
                               style="--accent: ${roleColors[currentRole].primary}">
                      </div>
                    </div>
                    
                    <p class="skill-desc">${skill.desc}</p>
                    
                    <div class="skill-levels">
                      <!-- Junior -->
                      <div class="level-row junior">
                        <div class="level-badge-container">
                          <span class="level-dot"></span>
                          <span class="level-badge">Junior</span>
                        </div>
                        <div class="level-text">${skill.levels.junior}</div>
                      </div>
                      
                      <!-- Mid -->
                      <div class="level-row mid">
                        <div class="level-badge-container">
                          <span class="level-dot"></span>
                          <span class="level-badge">Mid-Level</span>
                        </div>
                        <div class="level-text">${skill.levels.mid}</div>
                      </div>
                      
                      <!-- Senior -->
                      <div class="level-row senior">
                        <div class="level-badge-container">
                          <span class="level-dot"></span>
                          <span class="level-badge">Senior / Lead</span>
                        </div>
                        <div class="level-text">${skill.levels.senior}</div>
                      </div>
                    </div>
                    
                    <div class="skill-tools">
                      ${skill.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join("")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }
    });

    if (matchCount === 0) {
      htmlContent = `
        <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary); background: var(--bg-panel); border-radius: 20px; border: 1px solid var(--border-glass);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>Không tìm thấy kỹ năng phù hợp</h3>
          <p style="margin-top: 0.5rem; color: var(--text-muted);">Thử tìm với từ khóa khác như "API", "Figma", "Agile", "Postman", v.v.</p>
        </div>
      `;
    }

    skillsContainer.innerHTML = htmlContent;

    // Attach event listeners to checkboxes
    document.querySelectorAll(".skill-checkbox").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        const card = document.querySelector(`.skill-card[data-id="${id}"]`);
        
        if (e.target.checked) {
          checkedSkills[id] = true;
          if (card) card.classList.add("checked");
        } else {
          delete checkedSkills[id];
          if (card) card.classList.remove("checked");
        }
        
        saveCheckedSkills();
        updateMetrics();
      });
    });
  };

  // Render Comparison Matrix
  const renderComparison = () => {
    metricsBoard.style.display = "none";
    
    roleNameEl.textContent = "Bản đồ So sánh Vai trò";
    roleIconEl.textContent = "⚔️";
    roleDescEl.textContent = "Bảng đối chiếu trực quan các khía cạnh chuyên môn cốt lõi, công cụ chính và mức độ tương tác giữa 5 vai trò trong một dự án phát triển phần mềm hiện đại.";

    skillsContainer.innerHTML = `
      <div class="compare-container">
        <table class="compare-table">
          <thead>
            <tr>
              <th style="width: 15%">Khía cạnh</th>
              <th class="compare-role-header po" style="width: 17%">Product Owner</th>
              <th class="compare-role-header fe" style="width: 17%">Frontend Dev</th>
              <th class="compare-role-header be" style="width: 17%">Backend Dev</th>
              <th class="compare-role-header uiux" style="width: 17%">UI/UX Designer</th>
              <th class="compare-role-header tester" style="width: 17%">Tester (QA)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Tầm nhìn & Nghiệp vụ</strong></td>
              <td><strong>Rất cao (Định hướng chính)</strong><br>Quản lý backlog, viết story, định vị sản phẩm và chiến lược kinh doanh.</td>
              <td><strong>Trung bình/Thấp</strong><br>Hiểu nghiệp vụ để hiện thực hóa tính năng chính xác trên giao diện.</td>
              <td><strong>Trung bình/Thấp</strong><br>Hiểu logic nghiệp vụ để thiết kế database và luồng xử lý server-side.</td>
              <td><strong>Cao</strong><br>Nghiên cứu hành vi người dùng, sitemap và chuyển dịch nhu cầu thành giải pháp thiết kế.</td>
              <td><strong>Cao</strong><br>Nắm bắt nghiệp vụ sâu sắc để viết test cases, phát hiện sai sót luồng logic.</td>
            </tr>
            <tr>
              <td><strong>Giao diện & UI/UX</strong></td>
              <td><strong>Trung bình</strong><br>Đóng góp ý kiến về mặt trải nghiệm, duyệt giao diện nghiệm thu.</td>
              <td><strong>Rất cao</strong><br>Lập trình giao diện động, CSS/JS mượt mà, tối ưu hóa Core Web Vitals.</td>
              <td><strong>Thấp</strong><br>Hầu như không làm việc trực tiếp với UI/UX code, tập trung vào API/Server.</td>
              <td><strong>Rất cao (Sáng tạo chính)</strong><br>Thiết kế layout, phối màu, typography, design systems và prototype.</td>
              <td><strong>Trung bình</strong><br>Kiểm thử giao diện hiển thị, tính thân thiện của bố cục (UI/UX Testing).</td>
            </tr>
            <tr>
              <td><strong>Logic Server & DB</strong></td>
              <td><strong>Thấp</strong><br>Chỉ nắm tổng quan kiến trúc hệ thống để định lượng độ khó (Effort).</td>
              <td><strong>Thấp/Trung bình</strong><br>Giao tiếp API client-side, quản lý state và tối ưu hóa bộ nhớ client.</td>
              <td><strong>Rất cao (Core logic)</strong><br>Xử lý server-side, thiết kế database, caching, bảo mật và mở rộng hệ thống.</td>
              <td><strong>Thấp</strong><br>Không làm việc. Chỉ cần hiểu luồng dữ liệu cơ bản để tối ưu luồng thiết kế.</td>
              <td><strong>Trung bình</strong><br>Truy vấn database để đối chiếu dữ liệu, kiểm thử API độc lập.</td>
            </tr>
            <tr>
              <td><strong>Kiểm thử & QA</strong></td>
              <td><strong>Trung bình (UAT)</strong><br>Chỉ thực hiện kiểm thử nghiệm thu người dùng (User Acceptance Test).</td>
              <td><strong>Trung bình</strong><br>Viết Unit Test cho component, Integration test cho giao diện form.</td>
              <td><strong>Trung bình</strong><br>Viết Unit Test cho logic, Integration test cho APIs.</td>
              <td><strong>Thấp</strong><br>Đánh giá khả dụng (Usability testing) thiết kế với người dùng mẫu.</td>
              <td><strong>Rất cao (Đảm bảo chính)</strong><br>Kiểm thử hệ thống, tự động hóa kịch bản test (Automation), load test.</td>
            </tr>
            <tr>
              <td><strong>Công cụ cốt lõi (Tools)</strong></td>
              <td>
                <ul class="list-bullets">
                  <li>Jira, Confluence</li>
                  <li>Productboard</li>
                  <li>Miro / Figma</li>
                </ul>
              </td>
              <td>
                <ul class="list-bullets">
                  <li>VS Code, Git</li>
                  <li>React / Next.js</li>
                  <li>Tailwind CSS, Vite</li>
                </ul>
              </td>
              <td>
                <ul class="list-bullets">
                  <li>Docker, Redis</li>
                  <li>NodeJS / Go / Python</li>
                  <li>PostgreSQL, AWS</li>
                </ul>
              </td>
              <td>
                <ul class="list-bullets">
                  <li>Figma (Advanced)</li>
                  <li>Adobe CC</li>
                  <li>Maze, Hotjar</li>
                </ul>
              </td>
              <td>
                <ul class="list-bullets">
                  <li>Postman</li>
                  <li>Playwright / Cypress</li>
                  <li>JMeter, TestRail</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Tương tác Khách hàng</strong></td>
              <td><strong>Trực tiếp & Liên tục</strong><br>Lấy phản hồi trực tiếp, đàm phán yêu cầu kinh doanh.</td>
              <td><strong>Gián tiếp</strong><br>Thông qua bản thiết kế UI/UX và yêu cầu của PO.</td>
              <td><strong>Rất gián tiếp</strong><br>Hầu như không tương tác trực tiếp với người dùng cuối.</td>
              <td><strong>Trực tiếp (Nghiên cứu)</strong><br>Phỏng vấn kiểm thử người dùng trực tiếp để lấy dữ liệu hành vi.</td>
              <td><strong>Gián tiếp</strong><br>Thông qua việc đóng vai trò là người dùng cuối để kiểm thử hệ thống.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };

  // Switch role and update view
  const switchRole = (roleKey) => {
    currentRole = roleKey;
    currentView = "explore";

    // Update active tab buttons UI
    tabExplore.classList.add("active");
    tabChecklist.classList.remove("active");

    const data = SKILLS_DATA[roleKey];
    roleNameEl.textContent = data.title;
    roleIconEl.textContent = data.icon;
    roleDescEl.textContent = data.description;

    // Apply active class in navbar
    roleNavItems.forEach(item => {
      if (item.getAttribute("data-role") === roleKey) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
    compareBtn.parentElement.classList.remove("active");

    // Update dynamic background blob-1 color matching the role
    const blob1 = document.querySelector(".blob-1");
    if (blob1) {
      blob1.style.background = roleColors[roleKey].primary;
    }

    updateMetrics();
    renderSkills();
  };

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================

  // Sidebar role clicks
  roleNavItems.forEach(item => {
    item.addEventListener("click", () => {
      const role = item.getAttribute("data-role");
      if (role) {
        switchRole(role);
      }
    });
  });

  // Sidebar Compare click
  compareBtn.addEventListener("click", () => {
    currentView = "compare";
    
    // Remove active style from all roles
    roleNavItems.forEach(item => item.classList.remove("active"));
    compareBtn.parentElement.classList.add("active");

    // Clear search
    searchInput.value = "";
    searchQuery = "";

    renderComparison();
  });

  // Search input change
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    if (currentView === "compare") {
      // If user starts typing, automatically switch back to active role to show search results
      switchRole(currentRole);
    } else {
      renderSkills();
    }
  });

  // View Mode Tabs Click
  tabExplore.addEventListener("click", () => {
    if (currentView === "compare") {
      switchRole(currentRole);
    }
    
    tabExplore.classList.add("active");
    tabChecklist.classList.remove("active");
    
    // Smooth transition
    skillsContainer.querySelectorAll(".skill-levels").forEach(el => {
      el.style.display = "flex";
    });
  });

  tabChecklist.addEventListener("click", () => {
    if (currentView === "compare") {
      switchRole(currentRole);
    }
    
    tabExplore.classList.remove("active");
    tabChecklist.classList.add("active");
    
    // Hide details levels list to focus on checklists
    skillsContainer.querySelectorAll(".skill-levels").forEach(el => {
      el.style.display = "none";
    });
  });

  // Initialize
  loadCheckedSkills();
  switchRole(currentRole);
});
