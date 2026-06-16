import { auth, onAuthStateChanged, db, collection, getDocs, setDoc, deleteDoc, doc } from "./firebase_setup.js";

document.addEventListener("DOMContentLoaded", () => {
  let loggedInUser = null;
  
  onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email.endsWith("@ghn.vn")) {
      alert("Bạn không có quyền truy cập trang này.");
      window.location.href = "index.html";
      return;
    }
    
    // Check role in Firestore
    try {
      const userDocSnap = await getDocs(collection(db, "users"));
      let hasAccess = false;
      
      userDocSnap.forEach(docSnap => {
        if (docSnap.id === user.email) {
          const uData = docSnap.data();
          if (uData.role === "super_admin" || uData.role === "admin") {
            hasAccess = true;
            loggedInUser = uData;
          }
        }
      });
      
      if (!hasAccess) {
        alert("Bạn không có quyền truy cập trang này.");
        window.location.href = "index.html";
        return;
      }
      
      // Load users
      renderUsers();
      
    } catch (e) {
      console.error(e);
      alert("Lỗi tải phân quyền.");
      window.location.href = "index.html";
    }
  });

  // SEC-002: Escape HTML to prevent XSS
  const escapeHtml = (text) => {
    return (text || "").toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const tableBody = document.getElementById("users-table-body");
  const inviteModal = document.getElementById("invite-modal");
  const btnOpenInvite = document.getElementById("btn-open-invite");
  const btnInviteCancel = document.getElementById("btn-invite-cancel");
  const btnInviteSubmit = document.getElementById("btn-invite-submit");
  const inviteEmailInput = document.getElementById("invite-email");
  const inviteRoleSelect = document.getElementById("invite-role");
  const inviteError = document.getElementById("invite-error");

  const renderUsers = async () => {
    if (!tableBody) return;
    tableBody.innerHTML = "<tr><td colspan='3'>Đang tải...</td></tr>";

    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList = [];
      usersSnap.forEach(doc => usersList.push(doc.data()));

      tableBody.innerHTML = "";
      
      usersList.forEach((user, index) => {
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

        let canDelete = false;
        if (loggedInUser.email !== user.email) {
          if (loggedInUser.role === "super_admin") {
            canDelete = true;
          } else if (loggedInUser.role === "admin" && user.role === "user") {
            canDelete = true;
          }
        }

        tr.innerHTML = `
          <td>
            <div class="user-name-col">
              <div class="avatar-sm" style="background: ${getAvatarColor(user.role)}">${escapeHtml(user.avatar || user.email.substring(0, 2).toUpperCase())}</div>
              <span style="font-weight: 600; color: var(--text-primary);">${escapeHtml(user.email)}</span>
            </div>
          </td>
          <td>
            <span class="badge-role ${roleClass}">${roleDisplay}</span>
          </td>
          <td style="text-align: right;">
            ${canDelete ? `<button class="btn-delete" data-email="${user.email}">Xóa</button>` : `<span style="font-size:0.75rem; color: var(--text-muted);">Không thể xóa</span>`}
          </td>
        `;
        tableBody.appendChild(tr);
      });

      const deleteBtns = document.querySelectorAll(".btn-delete");
      deleteBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const emailToDelete = e.target.getAttribute("data-email");
          if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            await deleteDoc(doc(db, "users", emailToDelete));
            renderUsers();
          }
        });
      });
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = "<tr><td colspan='3'>Lỗi tải danh sách người dùng.</td></tr>";
    }
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
    btnInviteSubmit.addEventListener("click", async () => {
      inviteError.style.display = "none";
      const email = inviteEmailInput.value.trim().toLowerCase();
      const role = inviteRoleSelect.value;

      if (!email || !email.endsWith("@ghn.vn")) {
        inviteError.textContent = "Email không hợp lệ. Phải có đuôi @ghn.vn";
        inviteError.style.display = "block";
        return;
      }

      if (loggedInUser.role === "admin" && (role === "super_admin" || role === "admin")) {
        inviteError.textContent = "Admin chỉ có thể mời tài khoản với quyền User.";
        inviteError.style.display = "block";
        return;
      }

      try {
        const userRef = doc(db, "users", email);
        const existing = await getDocs(collection(db, "users"));
        let exists = false;
        existing.forEach(d => { if (d.id === email) exists = true; });
        
        if (exists) {
          inviteError.textContent = "Email này đã tồn tại trong hệ thống.";
          inviteError.style.display = "block";
          return;
        }

        const initials = email.substring(0, 2).toUpperCase();
        await setDoc(userRef, {
          email: email,
          avatar: initials,
          role: role
        });
        
        inviteModal.style.display = "none";
        renderUsers();
      } catch (e) {
        console.error(e);
        inviteError.textContent = "Lỗi khi mời người dùng.";
        inviteError.style.display = "block";
      }
    });
  }


});
