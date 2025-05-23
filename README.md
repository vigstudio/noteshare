# NoteShare - Ứng dụng Ghi chú & Chia sẻ

NoteShare là một ứng dụng web cho phép người dùng tạo, lưu trữ và chia sẻ ghi chú một cách dễ dàng. Với giao diện thân thiện và các tính năng bảo mật, NoteShare là công cụ hoàn hảo để lưu trữ và chia sẻ thông tin.

## Tính năng chính

### 1. Quản lý ghi chú

- Tạo ghi chú mới với tiêu đề và nội dung
- Xem danh sách ghi chú với preview nội dung
- Xem chi tiết ghi chú trong modal với số dòng
- Xóa ghi chú không cần thiết
- Hỗ trợ nhập nội dung dài với textarea full-page

### 2. Đính kèm file

- Hỗ trợ đính kèm nhiều file cho mỗi ghi chú
- Hiển thị icon và tên file gọn gàng
- Tải xuống file đính kèm dễ dàng
- Tự động xóa file vật lý khi xóa ghi chú

### 3. Bảo mật

- Yêu cầu mã bảo mật để truy cập
- Mỗi mã bảo mật chỉ xem được ghi chú của riêng mình
- Lưu mã bảo mật trong localStorage để tiện sử dụng
- Có thể đổi mã bảo mật bất kỳ lúc nào

### 4. Chia sẻ ghi chú

- Mỗi ghi chú có một ID chia sẻ duy nhất
- Tạo link chia sẻ và QR code nhanh chóng
- Người nhận không cần mã bảo mật để xem ghi chú được chia sẻ
- Giao diện xem ghi chú được chia sẻ thân thiện

### 5. Giao diện người dùng

- Thiết kế hiện đại với Flat Design
- Màu sắc chủ đạo xanh dương (#1976d2)
- Font chữ Roboto dễ đọc
- Responsive trên mọi thiết bị
- Hiệu ứng loading khi thao tác
- Trang lỗi 404, 500 được thiết kế đẹp mắt

## Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js (v14 trở lên)
- NPM hoặc Yarn
- SQLite3

### Các bước cài đặt

1. Clone repository:

```bash
git clone <repository_url>
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

Ứng dụng sẽ chạy tại http://localhost:4888

## Cấu trúc thư mục

```
noteshare/
├── public/             # Static files
│   ├── index.html     # Trang chủ
│   ├── share.html     # Trang xem ghi chú được chia sẻ
│   ├── error.html     # Trang hiển thị lỗi
│   ├── main.js        # JavaScript chính
│   └── main.css       # CSS chính
├── uploads/           # Thư mục chứa file đính kèm
├── data/             # Thư mục chứa database
├── server.js         # File server chính
├── database.js       # Xử lý database
└── README.md         # Tài liệu hướng dẫn
```

## API Endpoints

### 1. Ghi chú

- `POST /api/save-note`: Tạo/cập nhật ghi chú
- `GET /api/notes`: Lấy danh sách ghi chú
- `GET /api/note/:id`: Lấy chi tiết ghi chú
- `DELETE /api/note/:id`: Xóa ghi chú

### 2. Chia sẻ

- `GET /share/:shareId`: Xem ghi chú được chia sẻ (HTML)
- `GET /api/share/:shareId`: Lấy dữ liệu ghi chú được chia sẻ (JSON)

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request nếu bạn muốn cải thiện ứng dụng.

## Giấy phép

[MIT License](LICENSE)
