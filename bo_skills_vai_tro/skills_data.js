const SKILLS_DATA = {
  "product_owner": {
    "title": "Product Owner",
    "icon": "🎯",
    "color": "#ff79c6", // Neon Pink
    "borderColor": "rgba(255, 121, 198, 0.4)",
    "shadowColor": "rgba(255, 121, 198, 0.2)",
    "description": "Chịu trách nhiệm định hình tầm nhìn sản phẩm, tối ưu hóa giá trị của sản phẩm được tạo ra bởi nhóm phát triển, quản lý Product Backlog hiệu quả và kết nối giữa các bên liên quan (stakeholders) với đội ngũ kỹ thuật.",
    "categories": {
      "hard_skills": [
        {
          "id": "po_backlog",
          "name": "Quản lý & Tối ưu hóa Product Backlog",
          "desc": "Khả năng viết User Story rõ ràng, định nghĩa Acceptance Criteria (tiêu chí nghiệm thu), sắp xếp thứ tự ưu tiên các hạng mục công việc dựa trên giá trị kinh doanh và chiến lược sản phẩm.",
          "levels": {
            "junior": "Biết cách viết user story cơ bản dưới sự hướng dẫn, hiểu cấu trúc của một backlog, cập nhật trạng thái task.",
            "mid": "Độc lập quản lý và sắp xếp backlog, viết story và tiêu chí nghiệm thu rõ ràng, giải thích tường tận nghiệp vụ cho đội dev.",
            "senior": "Tối ưu hóa cấu trúc backlog cho sản phẩm phức tạp, định hướng chiến lược backlog dài hạn, xây dựng tiêu chuẩn (DoD, DoR) và hướng dẫn junior."
          },
          "tools": ["Jira", "Confluence", "Trello"]
        },
        {
          "id": "po_strategy",
          "name": "Định hình Tầm nhìn & Lập Roadmap",
          "desc": "Xác định mục tiêu dài hạn của sản phẩm, xây dựng Product Roadmap linh hoạt kết nối chặt chẽ giữa mục tiêu kinh doanh và khả năng thực thi kỹ thuật.",
          "levels": {
            "junior": "Tham gia đóng góp ý kiến vào lộ trình sản phẩm, hiểu mục tiêu ngắn hạn của sản phẩm hiện tại.",
            "mid": "Xây dựng roadmap ngắn và trung hạn (1-3 quý), phân tích các yếu tố tác động và điều chỉnh roadmap linh hoạt theo thị trường.",
            "senior": "Định hình tầm nhìn dài hạn (>1 năm), thống nhất roadmap với các cấp lãnh đạo cấp cao, định vị sản phẩm trên thị trường cạnh tranh."
          },
          "tools": ["Productboard", "Miro", "PowerPoint"]
        },
        {
          "id": "po_analytics",
          "name": "Phân tích Dữ liệu & Đo lường Sản phẩm",
          "desc": "Sử dụng dữ liệu định lượng và định tính để đưa ra quyết định, theo dõi và cải thiện các chỉ số sức khỏe của sản phẩm (KPIs, AARRR framework, Retention).",
          "levels": {
            "junior": "Biết đọc các biểu đồ cơ bản trên Google Analytics, theo dõi các chỉ số vận hành cơ bản.",
            "mid": "Tự thiết lập phễu chuyển đổi (funnel), định nghĩa các sự kiện cần đo lường, phân tích hành vi người dùng để tìm ra điểm nghẽn.",
            "senior": "Xây dựng khung đo lường toàn diện (Data-driven culture), đưa ra các quyết định kiến trúc sản phẩm mang lại tăng trưởng đột phá dựa trên dữ liệu lớn."
          },
          "tools": ["Google Analytics", "Mixpanel", "SQL", "Amplitude"]
        },
        {
          "id": "po_agile",
          "name": "Hiểu biết Agile & Vận hành Scrum",
          "desc": "Nắm vững nguyên lý Agile, đóng vai trò Product Owner tích cực trong các sự kiện Scrum (Sprint Planning, Daily Standup, Review, Retrospective).",
          "levels": {
            "junior": "Hiểu các khái niệm cơ bản của Scrum, tham gia đầy đủ và đúng vai trò trong các sự kiện Scrum.",
            "mid": "Vận hành nhịp nhàng các buổi Sprint Planning và Review, phối hợp chặt chẽ với Scrum Master để gỡ bỏ các rào cản nghiệp vụ.",
            "senior": "Thúc đẩy văn hóa Agile ở quy mô lớn (Scaled Agile), tối ưu hóa quy trình làm việc liên phòng ban để tăng vận tốc (velocity) của nhóm."
          },
          "tools": ["Scrum Framework", "Kanban", "Agile Metrics"]
        }
      ],
      "soft_skills": [
        {
          "id": "po_stakeholder",
          "name": "Quản lý Các bên liên quan (Stakeholder Management)",
          "desc": "Đàm phán và dung hòa lợi ích giữa các bên liên quan khác nhau (Ban giám đốc, Sales, Marketing, Khách hàng, Đội kỹ thuật) để đi đến thống nhất.",
          "levels": {
            "junior": "Ghi nhận đầy đủ yêu cầu từ các bên liên quan và báo cáo lại cho người quản lý.",
            "mid": "Chủ động giao tiếp, quản lý mong đợi (expectation management) của stakeholders, biết nói 'Không' một cách khéo léo kèm số liệu chứng minh.",
            "senior": "Trở thành cầu nối chiến lược, xây dựng lòng tin vững chắc, giải quyết các xung đột lợi ích phức tạp nhất giữa các bộ phận."
          },
          "tools": ["Communication Matrix", "Negotiation Techniques"]
        },
        {
          "id": "po_problem",
          "name": "Tư duy Giải quyết vấn đề (Problem Solving)",
          "desc": "Xác định nhanh chóng nguyên nhân gốc rễ (Root Cause) của vấn đề và đề xuất các giải pháp khả thi trong điều kiện nguồn lực hạn chế.",
          "levels": {
            "junior": "Phát hiện vấn đề phát sinh và đề xuất phương án xử lý cơ bản dựa trên hướng dẫn sẵn có.",
            "mid": "Phân tích vấn đề đa chiều, đưa ra tối thiểu 2-3 giải pháp kèm phân tích ưu/nhược điểm (Trade-off).",
            "senior": "Dự báo trước các rủi ro lớn, thiết lập các kịch bản ứng phó khẩn cấp, đưa ra các quyết định chiến thuật giải nguy nhanh chóng."
          },
          "tools": ["5 Whys", "Mind Mapping", "Fishbone Diagram"]
        }
      ]
    }
  },
  "frontend_developer": {
    "title": "Frontend Developer",
    "icon": "💻",
    "color": "#8be9fd", // Neon Cyan
    "borderColor": "rgba(139, 233, 253, 0.4)",
    "shadowColor": "rgba(139, 233, 253, 0.2)",
    "description": "Chịu trách nhiệm xây dựng giao diện người dùng (UI) trực quan, tương tác mượt mà và tối ưu hóa trải nghiệm (UX) trên các thiết bị và trình duyệt khác nhau dựa trên thiết kế.",
    "categories": {
      "hard_skills": [
        {
          "id": "fe_core",
          "name": "Lập trình Web Core (HTML5, CSS3, JS/TS)",
          "desc": "Nắm vững ngữ nghĩa HTML (Semantic HTML), kỹ thuật dàn trang CSS (Flexbox, Grid), JavaScript hiện đại (ES6+) và tư duy lập trình chặt chẽ với TypeScript.",
          "levels": {
            "junior": "Viết được mã HTML/CSS đúng chuẩn, giải quyết tốt các bài toán DOM Manipulation bằng JS và sử dụng TypeScript ở mức cơ bản.",
            "mid": "Nắm vững lập trình bất đồng bộ (Async/Await), tối ưu cấu trúc DOM, viết mã CSS có tính tái sử dụng cao, áp dụng chặt chẽ kiểu dữ liệu TypeScript.",
            "senior": "Chuyên gia về kiến trúc CSS, giải quyết các bài toán phức tạp về JS Engine, quản lý bộ nhớ ở client và thiết kế các core module dùng chung."
          },
          "tools": ["ES6+", "TypeScript", "SCSS", "Tailwind CSS"]
        },
        {
          "id": "fe_frameworks",
          "name": "Frameworks Hiện đại (React / Vue / Angular)",
          "desc": "Xây dựng các ứng dụng Single Page Application (SPA) hoặc Server-Side Rendering (SSR) bằng các framework phổ biến, quản lý vòng đời component và luồng dữ liệu.",
          "levels": {
            "junior": "Hiểu cơ chế hoạt động, tạo được các component đơn giản, quản lý state nội bộ và binding dữ liệu thành thạo.",
            "mid": "Thiết kế các component linh hoạt (reusable), áp dụng tốt các thư viện quản lý state (Redux, Zustand) và tối ưu hóa số lần re-render.",
            "senior": "Xây dựng kiến trúc dự án lớn (Monorepo, Micro-frontends), tối ưu hóa SSR/SSG (Next.js/Nuxt.js), thiết lập quy chuẩn lập trình component toàn dự án."
          },
          "tools": ["ReactJS", "Next.js", "Zustand", "Redux Toolkit"]
        },
        {
          "id": "fe_performance",
          "name": "Tối ưu hóa Hiệu năng Web (Performance)",
          "desc": "Đo lường và cải thiện tốc độ tải trang, nâng cao điểm số Core Web Vitals giúp tối ưu trải nghiệm người dùng và SEO.",
          "levels": {
            "junior": "Biết nén ảnh, sử dụng lazy loading cho ảnh và script cơ bản.",
            "mid": "Sử dụng thành thạo Lighthouse, tối ưu bundle size thông qua code splitting, tối ưu hóa caching ở browser và hạn chế blocking render.",
            "senior": "Tái cấu trúc luồng tải tài nguyên phức tạp, tối ưu hóa Critical Rendering Path, giải quyết triệt để các vấn đề CLS (Cumulative Layout Shift) và LCP."
          },
          "tools": ["Lighthouse", "Web Vitals", "Webpack", "Vite"]
        },
        {
          "id": "fe_testing",
          "name": "Kiểm thử Frontend (Testing)",
          "desc": "Viết mã kiểm thử để đảm bảo tính đúng đắn của giao diện và logic tương tác từ Unit Test đến Integration Test và End-to-End Test.",
          "levels": {
            "junior": "Biết cách viết Unit Test cơ bản cho các hàm helper hoặc component thuần túy (pure components).",
            "mid": "Thiết lập kiểm thử tích hợp (Integration Test) cho các luồng tương tác của form, mock dữ liệu API đầy đủ.",
            "senior": "Xây dựng hệ thống tự động kiểm thử giao diện E2E toàn diện trên CI/CD, áp dụng phương pháp TDD (Test-Driven Development) hiệu quả."
          },
          "tools": ["Jest", "React Testing Library", "Cypress", "Playwright"]
        }
      ],
      "soft_skills": [
        {
          "id": "fe_uiux_sense",
          "name": "Tư duy Thẩm mỹ & UX (UI/UX Alignment)",
          "desc": "Khả năng thấu hiểu thiết kế và chuyển đổi thành code có độ chính xác cao (Pixel Perfect) đồng thời bổ sung các hiệu ứng micro-interactions mượt mà.",
          "levels": {
            "junior": "Chuyển đổi thiết kế Figma sang HTML/CSS chính xác, tôn trọng khoảng cách và tỷ lệ.",
            "mid": "Nhận diện và chủ động điều chỉnh các bất hợp lý trong luồng trải nghiệm thực tế, áp dụng các transition và animation tinh tế để tăng độ cao cấp.",
            "senior": "Đồng thiết kế cùng UI/UX Designer, định hình thư viện Design System đồng bộ giữa đội thiết kế và đội phát triển phần mềm."
          },
          "tools": ["Figma (Inspect mode)", "CSS Animations", "Framer Motion"]
        }
      ]
    }
  },
  "backend_developer": {
    "title": "Backend Developer",
    "icon": "⚙️",
    "color": "#50fa7b", // Neon Green
    "borderColor": "rgba(80, 250, 123, 0.4)",
    "shadowColor": "rgba(80, 250, 123, 0.2)",
    "description": "Chịu trách nhiệm thiết kế kiến trúc hệ thống, xây dựng cơ sở dữ liệu vững chắc, phát triển logic nghiệp vụ ở máy chủ (API) và đảm bảo tính bảo mật, hiệu năng ổn định dưới tải lượng lớn.",
    "categories": {
      "hard_skills": [
        {
          "id": "be_lang",
          "name": "Ngôn ngữ & Framework máy chủ (Language & Framework)",
          "desc": "Làm chủ ít nhất một ngôn ngữ backend chính (Node.js, Go, Python, Java) và framework tương ứng để xây dựng các dịch vụ máy chủ hiệu quả.",
          "levels": {
            "junior": "Viết được API cơ bản (CRUD), hiểu luồng Request-Response và cấu trúc thư mục dự án.",
            "mid": "Viết code sạch theo nguyên lý SOLID, tối ưu hóa các middleware, xử lý tốt lỗi tập trung (Centralized Error Handling) và quản lý tiến trình bất đồng bộ.",
            "senior": "Định hình cấu trúc dự án chuẩn (Clean Architecture, DDD), tối ưu hóa tài nguyên phần cứng, nâng cao khả năng tái sử dụng mã nguồn cho cả hệ thống lớn."
          },
          "tools": ["Node.js (NestJS)", "Golang", "Python (FastAPI)", "Java (Spring Boot)"]
        },
        {
          "id": "be_database",
          "name": "Cơ sở dữ liệu & Caching (Database)",
          "desc": "Thiết kế cơ sở dữ liệu quan hệ (SQL) và phi quan hệ (NoSQL), tối ưu hóa truy vấn dữ liệu và tích hợp các lớp cache tăng tốc độ phản hồi.",
          "levels": {
            "junior": "Thiết kế được bảng đơn giản, viết truy vấn SQL cơ bản (Join, Group By), sử dụng ORM ở mức cơ bản.",
            "mid": "Thiết kế database chuẩn hóa tốt, tối ưu hóa truy vấn phức tạp (Explain Plan), thiết lập indexing hợp lý, sử dụng Redis làm cache.",
            "senior": "Thiết kế cơ sở dữ liệu phân tán (Sharding, Replication), xử lý đồng bộ dữ liệu phức tạp, xử lý deadlock và quản lý các giao dịch (Transactions) quy mô lớn."
          },
          "tools": ["PostgreSQL", "MySQL", "MongoDB", "Redis"]
        },
        {
          "id": "be_api",
          "name": "Kiến trúc API & Tích hợp (API & Integration)",
          "desc": "Thiết kế API chuẩn mực, tối ưu và bảo mật, giao tiếp mượt mà giữa các dịch vụ thông qua nhiều giao thức (REST, GraphQL, gRPC) và Message Queue.",
          "levels": {
            "junior": "Thiết kế API theo chuẩn REST đơn giản, tích hợp thư viện bên thứ 3 bằng API key.",
            "mid": "Thiết kế API có tính bảo mật (Rate Limiting, JWT), sử dụng GraphQL/gRPC khi cần thiết, tích hợp các hệ thống hàng đợi tin nhắn (Message Broker).",
            "senior": "Thiết kế hệ thống API Gateway toàn diện, xây dựng kiến trúc Event-Driven ổn định, quản lý độ trễ cực thấp trong giao tiếp nội bộ giữa các microservices."
          },
          "tools": ["RESTful API", "GraphQL", "gRPC", "RabbitMQ / Kafka"]
        },
        {
          "id": "be_devops",
          "name": "DevOps & Điện toán đám mây (Cloud & DevOps)",
          "desc": "Đóng gói ứng dụng trong container, triển khai ứng dụng tự động trên các nền tảng đám mây và xây dựng luồng CI/CD.",
          "levels": {
            "junior": "Biết viết Dockerfile cơ bản, hiểu các lệnh Docker cơ bản, đẩy code lên GitHub tự động kích hoạt deploy mẫu.",
            "mid": "Sử dụng thành thạo Docker Compose, cấu hình CI/CD hoàn chỉnh (GitHub Actions, GitLab CI), triển khai ứng dụng lên AWS/GCP (EC2, S3, RDS).",
            "senior": "Thiết lập kiến trúc hạ tầng dạng code (Terraform), giám sát hệ thống thời gian thực (Prometheus/Grafana, ELK Stack), quản lý cụm Kubernetes."
          },
          "tools": ["Docker", "Kubernetes", "AWS / GCP", "GitHub Actions"]
        }
      ],
      "soft_skills": [
        {
          "id": "be_security",
          "name": "Tư duy Bảo mật & Phòng thủ (Security Mindset)",
          "desc": "Nhận thức sâu sắc về các rủi ro bảo mật phần mềm và chủ động tích hợp cơ chế bảo vệ chống lại các hình thức tấn công mạng phổ biến.",
          "levels": {
            "junior": "Hiểu và thực hiện mã hóa mật khẩu người dùng, chống SQL Injection cơ bản.",
            "mid": "Áp dụng các biện pháp phòng vệ theo chuẩn OWASP Top 10 (CSRF, XSS, CORS, Auth bypass), thiết lập cơ chế ghi nhật ký (logging) bảo mật.",
            "senior": "Thiết lập hệ thống kiểm tra bảo mật tự động (SAST/DAST), thiết kế hệ thống phân quyền phức tạp (RBAC/ABAC), ứng phó hiệu quả với tấn công DDOS."
          },
          "tools": ["OWASP Top 10", "JWT/OAuth2", "SSL/TLS", "Helmet.js"]
        }
      ]
    }
  },
  "uiux_designer": {
    "title": "UI/UX Designer",
    "icon": "🎨",
    "color": "#bd93f9", // Neon Purple
    "borderColor": "rgba(189, 147, 249, 0.4)",
    "shadowColor": "rgba(189, 147, 249, 0.2)",
    "description": "Chịu trách nhiệm nghiên cứu hành vi người dùng, lập cấu trúc thông tin, thiết kế giao diện trực quan bắt mắt (UI) và thiết lập luồng trải nghiệm khách hàng tối ưu nhất (UX).",
    "categories": {
      "hard_skills": [
        {
          "id": "ds_research",
          "name": "Nghiên cứu Người dùng & Phân tích (UX Research)",
          "desc": "Tiến hành phỏng vấn, khảo sát người dùng thực tế, xây dựng chân dung khách hàng (Personas) và bản đồ hành trình người dùng (User Journey Map).",
          "levels": {
            "junior": "Tham gia hỗ trợ ghi chép các buổi phỏng vấn người dùng, tổng hợp số liệu khảo sát thô.",
            "mid": "Chủ động lên kịch bản phỏng vấn, thực hiện khảo sát độc lập, phân tích hành vi định tính để tìm ra các điểm đau (Pain points) lớn.",
            "senior": "Xây dựng chiến lược nghiên cứu dài hạn cho sản phẩm mới, thiết lập quy chuẩn đánh giá trải nghiệm người dùng, đo lường các chỉ số UX KPIs."
          },
          "tools": ["Maze", "Hotjar", "User Interviews", "SurveyMonkey"]
        },
        {
          "id": "ds_wireframe",
          "name": "Xây dựng Kiến trúc Thông tin & Wireframe",
          "desc": "Tổ chức cấu trúc thông tin sản phẩm (Sitemap), phác thảo luồng người dùng (User Flow) và tạo các bản phác thảo thô giao diện (Low-Fi Wireframe).",
          "levels": {
            "junior": "Vẽ được các sitemap đơn giản, phác thảo wireframe cơ bản cho các màn hình đơn lẻ.",
            "mid": "Xây dựng User Flow phức tạp cho toàn bộ tính năng lớn, thiết lập các bản wireframe có cấu trúc thông tin logic, mạch lạc.",
            "senior": "Kiến trúc lại toàn bộ các luồng sản phẩm phức tạp (Omni-channel), tối ưu hóa luồng tương tác để tối đa tỷ lệ chuyển đổi (CR)."
          },
          "tools": ["Miro", "Figma", "Whimsical"]
        },
        {
          "id": "ds_visual",
          "name": "Thiết kế Giao diện Trực quan & Prototype (UI & Prototyping)",
          "desc": "Thiết kế giao diện hoàn chỉnh (Hi-Fi UI), phối hợp màu sắc, phân cấp thị giác rõ ràng và tạo các prototype tương tác sống động.",
          "levels": {
            "junior": "Thiết kế giao diện đẹp mắt đúng tỷ lệ lưới (grid), tạo prototype click-through đơn giản.",
            "mid": "Làm chủ việc phân cấp thị giác (visual hierarchy), sử dụng auto-layout linh hoạt trong Figma, thiết kế các hiệu ứng chuyển động tương tác thực tế.",
            "senior": "Xây dựng các prototype phức tạp mô phỏng logic ứng dụng thật (Variables/Conditions), định hướng phong cách nghệ thuật độc đáo cho sản phẩm."
          },
          "tools": ["Figma", "Adobe Photoshop / Illustrator", "Protopie"]
        },
        {
          "id": "ds_system",
          "name": "Xây dựng Hệ thống Thiết kế (Design Systems)",
          "desc": "Tạo dựng, phát triển và quản trị hệ thống thư viện thành phần (components) đồng bộ, giúp tối ưu hóa tốc độ thiết kế và lập trình.",
          "levels": {
            "junior": "Sử dụng thành thạo các component sẵn có từ thư viện thiết kế của công ty mà không phá vỡ cấu trúc.",
            "mid": "Chủ động đóng góp, xây dựng và chuẩn hóa các component mới (nút bấm, input, modal), quản lý variants và thiết lập auto-layout nâng cao.",
            "senior": "Kiến trúc và vận hành Design System ở quy mô doanh nghiệp lớn, đồng bộ hóa design tokens giữa Figma và code của lập trình viên."
          },
          "tools": ["Figma Libraries", "Design Tokens", "Storybook (concept)"]
        }
      ],
      "soft_skills": [
        {
          "id": "ds_empathy",
          "name": "Sự thấu cảm người dùng (Empathy)",
          "desc": "Đặt bản thân vào vị trí của nhiều đối tượng người dùng khác nhau (về độ tuổi, khả năng tiếp cận công nghệ) để phát hiện ra các bất cập tiềm ẩn.",
          "levels": {
            "junior": "Hiểu khái niệm thấu cảm và cố gắng thiết kế giao diện dễ nhìn, thân thiện.",
            "mid": "Thấu hiểu sâu sắc hành vi tâm lý người dùng (Gestalt principles, Fitts's law), tối ưu thiết kế cho cả những người khuyết tật (Accessibility - WCAG).",
            "senior": "Truyền cảm hứng thấu cảm người dùng cho toàn bộ nhóm phát triển, lấy người dùng làm trung tâm trong mọi quyết định kinh doanh."
          },
          "tools": ["Empathy Map", "Accessibility standards (WCAG)"]
        }
      ]
    }
  },
  "tester": {
    "title": "Software Tester (QA)",
    "icon": "🔍",
    "color": "#f1fa8c", // Neon Yellow
    "borderColor": "rgba(241, 250, 140, 0.4)",
    "shadowColor": "rgba(241, 250, 140, 0.2)",
    "description": "Chịu trách nhiệm đảm bảo chất lượng phần mềm trước khi phát hành bằng cách xây dựng kịch bản kiểm thử, thực hiện kiểm thử thủ công và tự động, tìm lỗi (bugs) và báo cáo chi tiết.",
    "categories": {
      "hard_skills": [
        {
          "id": "qa_fundamentals",
          "name": "Quy trình & Kỹ thuật kiểm thử (Testing Fundamentals)",
          "desc": "Nắm vững lý thuyết kiểm thử phần mềm, các cấp độ test (Unit, Integration, System, UAT) và các kỹ thuật thiết kế test case.",
          "levels": {
            "junior": "Hiểu các định nghĩa kiểm thử cơ bản, viết được test cases cho các luồng nghiệp vụ đơn giản theo tài liệu yêu cầu.",
            "mid": "Áp dụng thành thạo các kỹ thuật phân tích biên (Boundary Value), phân vùng tương đương (Equivalence Partitioning), viết test plan hoàn chỉnh.",
            "senior": "Xây dựng chiến lược kiểm thử (Test Strategy) cho toàn bộ dự án lớn, phân tích rủi ro sản phẩm để phân bổ tài nguyên kiểm thử hợp lý."
          },
          "tools": ["Jira", "TestRail", "Xray", "Excel"]
        },
        {
          "id": "qa_api",
          "name": "Kiểm thử API (API Testing)",
          "desc": "Kiểm tra tính đúng đắn, độ tin cậy và bảo mật của các giao thức dịch vụ web (REST APIs) tách biệt khỏi giao diện người dùng.",
          "levels": {
            "junior": "Biết gọi API bằng Postman, kiểm tra mã trả về (status code) và nội dung JSON đơn giản.",
            "mid": "Viết các kịch bản test tự động (test scripts) trong Postman, truyền tham số động (environment variables), chạy test tự động theo bộ (collection runner).",
            "senior": "Tích hợp kiểm thử API vào pipeline CI/CD, mock API chuyên nghiệp, viết kịch bản test hiệu năng API tự động."
          },
          "tools": ["Postman", "Newman", "RestAssured", "Charles Proxy"]
        },
        {
          "id": "qa_automation",
          "name": "Kiểm thử Tự động (Automation Testing)",
          "desc": "Lập trình kịch bản test tự động chạy trên giao diện web hoặc mobile, tiết kiệm thời gian chạy Regression Test.",
          "levels": {
            "junior": "Hiểu nguyên lý hoạt động của automation test, có thể chỉnh sửa các selector đơn giản trong code có sẵn.",
            "mid": "Viết độc lập các kịch bản test UI tự động bằng Cypress hoặc Playwright, áp dụng mô hình Page Object Model (POM) để tái sử dụng code.",
            "senior": "Kiến trúc khung kiểm thử tự động (Automation Framework) từ đầu, tối ưu hóa tốc độ chạy test song song, tích hợp hoàn hảo với hệ thống CI/CD."
          },
          "tools": ["Playwright", "Cypress", "Selenium", "Appium (Mobile)"]
        },
        {
          "id": "qa_performance",
          "name": "Kiểm thử Hiệu năng & Tải (Performance & Load Testing)",
          "desc": "Mô phỏng hàng ngàn người dùng truy cập đồng thời để đo lường độ chịu tải và tìm ra điểm nghẽn hiệu năng của hệ thống.",
          "levels": {
            "junior": "Biết cách cấu hình và chạy test tải đơn giản bằng JMeter theo hướng dẫn.",
            "mid": "Tự viết các kịch bản test tải phức tạp, phân tích các chỉ số thời gian phản hồi (Response Time), thông lượng (Throughput) và tỷ lệ lỗi (Error Rate).",
            "senior": "Phân tích nguyên nhân nghẽn cổ chai ở tầng server, DB, hoặc hạ tầng mạng; phối hợp với Dev để tối ưu hóa hiệu suất phần cứng và phần mềm."
          },
          "tools": ["JMeter", "K6", "LoadRunner"]
        }
      ],
      "soft_skills": [
        {
          "id": "qa_attention",
          "name": "Sự tỉ mỉ & Tư duy phản biện (Critical Thinking)",
          "desc": "Luôn đặt câu hỏi nghi vấn với tính năng, chú ý đến từng tiểu tiết của giao diện và hành vi hệ thống để phát hiện các lỗi tiềm ẩn.",
          "levels": {
            "junior": "Phát hiện tốt các lỗi hiển thị rõ ràng, ghi nhận chính xác các bước tái hiện lỗi (Steps to reproduce).",
            "mid": "Tìm ra các lỗi luồng logic (edge cases), lỗi tích hợp phức tạp giữa các phân hệ, viết báo cáo lỗi (Bug report) chuyên nghiệp, đầy đủ log.",
            "senior": "Tư vấn cho PO và Dev về các lỗi logic ngay từ khâu thiết kế nghiệp vụ, ngăn chặn lỗi phát sinh trước khi code được viết."
          },
          "tools": ["Chrome DevTools", "Charles Proxy", "Mind Mapping"]
        }
      ]
    }
  }
};
