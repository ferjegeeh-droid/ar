const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// إنشاء مجلدات العمل إذا لم تكن موجودة
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('public')) fs.mkdirSync('public');

// إعداد مكان حفظ الملفات المرفوعة
const upload = multer({ dest: 'uploads/' });

// خدمة الملفات من مجلد public
app.use(express.static('public'));

// --- هذا الجزء هو الحل لمشكلة "Cannot GET /" ---
// إذا طلب المستخدم الصفحة الرئيسية، نرسل له ملف index.html
app.get('/', (req, res) => {
    // يحاول السيرفر البحث عن الملف في المجلد الرئيسي أو داخل public
    let indexPath = path.join(__dirname, 'public', 'index.html');
    if (!fs.existsSync(indexPath)) {
        indexPath = path.join(__dirname, 'index.html');
    }
    res.sendFile(indexPath);
});

app.post('/process', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'لا يوجد ملف' });

    const inputPath = req.file.path;
    const outputName = `processed_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'public', outputName);

    // أمر FFmpeg لمعالجة الفيديو
    const command = `ffmpeg -itsscale 2 -i ${inputPath} -c copy ${outputPath}`;

    exec(command, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'خطأ في المعالجة' });
        }
        res.json({ downloadUrl: `/${outputName}` });
        fs.unlink(inputPath, () => {});
    });
});

app.listen(port, () => console.log(`ARVIX PRO running on port ${port}`));
