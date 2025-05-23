const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = 4888;

// Cấu hình middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route để lưu note và file đính kèm
app.post('/api/save-note', upload.array('files'), async (req, res) => {
    try {
        const { noteName, noteText, securityCode } = req.body;
        const files = req.files;
        const note = await db.createNote(noteName, noteText, files, securityCode);
        res.json({
            success: true,
            note: note
        });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ error: 'Lỗi khi lưu ghi chú' });
    }
});

// Route để lấy danh sách notes
app.get('/api/notes', async (req, res) => {
    try {
        const securityCode = req.query.securityCode || '';
        const notes = await db.getNotes(securityCode);
        res.json(notes);
    } catch (error) {
        console.error('Error getting notes:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách ghi chú' });
    }
});

// Route để lấy thông tin note
app.get('/api/note/:id', async (req, res) => {
    try {
        const note = await db.getNote(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Không tìm thấy ghi chú' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error getting note:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin ghi chú' });
    }
});

// Route để xóa note
app.delete('/api/note/:id', async (req, res) => {
    try {
        const success = await db.deleteNote(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Không tìm thấy ghi chú' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Lỗi khi xóa ghi chú' });
    }
});

// Route share note qua shareId
app.get('/share/:shareId', async (req, res) => {
    try {
        const note = await db.getNoteByShareId(req.params.shareId);
        if (!note) {
            return res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
        }
        res.sendFile(path.join(__dirname, 'public', 'share.html'));
    } catch (error) {
        console.error('Error getting shared note:', error);
        res.status(500).sendFile(path.join(__dirname, 'public', 'error.html'));
    }
});

// Route API để lấy thông tin ghi chú theo shareId
app.get('/api/share/:shareId', async (req, res) => {
    try {
        const note = await db.getNoteByShareId(req.params.shareId);
        if (!note) {
            return res.status(404).json({ error: 'Không tìm thấy ghi chú' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error getting shared note:', error);
        res.status(500).json({ error: 'Lỗi khi lấy ghi chú chia sẻ' });
    }
});

// Xử lý lỗi 404 khi không tìm thấy route
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Xử lý lỗi server
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
}); 