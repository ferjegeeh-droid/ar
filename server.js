const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// إعداد مكان حفظ الملفات المرفوعة
const upload = multer({ dest: 'uploads/' });

app.post('/process', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'لا يوجد ملف' });

    const inputPath = req.file.path;
    const outputName = `processed_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'public', outputName);

    // كود ARVIX الحقيقي (تغيير التوقيت بضغطة زر)
    const command = `ffmpeg -itsscale 2 -i ${inputPath} -c copy ${outputPath}`;

    exec(command, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'خطأ في المعالجة' });
        }
        
        // إرسال اسم الملف للواجهة لتحميله
        res.json({ downloadUrl: `/${outputName}` });

        // حذف الملف الأصلي لتوفير المساحة
        fs.unlink(inputPath, () => {});
    });
});

app.listen(port, () => console.log(`ARVIX PRO running on port ${port}`));
