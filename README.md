# ⌘ Phân hệ Trợ lý AI Contract Screening (Dự án Screen Hợp đồng)

Hệ thống rà soát và đối soát hợp đồng tự động ứng dụng Trí tuệ Nhân tạo (AI), hỗ trợ chuyên viên pháp lý giải quyết triệt để quy trình đối chiếu hợp đồng thủ công phức tạp.

Dự án gồm 2 thành phần chính kết nối trực tiếp với nhau và 1 Cổng Giả lập luồng hoạt động tích hợp ở thư mục gốc:
1. **Chrome Extension (Client Side)**: Tự động phát hiện hợp đồng yêu cầu trên Haraworks/Lisa, tải tệp và đẩy về hệ thống.
2. **WebApp Dashboard (Server Side)**: Quản lý tập trung, AI tự động phân loại và đối chiếu so lệch chi tiết dạng Split-Screen.
3. **E2E Simulator Portal (Root Thư mục)**: Giả lập toàn bộ luồng chạy tích hợp giúp bạn kiểm nghiệm nghiệp vụ ngay lập tức trên trình duyệt mà không cần cài đặt máy chủ.

---

## 📁 Cấu trúc Thư mục Dự án

```text
Screen hợp đồng/
├── bo_skills_vai_tro/          <-- [LƯU TRỮ] Bộ kỹ năng vai trò (PO, Dev, UI/UX, Tester) trước đây
├── extension/                  <-- [CHROME EXTENSION] Mã nguồn Client
│   ├── manifest.json           - File cấu hình Manifest V3 của Extension
│   ├── popup.html / popup.css  - Giao diện cửa sổ nhỏ (popup) khi click vào Extension icon
│   ├── popup.js                - Xử lý các nút bấm và thống kê trong popup
│   ├── background.js           - Service worker chạy ngầm của Extension
│   └── content.js              - Script tự động chèn nút "Đẩy sang WebApp" vào giao diện Haraworks / Lisa
├── webapp/                     <-- [WEBAPP DASHBOARD] Trung tâm xử lý AI & Quản trị
│   ├── index.html              - Giao diện bảng điều khiển quản trị (Dashboard) & Split-Screen Diff
│   ├── styles.css              - Hệ thống thiết kế CSS (Glassmorphism & Dark Mode)
│   ├── app.js                  - Logic xử lý phân loại AI (Nhóm a / b), gửi nhắc nhở và đối chiếu
│   └── mock_db.js              - Cơ sở dữ liệu hợp đồng mẫu & tệp tiếp nhận giả lập
├── index.html                  <-- [SIMULATOR PORTAL] Cổng giả lập E2E tích hợp ở gốc
├── styles.css                  - CSS styling cho Cổng giả lập
├── app.js                      - Logic chuyển động bay tệp tin và truyền tin qua postMessage
└── README.md                   - Tài liệu hướng dẫn này
```

---

## 🚀 Hướng dẫn Nghiệm thu & Chạy thử

### Bước 1: Trải nghiệm Cổng Giả Lập Tích Hợp (Khuyên dùng)
Đây là cách nhanh nhất để bạn xem toàn bộ luồng hoạt động nghiệp vụ phối hợp giữa Chrome Extension và WebApp Dashboard:
1. Tìm và nhấp đúp vào file **`index.html` ở thư mục gốc** của dự án để mở bằng Chrome, Edge hoặc Firefox.
2. Bạn sẽ thấy giao diện được chia đôi:
   - **Bên trái (Simulated Haraworks Mail)**: Giao diện thư nội bộ Haraworks. Có 3 yêu cầu rà soát các loại hợp đồng khác nhau.
   - **Bên phải (Simulated WebApp)**: Dashboard quản trị trung tâm được nhúng trực tiếp thông qua iframe.
3. **Trải nghiệm**:
   - Chọn email đầu tiên (FPT). Tại phần tệp đính kèm ở dưới, click nút **⌘ Đẩy sang WebApp** (giả lập hoạt động của Chrome Extension).
   - Bạn sẽ thấy hiệu ứng file bay từ Haraworks bên trái và xuất hiện lập tức trong danh sách bên phải.
   - Hệ thống WebApp bên phải sẽ kích hoạt quét AI và xếp vào **Nhóm (b) - Đối chiếu theo mẫu**.
   - Click vào hợp đồng đó ở bên phải để xem báo cáo đối sánh so lệch chi tiết: **Sai lệch thông tin pháp nhân**, **Tổng số lượng thay đổi** và **Bảng đối chiếu Split-screen** highlight chi tiết nội dung bị xóa (màu đỏ) và thêm mới (màu xanh lá) kèm cột phân tích rủi ro pháp lý của AI.
   - Thử tiếp tục với email thứ 2 (Sài Gòn Centre - Nhóm a, cần Legal Review) và email thứ 3 (PartnerCorp - Một tệp hợp đồng mới hoàn toàn chưa có trong DB trước đó) để thấy hoạt động đa dạng.

---

### Bước 2: Cài đặt và Load thử Chrome Extension thực tế
Nếu bạn muốn load thử Extension này trực tiếp vào trình duyệt Google Chrome của mình:
1. Mở trình duyệt Google Chrome, truy cập địa chỉ: `chrome://extensions/`
2. Bật công tắc **Developer mode (Chế độ nhà phát triển)** ở góc trên cùng bên phải.
3. Click chọn nút **Load unpacked (Tải tiện ích đã giải nén)** ở góc trên cùng bên trái.
4. Trỏ đường dẫn đến đúng thư mục **`Screen hợp đồng/extension/`** của bạn và chọn Select Folder.
5. Tiện ích **Antigravity AI Contract Screening** sẽ hiển thị trong danh sách Chrome Extensions. Bạn có thể pin tiện ích lên thanh bar để xem popup giao diện với các thống kê và nút Quét Thư nội bộ.
*(Lưu ý: Extension được lập trình sẵn sàng, khi hoạt động thực tế trên trang ic.haraworks.vn và lisa.ficus.ai sẽ tự động tìm kiếm các tệp đính kèm hợp đồng tương thích và chèn nút nhấn.)*

---

### Bước 3: Xem độc lập WebApp Dashboard
Bạn có thể mở riêng biệt bảng quản trị WebApp để kiểm tra hoạt động độc lập:
1. Truy cập thư mục `webapp/` và nhấp đúp vào **`webapp/index.html`**.
2. Toàn bộ giao diện quản trị, danh sách và màn hình so lệch Split-screen vẫn hoạt động đầy đủ trên cơ sở dữ liệu giả lập từ tệp `mock_db.js`.

---

## 🛠️ Công nghệ Sử dụng
- **HTML5 & CSS3 (Vanilla CSS)**: Thiết kế responsive, hiệu ứng mờ kính (Glassmorphism), bóng mờ dịch chuyển (Ambient Glow Blobs).
- **Vanilla JavaScript (ES6)**: Logic truyền dữ liệu xuyên suốt giữa các cửa sổ bằng `window.postMessage`, điều hướng động và lưu trữ cục bộ (`localStorage`).
- **Chrome Extension API (Manifest V3)**: Khai báo service worker (`background.js`), script tiêm DOM (`content.js`) và lưu trữ Extension (`chrome.storage.local`).
