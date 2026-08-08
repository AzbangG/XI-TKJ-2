import { supabase } from './supabaseClient.js';
import { initNav, enableSettingsMenuItem, setCustomBackground, initBgSlideshow } from './nav.js';

const grid = document.getElementById('siswaGrid');
const socialLinks = document.getElementById('socialLinks');
const settingsModal = document.getElementById('settingsModal');
const bgPreview = document.getElementById('cfgBackgroundPreview');
const bgFileInput = document.getElementById('cfgBackgroundFile');

let currentBackgroundUrl = null;
let pendingRemoveBackground = false;

async function loadSiswa() {
    const { data, error } = await supabase
        .from('students')
        .select('slug, nama, foto_url, absen')
        .order('absen', { ascending: true });

    if (error) {
        grid.innerHTML = `<p>Gagal memuat data: ${error.message}</p>`;
        return;
    }

    if (!data.length) {
        grid.innerHTML = '<p>Belum ada data siswa.</p>';
        return;
    }

    grid.innerHTML = data.map(s => `
        <div class="card">
            <img src="${s.foto_url || 'Images/Siswa/default.jpg'}" alt="${s.nama}"
                 style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;"
                 onerror="this.src='Images/Siswa/default.jpg'">
            <h3 style="margin:10px 0 4px;">${s.nama}</h3>
            <p style="margin:0 0 10px; opacity:0.7;">Absen ${s.absen ?? '-'}</p>
            <a href="siswa.html?slug=${encodeURIComponent(s.slug)}" class="btn-detail">Cek Detail</a>
        </div>
    `).join('');
}

function renderBgPreview(url) {
    if (url) {
        bgPreview.src = url;
        bgPreview.classList.remove('hidden');
    } else {
        bgPreview.classList.add('hidden');
        bgPreview.src = '';
    }
}

async function loadSiteConfig() {
    const { data, error } = await supabase.from('site_config').select('*').eq('id', 1).single();

    if (error) {
        console.error('Gagal memuat pengaturan halaman:', error.message);
        return;
    }
    if (!data) return;

    currentBackgroundUrl = data.background_url || null;
    pendingRemoveBackground = false;

    if (currentBackgroundUrl) {
        setCustomBackground(currentBackgroundUrl);
    } else {
        initBgSlideshow();
    }

    const links = [];
    if (data.instagram_url) links.push(`<a href="${data.instagram_url}" target="_blank">Instagram</a>`);
    if (data.tiktok_url) links.push(`<a href="${data.tiktok_url}" target="_blank">TikTok</a>`);
    socialLinks.innerHTML = links.length ? links.join(' &middot; ') : 'Anak XI TKJ 2 Bangun Nusantara';

    renderBgPreview(currentBackgroundUrl);
    document.getElementById('cfgInstagram').value = data.instagram_url || '';
    document.getElementById('cfgTiktok').value = data.tiktok_url || '';
}

bgFileInput.addEventListener('change', () => {
    const file = bgFileInput.files[0];
    if (!file) return;
    pendingRemoveBackground = false;
    renderBgPreview(URL.createObjectURL(file));
});

document.getElementById('cfgRemoveBackground').addEventListener('click', () => {
    bgFileInput.value = '';
    pendingRemoveBackground = true;
    renderBgPreview(null);
});

document.getElementById('cfgSave').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';

    const updates = {
        instagram_url: document.getElementById('cfgInstagram').value.trim(),
        tiktok_url: document.getElementById('cfgTiktok').value.trim(),
        updated_at: new Date().toISOString(),
    };

    const file = bgFileInput.files[0];

    try {
        if (file) {
            const ext = file.name.split('.').pop();
            const path = `site/background.${ext}`;
            const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true });
            if (upErr) throw upErr;
            const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
            updates.background_url = `${pub.publicUrl}?t=${Date.now()}`;
        } else if (pendingRemoveBackground) {
            updates.background_url = null;
        }
    } catch (err) {
        alert('Gagal upload background: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Simpan';
        return;
    }

    const { error } = await supabase.from('site_config').update(updates).eq('id', 1);

    btn.disabled = false;
    btn.textContent = 'Simpan';

    if (error) { alert('Gagal menyimpan: ' + error.message); return; }

    bgFileInput.value = '';
    settingsModal.classList.remove('open');
    loadSiteConfig();
});

document.getElementById('cfgCancel').addEventListener('click', () => {
    bgFileInput.value = '';
    settingsModal.classList.remove('open');
    renderBgPreview(currentBackgroundUrl);
});

(async () => {
    const profile = await initNav();
    if (!profile) return;

    if (profile?.role === 'admin') {
        enableSettingsMenuItem(() => settingsModal.classList.add('open'));
    }

    await loadSiteConfig();
    await loadSiswa();
})();
