# 📝 NoteShare - Ứng dụng Ghi chú & Chia sẻ An toàn

<div align="center">

![NoteShare Banner](https://img.shields.io/badge/NoteShare-Your%20Secure%20Notes-1976d2?style=for-the-badge&logo=notepad&logoColor=white)

[![GitHub license](https://img.shields.io/github/license/vigstudio/noteshare)](https://github.com/vigstudio/noteshare/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/vigstudio/noteshare)](https://github.com/vigstudio/noteshare/issues)
[![GitHub stars](https://img.shields.io/github/stars/vigstudio/noteshare)](https://github.com/vigstudio/noteshare/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/vigstudio/noteshare)](https://github.com/vigstudio/noteshare/network)

**🚀 Lưu trữ. Chia sẻ. Bảo mật. Đơn giản.**

[Demo](https://noteshare.nghiane.com) · [Báo cáo Bug](https://github.com/vigstudio/noteshare/issues) · [Yêu cầu tính năng](https://github.com/vigstudio/noteshare/issues)

</div>

## ✨ Tổng quan

NoteShare là giải pháp hoàn hảo cho việc lưu trữ và chia sẻ ghi chú an toàn. Với thiết kế hiện đại và tính năng bảo mật mạnh mẽ, NoteShare giúp bạn:

- 🔒 Bảo vệ thông tin với mã bảo mật
- 🌐 Chia sẻ ghi chú dễ dàng qua link hoặc QR code
- 📎 Đính kèm và quản lý file thuận tiện
- 💻 Trải nghiệm giao diện thân thiện trên mọi thiết bị

## 🎯 Tính năng nổi bật

### 📋 1. Quản lý ghi chú thông minh

- ✍️ Tạo ghi chú với trình soạn thảo hiện đại
- 👀 Xem trước nội dung với định dạng đẹp mắt
- 📊 Hiển thị số dòng chuyên nghiệp
- 🗑️ Quản lý và xóa ghi chú dễ dàng
- ⌨️ Hỗ trợ soạn thảo nội dung dài

### 📁 2. Đính kèm file tiện lợi

- 📤 Upload nhiều file cùng lúc
- 🖼️ Hiển thị icon trực quan
- ⬇️ Tải xuống nhanh chóng
- 🧹 Tự động dọn dẹp file không cần thiết

### 🔐 3. Bảo mật đa lớp

- 🔑 Bảo vệ bằng mã truy cập riêng
- 👤 Phân quyền xem nội dung
- 💾 Lưu trữ mã bảo mật an toàn
- 🔄 Thay đổi mã bảo mật linh hoạt

### 🔗 4. Chia sẻ thông minh

- 🆔 ID chia sẻ ngắn gọn, dễ nhớ
- 📱 Tạo QR code tức thì
- 👥 Chia sẻ không cần đăng nhập
- 🎨 Giao diện chia sẻ chuyên nghiệp

### 🎨 5. Giao diện người dùng hiện đại

- 🎯 Thiết kế tối giản, dễ sử dụng
- 🎨 Màu sắc hài hòa (#1976d2)
- 📱 Tương thích mọi thiết bị
- ⚡ Hiệu ứng mượt mà
- ⚠️ Thông báo lỗi trực quan

## 🚀 Cài đặt và Sử dụng

### 📋 Yêu cầu hệ thống

- ✅ Node.js (v14 trở lên)
- ✅ NPM hoặc Yarn
- ✅ SQLite3

### 📥 Các bước cài đặt

1. Clone repository:

```bash
git clone https://github.com/vigstudio/noteshare.git
cd noteshare
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Khởi tạo database:

```bash
# Database sẽ tự động được tạo khi chạy ứng dụng lần đầu
```

4. Chạy ứng dụng:

```bash
node server.js
```

🌐 Truy cập ứng dụng tại http://localhost:4888

## 📂 Cấu trúc thư mục

```
noteshare/
├── 📁 public/          # Static files
│   ├── 📄 index.html   # Trang chủ
│   ├── 📄 share.html   # Trang chia sẻ
│   ├── 📄 error.html   # Trang lỗi
│   ├── 📄 main.js      # JavaScript
│   └── 📄 main.css     # Styles
├── 📁 uploads/         # File đính kèm
├── 📁 data/           # Database
├── 📄 server.js       # Server
├── 📄 database.js     # Database
└── 📄 README.md       # Hướng dẫn
```

## 🔌 API Endpoints

### 📝 1. Quản lý ghi chú

- `POST /api/save-note` - Tạo/cập nhật ghi chú
- `GET /api/notes` - Lấy danh sách ghi chú
- `GET /api/note/:id` - Xem chi tiết ghi chú
- `DELETE /api/note/:id` - Xóa ghi chú

### 🔗 2. Chia sẻ

- `GET /share/:shareId` - Xem ghi chú (HTML)
- `GET /api/share/:shareId` - Lấy dữ liệu (JSON)

## 🤝 Đóng góp

Chúng tôi luôn chào đón mọi đóng góp! Hãy tạo issue hoặc pull request để cải thiện NoteShare.

## 📜 Giấy phép

[MIT License](LICENSE) - Tự do sử dụng và phát triển

## 🌟 Ủng hộ dự án

Nếu bạn thấy NoteShare hữu ích, hãy:

- ⭐ Star repo này
- 🐛 Báo cáo lỗi
- 💡 Đề xuất tính năng mới
- 🔀 Fork và tạo pull request

---

<div align="center">
Made with ❤️ by <a href="https://github.com/vigstudio">VigStudio</a>
</div>
