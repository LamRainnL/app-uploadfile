const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const app = express();

// Đường dẫn tới thư mục upload
const uploadDir = path.join('.', 'uploads');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Route để hiển thị form upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route xử lý yêu cầu upload file
app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();

    // Thiết lập thư mục lưu trữ tạm thời cho file upload
    form.uploadDir = uploadDir;

    // Xử lý file upload
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Lỗi tải File', err);
            return res.status(500).json({ error: 'Lỗi tải File' });
        }

        // Di chuyển file upload vào thư mục lưu trữ cuối cùng
        const oldPath = files.file.path;
        const newPath = path.join(uploadDir, files.file.name);
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Lỗi chuyển File', err);
                return res.status(500).json({ error: 'Lỗi chuyển File' });
            }
            // Redirect chuyển đến trang thành công
            res.redirect('/?success=true');
        });
    });
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
