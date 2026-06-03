const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// --- خطوة الأمان: إنشاء المجلدات تلقائياً إذا كانت ناقصة ---
const dirUploads = path.join(__dirname, 'uploads');
const dirPublic = path.join(__dirname, 'public');

if (!fs.existsSync(dirUploads)) fs.mkdirSync(dirUploads);
if (!fs.existsSync(dirPublic)) fs.mkdirSync(dirPublic);

app.use(cors());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/process', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const inputPath = req.file.path;
    const outputName = `ARVIX_PRO_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'public', outputName);

    // أمر FFmpeg المصلح (يمنع زيادة الحجم الخيالية ويحذف الصوت لضمان السرعة)
    // استخدمنا -y لإجبار الكتابة و -an لحذف الصوت و -map_metadata -1 لتصغير الحجم
    const command = `ffmpeg -y -itsscale 2 -i "${inputPath}" -c copy -map_metadata -1 -fflags +genpts -an "${outputPath}"`;

    exec(command, (err) => {
        if (err) {
            console.error('FFmpeg Error:', err);
            return res.status(500).json({ error: 'Processing failed' });
        }
        
        res.json({ downloadUrl: `/${outputName}` });

        // تنظيف الملف الأصلي
        fs.unlink(inputPath, (err) => { if(err) console.log(err); });
    });
});

app.listen(port, () => {
    console.log(`ARVIX PRO is alive on port ${port}`);
});
