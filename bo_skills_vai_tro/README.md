# ⌘ SkillMatrix - Bản đồ Kỹ năng Chuyên môn (Skill Matrix Dashboard)

Ứng dụng web Dashboard tương tác tuyệt đẹp giúp khám phá, tự đánh giá và đối chiếu chéo các bộ kỹ năng chuyên môn của 5 vai trò nòng cốt trong dự án phát triển phần mềm:
1. **Product Owner (PO)**
2. **Frontend Developer**
3. **Backend Developer**
4. **UI/UX Designer**
5. **Software Tester (QA)**

---

## 🌟 Tính năng nổi bật

1. **Premium Glassmorphism & Dark Mode**: Thiết kế giao diện hiện đại mang tính thẩm mỹ cao, chuyển động (micro-animations) mượt mà và tương thích tốt trên mọi thiết bị (Responsive).
2. **Chi tiết Kỹ năng đa cấp độ**: Mỗi kỹ năng được phân tích cụ thể qua 3 cấp độ phát triển nghề nghiệp: **Junior**, **Mid-Level** và **Senior / Lead** kèm theo danh sách công cụ/công nghệ tương ứng.
3. **Checklist tự đánh giá tương tác**: Cho phép người dùng đánh giá mức độ phủ kỹ năng cá nhân của mình. Hệ thống tự động tính điểm phần trăm và đưa ra gợi ý cấp độ tương xứng (Junior, Mid, Senior).
4. **Bảo toàn dữ liệu (LocalStorage)**: Tiến trình tự đánh giá được lưu tự động trên trình duyệt, không lo mất dữ liệu khi làm mới (F5) trang.
5. **Bộ lọc tìm kiếm thời gian thực (Real-time Search)**: Tìm nhanh bất kỳ kỹ năng, định nghĩa hay công cụ nào (ví dụ: gõ "Postman", "Figma", "Agile").
6. **Bảng so sánh chéo vai trò**: Trực quan hóa sự khác biệt giữa các vai trò về các mảng công việc chính (Tầm nhìn, UI/UX, Logic Backend, QA, Công cụ, Mức tương tác khách hàng).

---

## 📂 Danh sách các file trong thư mục

- `index.html`: Cấu trúc trang web Dashboard chính (SEO friendly).
- `styles.css`: Hệ thống thiết kế CSS với Glassmorphism, Neon Color Palette và Responsive layouts.
- `app.js`: Logic JavaScript xử lý tương tác bộ lọc, tìm kiếm, tính điểm và lưu trữ.
- `skills_data.js`: Cơ sở dữ liệu kỹ năng cấu trúc JSON chi tiết bằng tiếng Việt & tiếng Anh chuyên ngành.
- `README.md`: Tài liệu hướng dẫn này.

---

## 📋 Tóm tắt Bộ kỹ năng các vai trò

### 1. Product Owner (🎯)
- **Tầm nhìn & Lập Roadmap**: Định hình tầm nhìn sản phẩm, xây dựng lộ trình liên kết mục tiêu kinh doanh và công nghệ.
- **Quản lý Backlog**: Viết User Story, Acceptance Criteria, và sắp xếp thứ tự ưu tiên (RICE, MoSCoW).
- **Phân tích dữ liệu**: Đo lường KPIs sản phẩm (AARRR, Retention, NPS) bằng Google Analytics, Mixpanel, SQL.
- **Vận hành Scrum/Agile**: Đóng vai trò hạt nhân trong các sự kiện Scrum.
- **Quản lý Stakeholder**: Đàm phán, dung hòa lợi ích và giải quyết xung đột liên phòng ban.
- **Công cụ**: Jira, Confluence, Productboard, Miro, Figma.

### 2. Frontend Developer (💻)
- **Lập trình Web Core**: HTML5 Semantic, CSS3 Grid/Flexbox, ES6+ JavaScript, TypeScript.
- **Frameworks**: ReactJS, Next.js, VueJS hoặc Angular; quản lý state (Zustand, Redux).
- **Tối ưu hiệu năng**: Đo lường Core Web Vitals, code splitting, lazy loading tài nguyên.
- **Kiểm thử**: Unit test (Jest, React Testing Library), E2E test (Cypress, Playwright).
- **UI/UX Sense**: Thiết kế micro-interactions mượt mà, chuyển giao chính xác từ bản thiết kế Figma (Pixel Perfect).
- **Công cụ**: VS Code, Git, Chrome DevTools, Vite, Figma.

### 3. Backend Developer (⚙️)
- **Ngôn ngữ & Framework**: Node.js (NestJS), Golang, Python (FastAPI), hoặc Java (Spring Boot).
- **Cơ sở dữ liệu & Cache**: Thiết kế schema, indexing, transactions, database phân tán (PostgreSQL, MongoDB, Redis).
- **Thiết kế API**: RESTful API, GraphQL, gRPC, giao tiếp tin nhắn (RabbitMQ, Kafka).
- **DevOps & Cloud**: Đóng gói Docker, quy trình CI/CD, dịch vụ AWS/GCP, Kubernetes.
- **Tư duy Bảo mật**: Phòng thủ theo chuẩn OWASP Top 10, quản lý xác thực JWT/OAuth2.
- **Công cụ**: Docker, Postman, Git, DBeaver, Prometheus/Grafana.

### 4. UI/UX Designer (🎨)
- **Nghiên cứu Người dùng**: Phỏng vấn, khảo sát, xây dựng Personas & User Journey Map.
- **Kiến trúc Thông tin**: Xây dựng Sitemap, User Flow, Low-Fi Wireframe.
- **Giao diện & Prototype**: Thiết kế Hi-Fi UI, phân cấp thị giác (visual hierarchy) và prototype tương tác cao.
- **Design Systems**: Quản lý Component library, auto-layout nâng cao, variables và design tokens.
- **Thấu cảm & Thuyết trình**: Đặt mình vào vị trí người dùng, thuyết trình giải pháp thiết kế hợp lý.
- **Công cụ**: Figma, Adobe CC (Photoshop/Illustrator), Miro, Maze, Hotjar.

### 5. Tester / QA (🔍)
- **Kỹ thuật kiểm thử**: Quy trình test, thiết kế Test cases/Test scenario (phân tích biên, phân vùng tương đương).
- **Kiểm thử API**: Postman, viết test scripts tự động, collection runners.
- **Kiểm thử tự động**: Viết kịch bản Cypress, Playwright, Selenium sử dụng mô hình Page Object Model (POM).
- **Kiểm thử hiệu năng**: Giả lập tải trọng bằng JMeter, K6.
- **Tư duy phản biện**: Phân tích rủi ro hệ thống, tỉ mỉ phát hiện các kịch bản lỗi logic nghiệp vụ.
- **Công cụ**: Postman, Jira, TestRail, Playwright, JMeter, Chrome DevTools.

---

## 🚀 Hướng dẫn mở và sử dụng

Rất đơn giản, bạn **không cần cài đặt bất kỳ thư viện hay công cụ npm nào**:
1. Hãy tìm và nhấp đúp vào file **`index.html`** hoặc click chuột phải chọn **Open with Chrome/Edge/Firefox** để chạy trực tiếp trên trình duyệt.
2. Để xem trực quan mã nguồn, hãy mở thư mục dự án bằng **VS Code** hoặc trình chỉnh sửa mã nguồn bất kỳ.
3. Để thử nghiệm chức năng đánh giá năng lực, hãy tích chọn một vài kỹ năng và F5 tải lại trang để thấy tiến trình của bạn vẫn được lưu nguyên vẹn.
