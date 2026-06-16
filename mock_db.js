// Database of Incoming Contracts
const CONTRACTS_DB = [
  {
    "id": "contract_chot_ngay_1_6",
    "fileName": "978b50fb-7c27-466a-9f0f-33c81b66017f_H_chot_ngay_1.6 (1).docx",
    "receivedDate": "02/06/2026",
    "sender": "partner-a@example.vn",
    "fileSize": "84 KB",
    "group": "b",
    "status": "Chờ đối soát",
    "templateName": "Chưa xác định",
    "selectedTemplate": null
  },
  {
    "id": "contract_gbn_elect",
    "fileName": "[GHN - TB ĐIỆN GBN] HDDV .docx",
    "receivedDate": "28/05/2026",
    "sender": "partner-b@example.vn",
    "fileSize": "2.4 MB",
    "group": "b",
    "status": "Chờ đối soát",
    "templateName": "Chưa xác định",
    "selectedTemplate": null
  },
  {
    "id": "contract_user_socson",
    "fileName": "H_uong_Bang_Xuan_Bach_Xa_Quang_Tien_Huyen_Soc_Son.docx",
    "receivedDate": "25/05/2026",
    "sender": "accounting@example.vn",
    "fileSize": "1.6 MB",
    "group": "b", // Đối chiếu theo mẫu
    "status": "Chờ đối soát",
    "templateName": "Chưa xác định",
    "selectedTemplate": null // Initially not selected
  },
  {
    "id": "contract_finetoday",
    "fileName": "CM_15_01_Doanh_nghiep_Hop_dong_dich_vu_B2B_( Fine Today project)_AR_reviewed.docx",
    "receivedDate": "25/05/2026",
    "sender": "accounting@example.vn",
    "fileSize": "6.1 MB",
    "group": "b",
    "status": "Chờ đối soát",
    "templateName": "Chưa xác định",
    "selectedTemplate": null
  },
  {
    "id": "contract_1",
    "fileName": "HD_CungCap_DichVu_FPT_Signed.pdf",
    "receivedDate": "25/05/2026",
    "sender": "business@example.vn",
    "fileSize": "1.4 MB",
    "group": "b",
    "status": "Chờ đối soát",
    "templateName": "Chưa xác định",
    "selectedTemplate": null
  },
  {
    "id": "contract_2",
    "fileName": "HD_Thue_Van_Phong_Partner_Format.docx",
    "receivedDate": "24/05/2026",
    "sender": "leasing@example.com",
    "fileSize": "2.1 MB",
    "group": "a", // Cần Legal Review
    "status": "Cần rà soát",
    "reason": "Hợp đồng thuê soạn thảo hoàn toàn theo biểu mẫu riêng của Đối tác (Sài Gòn Centre) với độ dài 45 trang, chứa nhiều điều khoản đặc thù về sửa chữa kết cấu tòa nhà, chi phí quản lý vận hành phức tạp và công thức trượt giá thuê theo tỷ giá ngoại tệ USD. Không thể tự động đối chiếu theo các biểu mẫu chuẩn hiện tại.",
    "notifications": [
      {
        "channel": "Email hệ thống",
        "recipient": "legal-team@example.vn",
        "status": "Đã gửi lúc 14:02 - 24/05"
      },
      {
        "channel": "Thông báo Harawork",
        "recipient": "Phòng Pháp lý (Legal Dept)",
        "status": "Đã tạo reminder công việc ưu tiên Cao"
      }
    ]
  }
];

const MOCK_COMPARE_DATA = {};

// Database of Users
let USERS_DB = JSON.parse(localStorage.getItem("GHN_USERS_DB"));
if (!USERS_DB || !Array.isArray(USERS_DB)) {
  USERS_DB = [];
}

// Ensure namnh@ghn.vn is super_admin and clean up old mock admin
USERS_DB = USERS_DB.filter(u => u.email !== "admin@ghn.vn");
const namnhIndex = USERS_DB.findIndex(u => u.email === "namnh@ghn.vn");
if (namnhIndex >= 0) {
  USERS_DB[namnhIndex].role = "super_admin";
  USERS_DB[namnhIndex].name = "Nguyễn Hữu Nam";
} else {
  USERS_DB.unshift({ email: "namnh@ghn.vn", name: "Nguyễn Hữu Nam", role: "super_admin", avatar: "NHN" });
}
localStorage.setItem("GHN_USERS_DB", JSON.stringify(USERS_DB));
