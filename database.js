const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Tạo thư mục data nếu chưa tồn tại
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'notes.db');
const db = new sqlite3.Database(dbPath);

// Khởi tạo database
db.serialize(() => {
    // Bảng notes
    db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        security_code TEXT NOT NULL,
        share_id TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bảng attachments
    db.run(`CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        note_id INTEGER NOT NULL,
        original_name TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
    )`);
});

// Hàm tạo note mới
function randomShareId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function createNote(title, content, attachments = [], securityCode = '') {
    return new Promise((resolve, reject) => {
        const shareId = randomShareId(10);
        db.run(
            'INSERT INTO notes (title, content, security_code, share_id) VALUES (?, ?, ?, ?)',
            [title, content, securityCode, shareId],
            function(err) {
                if (err) {
                    reject(err);
                    return;
                }

                const noteId = this.lastID;
                if (attachments.length === 0) {
                    resolve({ id: noteId, title, content, attachments: [] });
                    return;
                }

                // Thêm các file đính kèm
                const stmt = db.prepare(
                    'INSERT INTO attachments (note_id, original_name, file_name, file_type) VALUES (?, ?, ?, ?)'
                );

                attachments.forEach(attachment => {
                    stmt.run([
                        noteId,
                        attachment.originalname,
                        attachment.filename,
                        attachment.mimetype
                    ]);
                });

                stmt.finalize();
                resolve({ id: noteId, title, content, attachments });
            }
        );
    });
}

// Hàm lấy danh sách notes
function getNotes(securityCode = '') {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT n.*, 
                   a.id as attachment_id,
                   a.original_name as attachment_original_name,
                   a.file_name as attachment_file_name,
                   a.file_type as attachment_file_type
            FROM notes n
            LEFT JOIN attachments a ON n.id = a.note_id
            WHERE n.security_code = ?
            ORDER BY n.created_at DESC
        `, [securityCode], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const notesMap = new Map();
            
            rows.forEach(row => {
                if (!notesMap.has(row.id)) {
                    notesMap.set(row.id, {
                        id: row.id,
                        title: row.title,
                        content: row.content,
                        created_at: row.created_at,
                        share_id: row.share_id,
                        attachments: []
                    });
                }

                if (row.attachment_id) {
                    const note = notesMap.get(row.id);
                    note.attachments.push({
                        id: row.attachment_id,
                        originalName: row.attachment_original_name,
                        filename: row.attachment_file_name,
                        fileType: row.attachment_file_type
                    });
                }
            });

            resolve(Array.from(notesMap.values()));
        });
    });
}

// Hàm lấy thông tin note
function getNote(id) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT n.*, 
                   a.id as attachment_id,
                   a.original_name as attachment_original_name,
                   a.file_name as attachment_file_name,
                   a.file_type as attachment_file_type
            FROM notes n
            LEFT JOIN attachments a ON n.id = a.note_id
            WHERE n.id = ?
        `, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length === 0) {
                resolve(null);
                return;
            }

            const note = {
                id: rows[0].id,
                title: rows[0].title,
                content: rows[0].content,
                created_at: rows[0].created_at,
                share_id: rows[0].share_id,
                attachments: []
            };

            rows.forEach(row => {
                if (row.attachment_id) {
                    note.attachments.push({
                        id: row.attachment_id,
                        originalName: row.attachment_original_name,
                        filename: row.attachment_file_name,
                        fileType: row.attachment_file_type
                    });
                }
            });

            resolve(note);
        });
    });
}

// Hàm xóa note
function deleteNote(id) {
    return new Promise((resolve, reject) => {
        // Lấy danh sách file đính kèm trước khi xóa
        db.all('SELECT file_name FROM attachments WHERE note_id = ?', [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            // Xóa file vật lý
            rows.forEach(row => {
                const filePath = path.join(__dirname, 'uploads', row.file_name);
                if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, () => {});
                }
            });
            // Xóa note và các file đính kèm trong db
            db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes > 0);
            });
        });
    });
}

function getNoteByShareId(shareId) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT n.*, 
                   a.id as attachment_id,
                   a.original_name as attachment_original_name,
                   a.file_name as attachment_file_name,
                   a.file_type as attachment_file_type
            FROM notes n
            LEFT JOIN attachments a ON n.id = a.note_id
            WHERE n.share_id = ?
        `, [shareId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0) {
                resolve(null);
                return;
            }
            const note = {
                id: rows[0].id,
                title: rows[0].title,
                content: rows[0].content,
                created_at: rows[0].created_at,
                share_id: rows[0].share_id,
                attachments: []
            };
            rows.forEach(row => {
                if (row.attachment_id) {
                    note.attachments.push({
                        id: row.attachment_id,
                        originalName: row.attachment_original_name,
                        filename: row.attachment_file_name,
                        fileType: row.attachment_file_type
                    });
                }
            });
            resolve(note);
        });
    });
}

module.exports = {
    createNote,
    getNotes,
    getNote,
    deleteNote,
    getNoteByShareId
}; 