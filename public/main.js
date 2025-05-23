let allNotes = [];
$(document).ready(function () {
    let uploadedFiles = [];
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function (tag) {
            const chars = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return chars[tag] || tag;
        });
    }
    $('#noteText').on('paste', function (e) {
        e.preventDefault();
        let text = (e.originalEvent || e).clipboardData.getData('text');
        document.execCommand('insertText', false, text);
    });
    document.addEventListener('paste', function (e) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                handleFile(file);
            }
        }
    });
    const pasteArea = document.getElementById('pasteArea');
    pasteArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.backgroundColor = '#e9ecef';
    });
    pasteArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.style.backgroundColor = '#f8f9fa';
    });
    pasteArea.addEventListener('drop', function (e) {
        e.preventDefault();
        this.style.backgroundColor = '#f8f9fa';
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            handleFile(files[i]);
        }
    });
    pasteArea.addEventListener('click', function () {
        document.getElementById('files').click();
    });
    $('#files').change(function () {
        Array.from(this.files).forEach(file => {
            handleFile(file);
        });
    });
    function handleFile(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileId = Date.now() + '-' + file.name;
                uploadedFiles.push({
                    id: fileId,
                    file: file
                });
                $('#fileList').append(`
                    <div class="file-item" data-id="${fileId}">
                        <img src="${e.target.result}" class="preview-image" alt="${file.name}">
                        <div class="file-name">${file.name}</div>
                        <span class="remove-file" onclick="removeFile('${fileId}')">&times;</span>
                    </div>
                `);
            };
            reader.readAsDataURL(file);
        } else {
            const fileId = Date.now() + '-' + file.name;
            uploadedFiles.push({
                id: fileId,
                file: file
            });
            $('#fileList').append(`
                <div class="file-item" data-id="${fileId}">
                    <span class="file-icon"><i class="fas fa-file"></i></span>
                    <div class="file-name">${file.name}</div>
                    <span class="remove-file" onclick="removeFile('${fileId}')">&times;</span>
                </div>
            `);
        }
    }
    window.removeFile = function (fileId) {
        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
        $(`.file-item[data-id="${fileId}"]`).remove();
    };
    $('#noteForm').submit(function (e) {
        e.preventDefault();
        $('#loadingOverlay').css('display','flex');
        const formData = new FormData();
        formData.append('noteName', $('#noteName').val());
        formData.append('noteText', $('#noteText').val());
        formData.append('securityCode', localStorage.getItem('securityCode') || '');
        uploadedFiles.forEach(file => {
            formData.append('files', file.file);
        });
        $.ajax({
            url: '/api/save-note',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $('#loadingOverlay').hide();
                alert('Lưu ghi chú thành công!');
                loadNotes();
                $('#noteForm')[0].reset();
                $('#fileList').empty();
                uploadedFiles = [];
            },
            error: function () {
                $('#loadingOverlay').hide();
                alert('Có lỗi xảy ra khi lưu ghi chú!');
            }
        });
    });
    function loadNotes() {
        $.get('/api/notes', { securityCode: localStorage.getItem('securityCode') || '' }, function (notes) {
            const notesList = $('#notesList');
            notesList.empty();
            allNotes = notes;
            notes.forEach(note => {
                let shortContent = note.content.length > 100 ? escapeHTML(note.content.substring(0, 100)) + '...' : escapeHTML(note.content);
                notesList.append(`
                    <div class="note-item">
                        <div class="d-flex justify-content-between align-items-start">
                            <div style="flex:1;min-width:0;">
                                <h5 class="mb-0">${escapeHTML(note.title)}</h5>
                                <span class="note-time">${new Date(note.created_at).toLocaleString()}</span>
                            </div>
                            <div class="note-actions">
                                <button class="btn btn-sm btn-info" title="Đính kèm" onclick="showAttachments(${note.id})">
                                    <i class="fas fa-paperclip"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary" title="Xem chi tiết" onclick="viewNoteById(${note.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-success" title="Tải file .txt" onclick="downloadNoteTxt(${note.id})">
                                    <i class="fas fa-file-download"></i>
                                </button>
                                <button class="btn btn-sm btn-warning" title="Chia sẻ" onclick="shareNoteModal('${note.share_id}')">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" title="Xóa ghi chú" onclick="deleteNote(${note.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="note-content mt-1">${shortContent}</div>
                        <div class="attachments-list" id="attachments-${note.id}" style="display: none;"></div>
                    </div>
                `);
            });
        });
    }
    loadNotes();
    window.showAttachments = function (noteId) {
        const attachmentsList = $(`#attachments-${noteId}`);
        if (attachmentsList.is(':visible')) {
            attachmentsList.hide();
            return;
        }
        $.get(`/api/note/${noteId}`, function (note) {
            attachmentsList.empty();
            if (note.attachments && note.attachments.length > 0) {
                note.attachments.forEach(attachment => {
                    let name = attachment.originalName;
                    if (name.length > 18) {
                        name = name.substring(0, 7) + '...' + name.substring(name.length - 8);
                    }
                    attachmentsList.append(`
                        <div class="d-flex align-items-center mb-1" style="gap:8px;">
                            <span style="font-size:1.2rem;color:#1976d2;"><i class="fas fa-file"></i></span>
                            <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;" title="${attachment.originalName}">${name}</span>
                            <a href="/uploads/${attachment.filename}" class="btn btn-sm btn-primary btn-download-attach ms-2" title="Tải về" download>
                                <i class="fas fa-download"></i>
                            </a>
                        </div>
                    `);
                });
            } else {
                attachmentsList.append('<div class="text-muted">Không có file đính kèm</div>');
            }
            attachmentsList.show();
        });
    };
    window.deleteNote = function (noteId) {
        if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            $.ajax({
                url: `/api/note/${noteId}`,
                type: 'DELETE',
                success: function () {
                    loadNotes();
                },
                error: function () {
                    alert('Có lỗi xảy ra khi xóa ghi chú!');
                }
            });
        }
    };
    function escapeHTMLModal(str) {
        return str.replace(/[&<>"']/g, function (tag) {
            const chars = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return chars[tag] || tag;
        });
    }
    window.viewNoteById = function (id) {
        const note = allNotes.find(n => n.id == id);
        if (note) {
            $('#modalNoteTitle').text(note.title);
            // Render nội dung thành từng dòng có số thứ tự
            const lines = (note.content || '').split('\n');
            let html = '<div class="note-lines">';
            for (let i = 0; i < lines.length; i++) {
                html += `<div class='note-line'><span class='note-linenum'>${i+1}</span>${escapeHTMLModal(lines[i])}</div>`;
            }
            html += '</div>';
            $('#modalNoteContent').html(html);
            const modal = new bootstrap.Modal(document.getElementById('viewNoteModal'));
            modal.show();
        }
    }
    // Thêm chức năng tải file .txt từ modal
    $(document).on('click', '#downloadTxtBtn', function() {
        const title = $('#modalNoteTitle').text();
        const content = $('#modalNoteContent').text();
        const blob = new Blob([title + "\n\n" + content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = (title || 'note') + '.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    // Thêm chức năng tải file .txt cho từng note ngoài danh sách
    window.downloadNoteTxt = function(id) {
        const note = allNotes.find(n => n.id == id);
        if (note) {
            const blob = new Blob([
                (note.title || 'note') + "\n\n" + note.content
            ], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = (note.title || 'note') + '.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    // Ẩn app, show modal nhập mã nếu chưa có mã
    if (!localStorage.getItem('securityCode')) {
        $('#mainApp').hide();
        const modal = new bootstrap.Modal(document.getElementById('securityCodeModal'));
        modal.show();
    } else {
        $('#mainApp').show();
    }
    $('#securityCodeBtn').click(function() {
        const code = $('#securityCodeInput').val().trim();
        if (code.length < 3) {
            $('#securityCodeError').show();
            return;
        }
        localStorage.setItem('securityCode', code);
        $('#securityCodeError').hide();
        $('#mainApp').show();
        const modal = bootstrap.Modal.getInstance(document.getElementById('securityCodeModal'));
        modal.hide();
        loadNotes();
    });
    $('#securityCodeInput').keypress(function(e){
        if(e.which === 13) $('#securityCodeBtn').click();
    });
    // Nút đổi mã bảo mật
    $('#changeSecurityCodeBtn').click(function() {
        localStorage.removeItem('securityCode');
        location.reload();
    });
    window.shareNoteModal = function(shareId) {
        const url = `${window.location.origin}/share/${shareId}`;
        $('#shareNoteLink').html(`<b>Link:</b> <a href="${url}" target="_blank">${url}</a>`);
        $('#shareNoteQR').empty();
        new QRCode(document.getElementById('shareNoteQR'), {
            text: url,
            width: 180,
            height: 180
        });
        const modal = new bootstrap.Modal(document.getElementById('shareNoteModal'));
        modal.show();
    }
}); 