import { supabase } from './supabaseClient.js';
import { initNav } from './nav.js';

const grid = document.getElementById('siswaGrid');
const socialLinks = document.getElementById('socialLinks');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');

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

async function loadSiteConfig() {
    const { data } = await supabase.from('site_config').select('*').eq('id', 1).single();
    if (!data) return;

    if (data.background_url) {
        document.body.style.backgroundImage = `url(${data.background_url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }

    const links = [];
    if (data.instagram_url) links.push(`<a href="${data.instagram_url}" target="_blank">Instagram</a>`);
    if (data.tiktok_url) links.push(`<a href="${data.tiktok_url}" target="_blank">TikTok</a>`);
    socialLinks.innerHTML = links.length ? links.join(' &middot; ') : 'Anak X TKJ 3 Bangun Nusantara';

    document.getElementById('cfgBackground').value = data.background_url || '';
    document.getElementById('cfgInstagram').value = data.instagram_url || '';
    document.getElementById('cfgTiktok').value = data.tiktok_url || '';
}

document.getElementById('cfgSave').addEventListener('click', async () => {
    const { error } = await supabase.from('site_config').update({
        background_url: document.getElementById('cfgBackground').value.trim(),
        instagram_url: document.getElementById('cfgInstagram').value.trim(),
        tiktok_url: document.getElementById('cfgTiktok').value.trim(),
        updated_at: new Date().toISOString(),
    }).eq('id', 1);

    if (error) { alert('Gagal menyimpan: ' + error.message); return; }
    settingsModal.classList.remove('open');
    loadSiteConfig();
});

document.getElementById('cfgCancel').addEventListener('click', () => {
    settingsModal.classList.remove('open');
});

settingsBtn.addEventListener('click', () => settingsModal.classList.add('open'));

(async () => {
    const profile = await initNav();
    if (!profile) return;

    if (profile?.role === 'admin') {
        settingsBtn.classList.remove('hidden');
    }

    await loadSiteConfig();
    await loadSiswa();
})();
