document.addEventListener("DOMContentLoaded", () => {
  // Check authorization
  const savedUserStr = localStorage.getItem("GHN_USER");
  let hasAccess = false;
  let loggedInUser = null;

  if (savedUserStr) {
    try {
      loggedInUser = JSON.parse(savedUserStr);
      if (loggedInUser && (loggedInUser.role === "super_admin" || loggedInUser.role === "admin")) {
        hasAccess = true;
      }
    } catch (e) {
      console.error("Error parsing user:", e);
    }
  }

  if (!hasAccess) {
    alert("Bạn không có quyền truy cập trang này.");
    window.location.href = "index.html";
    return;
  }

  const tableBody = document.getElementById("users-table-body");
  const inviteModal = document.getElementById("invite-modal");
  const btnOpenInvite = document.getElementById("btn-open-invite");
  const btnInviteCancel = document.getElementById("btn-invite-cancel");
  const btnInviteSubmit = document.getElementById("btn-invite-submit");
  const inviteEmailInput = document.getElementById("invite-email");
  const inviteRoleSelect = document.getElementById("invite-role");
  const inviteError = document.getElementById("invite-error");

  const renderUsers = () => {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    USERS_DB.forEach((user, index) => {
      const tr = document.createElement("tr");

      let roleDisplay = "User";
      let roleClass = "user";
      if (user.role === "super_admin") {
        roleDisplay = "Super Admin";
        roleClass = "super_admin";
      } else if (user.role === "admin") {
        roleDisplay = "Admin";
        roleClass = "admin";
      }

      // Check delete permission
      let canDelete = false;
      if (loggedInUser.email !== user.email) {
        if (loggedInUser.role === "super_admin") {
          canDelete = true;
        } else if (loggedInUser.role === "admin" && user.role === "user") {
          canDelete = true; // Admin can only delete users
        }
      }

      tr.innerHTML = `
        <td>
          <div class="user-name-col">
            <div class="avatar-sm" style="background: ${getAvatarColor(user.role)}">${user.avatar || user.email.substring(0, 2).toUpperCase()}</div>
            <span style="font-weight: 600; color: var(--text-primary);">${user.email}</span>
          </div>
        </td>
        <td>
          <span class="badge-role ${roleClass}">${roleDisplay}</span>
        </td>
        <td style="text-align: right;">
          ${canDelete ? `<button class="btn-delete" data-index="${index}">Xóa</button>` : `<span style="font-size:0.75rem; color: var(--text-muted);">Không thể xóa</span>`}
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Bind delete events
    const deleteBtns = document.querySelectorAll(".btn-delete");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
          USERS_DB.splice(index, 1);
          localStorage.setItem("GHN_USERS_DB", JSON.stringify(USERS_DB));
          renderUsers();
        }
      });
    });
  };

  const getAvatarColor = (role) => {
    if (role === "super_admin") return "#ff3b3b";
    if (role === "admin") return "#ff6c0a";
    return "#3b82f6";
  };

  // Open Modal
  if (btnOpenInvite) {
    btnOpenInvite.addEventListener("click", () => {
      inviteEmailInput.value = "";
      inviteRoleSelect.value = "user";
      inviteError.style.display = "none";
      inviteModal.style.display = "flex";
    });
  }

  // Close Modal
  if (btnInviteCancel) {
    btnInviteCancel.addEventListener("click", () => {
      inviteModal.style.display = "none";
    });
  }

  // Submit Invite
  if (btnInviteSubmit) {
    btnInviteSubmit.addEventListener("click", () => {
      inviteError.style.display = "none";
      const email = inviteEmailInput.value.trim().toLowerCase();
      const role = inviteRoleSelect.value;

      if (!email || !email.endsWith("@ghn.vn")) {
        inviteError.textContent = "Email không hợp lệ. Phải có đuôi @ghn.vn";
        inviteError.style.display = "block";
        return;
      }

      const existingUser = USERS_DB.find(u => u.email === email);
      if (existingUser) {
        inviteError.textContent = "Email này đã tồn tại trong hệ thống.";
        inviteError.style.display = "block";
        return;
      }

      if (loggedInUser.role === "admin" && (role === "super_admin" || role === "admin")) {
        inviteError.textContent = "Admin chỉ có thể mời tài khoản với quyền User.";
        inviteError.style.display = "block";
        return;
      }

      const initials = email.substring(0, 2).toUpperCase();

      const newUser = {
        email: email,
        avatar: initials,
        role: role
      };

      USERS_DB.push(newUser);
      localStorage.setItem("GHN_USERS_DB", JSON.stringify(USERS_DB));
      
      inviteModal.style.display = "none";
      renderUsers();
    });
  }

  // Initial render
  renderUsers();
});
