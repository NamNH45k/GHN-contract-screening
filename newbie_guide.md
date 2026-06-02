# Hướng dẫn Cài đặt & Sử dụng Hệ thống Đối soát Hợp đồng (Dành cho Newbie)

Chào mừng bạn đến với **GHN Legal AI - Hệ thống đối soát hợp đồng**. Hướng dẫn này sẽ giúp bạn thiết lập từ đầu thư mục mã nguồn, cài đặt tiện ích mở rộng Chrome (Chrome Extension), trích xuất dữ liệu hợp đồng bằng Python và chạy ứng dụng đối soát trực tuyến hoặc cục bộ.

---

## 🛠️ Yêu cầu chuẩn bị (Prerequisites)

Để chạy được toàn bộ luồng xử lý tự động, máy tính của bạn cần cài đặt sẵn:
1. **Google Chrome**: Trình duyệt chính để chạy WebApp và tiện ích mở rộng.
2. **Python (Phiên bản 3.x)**: Cần thiết để chạy script trích xuất nội dung văn bản `.docx` thành dạng dữ liệu mà WebApp có thể đọc.
   - *Tải và cài đặt tại: [python.org](https://www.python.org/downloads/)* (Nhớ tích chọn **"Add Python to PATH"** lúc cài đặt).

---

## 📁 Bước 1: Chuẩn bị & Hiểu cấu trúc Thư mục Mã nguồn

Bạn tải toàn bộ mã nguồn từ GitHub hoặc nhận thư mục dự án **`Screen hợp đồng`** từ nhóm phát triển. Cấu trúc thư mục gồm các thành phần quan trọng sau:

```text
📂 Screen hợp đồng/
├── 📂 extension/              <-- Thư mục của Chrome Extension (Tiện ích Chrome)
├── 📂 temp/                   <-- Nơi chứa dữ liệu hợp đồng đã được trích xuất (.js)
├── 📂 webapp/                 <-- Chứa các file mẫu hợp đồng chuẩn của GHN (.docx)
├── 📄 index.html              <-- Giao diện WebApp đối soát chính
├── 📄 app.js                  <-- Logic so sánh và đối soát chính của WebApp
├── 📄 styles.css              <-- Giao diện hiển thị
├── 📄 extract_text.py         <-- Script Python để trích xuất file .docx mới
└── 📄 .gitignore              <-- File cấu hình loại bỏ tệp thừa khi đẩy lên Git
```

---

## 🔌 Bước 2: Cài đặt Chrome Extension (Tiện ích mở rộng)

Chrome Extension giúp bạn bắt giữ các file hợp đồng trực tuyến (hoặc tệp tin mở trên trình duyệt) và đẩy trực tiếp vào WebApp để đối soát tự động.

### Các bước cài đặt:
1. Mở trình duyệt Google Chrome và truy cập địa chỉ: **`chrome://extensions/`**
2. Ở góc trên cùng bên phải, hãy bật công tắc **Developer mode** (Chế độ dành cho nhà phát triển).
3. Ở góc trên cùng bên trái, nhấp vào nút **Load unpacked** (Tải tiện ích đã giải nén).
4. Một cửa sổ chọn thư mục hiện ra, bạn tìm và chọn đúng thư mục **`extension`** nằm trong thư mục mã nguồn của bạn (`...\Screen hợp đồng\extension`).
5. Bấm **Select Folder** (Chọn thư mục).
6. **Ghim Tiện ích**: Nhấp vào biểu tượng mảnh ghép puzzle ở thanh công cụ Chrome của bạn và bấm nút **Ghim (Pin)** tiện ích **GHN Legal AI**.

---

## 📝 Bước 3: Đưa Hợp đồng mới vào WebApp đối soát

Bạn có hai cách để đưa một hợp đồng mới cần đối soát vào hệ thống:

### Cách A: Tải trực tiếp file Word (.docx) từ trình duyệt (Nhanh nhất & Đơn giản nhất 🚀)
* Cả bản chạy Online (Vercel) và Offline (Local) đều hỗ trợ tính năng này:
  1. Trên giao diện WebApp, nhấp vào nút **📂 Tải trực tiếp file Word (.docx)** ở đầu thanh bên trái.
  2. Chọn file hợp đồng `.docx` từ máy tính của bạn.
  3. File hợp đồng sẽ được đọc và đưa trực tiếp vào danh sách đối soát ngay lập tức mà **không cần cài đặt Python hay Git**.
  *Lưu ý*: Hợp đồng tải lên theo cách này sẽ tự động lưu trong trình duyệt của bạn (Local Storage) để bạn tiếp tục làm việc sau khi tải lại trang.

### Cách B: Trích xuất bằng Python (Dành cho nhà phát triển hoặc khi chạy số lượng lớn)
Nếu muốn lưu trữ lâu dài hoặc đối soát hàng loạt trên Git:
1. Copy các file hợp đồng mới (`.docx`) vào thư mục gốc của dự án (`C:\Users\LENOVO\Desktop\Screen hợp đồng`).
2. Mở cửa sổ **PowerShell** hoặc CMD và chạy lệnh:
   ```powershell
   cd "c:\Users\LENOVO\Desktop\Screen hợp đồng"
   python extract_text.py
   ```
3. Script sẽ dịch toàn bộ file Word thành file dữ liệu `.js` lưu trong thư mục `temp/`. Bạn chỉ cần gõ lệnh `& "git\cmd\git.exe" push` để đưa chúng lên web trực tuyến.

---

## 🚀 Bước 4: Chạy và Sử dụng WebApp đối soát

Bạn có hai lựa chọn để sử dụng giao diện đối soát:

### Lựa chọn A: Dùng trực tuyến qua Vercel (Khuyên dùng)
* Truy cập địa chỉ trực tuyến đã được thiết lập sẵn: **[https://ghn-contract-screening.vercel.app/](https://ghn-contract-screening.vercel.app/)**
* *Mẹo*: Để cập nhật các hợp đồng mới mà bạn vừa trích xuất ở Bước 3 lên trang web trực tuyến này, bạn chỉ cần mở PowerShell tại thư mục dự án và chạy lệnh:
  ```powershell
  & "git\cmd\git.exe" push
  ```
  Vercel sẽ tự động cập nhật dữ liệu trực tuyến trong vòng 10 giây!

### Lựa chọn B: Chạy cục bộ (Offline trên máy tính)
* Chỉ cần vào thư mục dự án, tìm file **`index.html`** và click đúp chuột để mở trực tiếp trên trình duyệt Chrome. Giao diện đối soát cục bộ sẽ xuất hiện và hoạt động đầy đủ tính năng.

---

## 💡 Cách Sử dụng WebApp Đối Soát:

1. **Chọn hợp đồng**: Ở thanh bên trái (Hộp thư tiếp nhận), nhấp chọn hợp đồng bạn muốn kiểm tra.
2. **Chọn mẫu đối chiếu**: Ở phía trên bên phải, nhấp vào menu thả xuống **"Mẫu đối chiếu chuẩn"** để chọn mẫu hợp đồng chuẩn của công ty (Ví dụ: *Hợp đồng thuê bưu cục*, *Hợp đồng khách hàng B2B*,...).
3. **Xem kết quả đối soát**:
   - **Mục 1 (Thông tin pháp nhân)**: Xem bảng so sánh các trường thông tin cơ bản như Số hợp đồng, Ngày hiệu lực, Họ tên Bên A, Địa chỉ, Số điện thoại, Thông tin đại diện GHN... xem có khớp hay lệch so với mẫu chuẩn.
   - **Mục 2 & 3 (Định lượng & Chi tiết nội dung sửa)**: Xem cụ thể điều khoản nào bị xóa (màu đỏ) hoặc thêm mới/chỉnh sửa (màu xanh lá cây) so với mẫu chuẩn.
   - **Mục 4 (Thông tin bổ sung)**: Xem các mục phụ lục hoặc thông tin bảng giá đặc thù được điền thêm vào hợp đồng.
