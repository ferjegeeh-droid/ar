const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// إنشاء المجلدات المطلوبة فوراً
const dirs = ['uploads', 'public'];
dirs.forEach(dir => {
    if (!fs.existsSync(path.join(__dirname, dir))) {
        fs.mkdirSync(path.join(__dirname, dir));
    }
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname)); // للبحث في المجلد الرئيسي أيضاً

const upload = multer({ dest: 'uploads/' });

// حل مشكلة Not Found - البحث عن ملف index.html وإرساله
app.get('/', (req, res) => {
    const paths = [
        path.join(__dirname, 'public', 'index.html'),
        path.join(__dirname, 'index.html')
    ];
    
    for (const p of paths) {
        if (fs.existsSync(p)) {
            return res.sendFile(p);
        }
    }
    res.status(404).send('خطأ: لم يتم العثور على ملف index.html في GitHub. تأكد من وجود الملف بجانب server.js');
});

app.post('/process', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const inputPath = req.file.path;
    const outputName = `ARVIX_PRO_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'public', outputName);

    // الكود البرقي المصلح (سريع + حجم صغير + بدون صوت للمقاطع الطويلة)
    const command = `ffmpeg -y -itsscale 2 -i "${inputPath}" -c copy -map_metadata -1 -fflags +genpts -an "${outputPath}"`;

    exec(command, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Processing failed' });
        }
        res.json({ downloadUrl: `/${outputName}` });
        fs.unlink(inputPath, () => {});
    });
});

app.listen(port, () => console.log(`Server is running on ${port}`));
