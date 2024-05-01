const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Thư mục lưu trữ file tải lên
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        // Đổi tên file để tránh trùng lặp
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

// Route để hiển thị form upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route xử lý yêu cầu upload file
app.post('/upload', upload.single('file'), (req, res) => {
    // Kiểm tra nếu file đã được tải lên thành công
    if (req.file) {
        // Sau đó, trả về phản hồi cho client
        res.redirect('/?success=true');
    } else {
        // Nếu không có file được tải lên
        res.status(400).json({ error: 'Không có file được tải lên.' });
    }
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
