<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ARVIX | INSTANT PRO</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@900&display=swap" rel="stylesheet">
    <style>
        body { background: #000; color: #fff; font-family: 'Tajawal', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .glass { background: rgba(15, 15, 15, 0.98); border: 1px solid #222; border-radius: 45px; }
        video { border-radius: 20px; border: 1px solid #333; width: 100%; margin-top: 15px; background: #111; }
        .shimmer { color: #38bdf8; font-weight: 900; }
    </style>
</head>
<body class="p-6">
    <div class="glass p-8 w-full max-w-sm text-center shadow-2xl">
        <h1 class="text-5xl shimmer mb-1">ARVIX</h1>
        <p class="text-gray-500 text-[9px] tracking-[0.4em] mb-10 uppercase font-bold uppercase italic">Long Video Optimized</p>

        <div id="ui-upload">
            <input type="file" id="vid" class="hidden" accept="video/*">
            <div onclick="document.getElementById('vid').click()" class="border-2 border-dashed border-sky-900/30 p-12 rounded-[35px] mb-8 bg-sky-500/5 cursor-pointer active:scale-95 transition-all">
                <span class="text-5xl block mb-4">🚀</span>
                <p class="text-sky-400 font-bold text-xs">ارفع الفيديو</p>
            </div>
            <button onclick="process()" class="w-full bg-sky-600 py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">بدء المعالجة ⚡</button>
        </div>

        <div id="ui-loading" class="hidden py-10">
            <div class="w-12 h-12 border-4 border-sky-900 border-t-sky-500 rounded-full animate-spin mx-auto mb-6"></div>
            <p class="text-sky-500 font-bold italic animate-pulse">جاري المعالجة السحابية...</p>
            <p class="text-gray-600 text-[8px] mt-2 italic">المقاطع الطويلة تأخذ وقتاً أطول على السيرفر المجاني</p>
        </div>

        <div id="ui-result" class="hidden">
            <h2 class="text-xl font-black text-green-500 mb-4 tracking-tight">اكتملت المعالجة! ✨</h2>
            <video id="player" controls playsinline></video>
            <div class="flex flex-col gap-4 mt-6">
                <a id="dl" href="#" download class="bg-white text-black block w-full py-5 rounded-2xl font-black text-xl shadow-2xl text-center">تنزيل للمستودع 📥</a>
                <button onclick="location.reload()" class="text-gray-600 text-[10px] font-bold uppercase tracking-widest">فيديو آخر</button>
            </div>
        </div>
    </div>

    <script>
        async function process() {
            const file = document.getElementById('vid').files[0];
            if (!file) return;

            document.getElementById('ui-upload').classList.add('hidden');
            document.getElementById('ui-loading').classList.remove('hidden');

            const formData = new FormData();
            formData.append('video', file);

            try {
                const res = await fetch('/process', { method: 'POST', body: formData });
                const data = await res.json();
                
                if (data.downloadUrl) {
                    const player = document.getElementById('player');
                    player.src = data.downloadUrl;
                    document.getElementById('dl').href = data.downloadUrl;
                    document.getElementById('ui-loading').classList.add('hidden');
                    document.getElementById('ui-result').classList.remove('hidden');
                }
            } catch (e) {
                alert("حدث خطأ، حاول مرة أخرى.");
                location.reload();
            }
        }
    </script>
</body>
</html>
