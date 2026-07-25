import { supabase } from './supabaseClient.js';
import { getSessionProfile, renderNavUser } from './auth.js';

const card = document.getElementById('detailCard');
const bgMusic = document.getElementById('bgMusic');

const slug = new URLSearchParams(window.location.search).get('slug');

let student = null;
let profile = null;
let canEdit = false;

function fieldRow(label, key, value, editable) {
    const display = value || '-';
    if (!editable) {
        return `<div class="detail-row"><b>${label}:</b> <span>${display}</span></div>`;
    }
    return `
        <div class="detail-row" data-field="${key}">
            <b>${label}:</b>
            <span class="view-mode">${display}</span>
            <input class="edit-mode hidden" data-key="${key}" value="${value || ''}">
        </div>
    `;
}

function render() {
    if (!student) {
        card.innerHTML = '<p>Siswa tidak ditemukan.</p>';
        return;
    }

    document.getElementById('pageTitle').textContent = `Detail ${student.nama} - X TKJ 3`;

    if (student.background_url) {
        document.body.style.backgroundImage = `url(${student.background_url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }

    if (student.music_url) {
        bgMusic.src = student.music_url;
    }

    card.innerHTML = `
        <img id="photoPreview" class="detail-photo" src="${student.foto_url || 'Images/Siswa/default.jpg'}"
             onerror="this.src='Images/Siswa/default.jpg'">
        <h2>${student.nama}</h2>

        ${fieldRow('Absen', 'absen', student.absen, false)}
        ${fieldRow('Kelas', 'kelas', student.kelas, false)}
        ${fieldRow('Alamat', 'alamat', student.alamat, canEdit)}
        ${fieldRow('Tanggal Lahir', 'tanggal_lahir', student.tanggal_lahir, canEdit)}
        ${fieldRow('Hobi', 'hobi', student.hobi, canEdit)}
        ${fieldRow('Cita-cita', 'cita_cita', student.cita_cita, canEdit)}

        ${canEdit ? `
        <div id="uploadFields" class="hidden">
            <div class="field"><label>Ganti Foto</label><input type="file" id="fotoFile" accept="image/*"></div>
            <div class="field"><label>Ganti Background</label><input type="file" id="bgFile" accept="image/*"></div>
            <div class="field"><label>Ganti Musik Background</label><input type="file" id="musicFile" accept="audio/*"></div>
        </div>
        <div class="edit-actions">
            <button id="editBtn" class="btn btn-edit">✏️ Edit</button>
            <button id="saveBtn" class="btn btn-save hidden">💾 Simpan</button>
            <button id="cancelBtn" class="btn btn-cancel hidden">Batal</button>
        </div>
        ` : ''}

        ${student.music_url ? `<button id="playMusicBtn" class="nav-btn" style="margin-top:14px;">▶️ Putar Musik</button>` : ''}

        <a href="index.html" class="back-link">← Kembali ke daftar siswa</a>
    `;

    if (student.music_url) {
        document.getElementById('playMusicBtn').addEventListener('click', () => {
            bgMusic.paused ? bgMusic.play() : bgMusic.pause();
        });
    }

    if (canEdit) bindEditHandlers();
}

function bindEditHandlers() {
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const uploadFields = document.getElementById('uploadFields');

    editBtn.addEventListener('click', () => {
        document.querySelectorAll('.view-mode').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.edit-mode').forEach(el => el.classList.remove('hidden'));
        uploadFields.classList.remove('hidden');
        editBtn.classList.add('hidden');
        saveBtn.classList.remove('hidden');
        cancelBtn.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => render());

    saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Menyimpan...';

        const updates = {};
        document.querySelectorAll('.edit-mode').forEach(input => {
            updates[input.dataset.key] = input.value.trim();
        });

        const fotoFile = document.getElementById('fotoFile').files[0];
        const bgFile = document.getElementById('bgFile').files[0];
        const musicFile = document.getElementById('musicFile').files[0];

        try {
            if (fotoFile) updates.foto_url = await uploadMedia(fotoFile, 'foto');
            if (bgFile) updates.background_url = await uploadMedia(bgFile, 'background');
            if (musicFile) updates.music_url = await uploadMedia(musicFile, 'musik');
        } catch (err) {
            alert('Gagal upload file: ' + err.message);
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Simpan';
            return;
        }

        const { error } = await supabase.from('students').update(updates).eq('id', student.id);

        if (error) {
            alert('Gagal menyimpan: ' + error.message);
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Simpan';
            return;
        }

        await loadStudent();
        render();
    });
}

async function uploadMedia(file, kind) {
    const ext = file.name.split('.').pop();
    const path = `${student.slug}/${kind}.${ext}`;

    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
}

async function loadStudent() {
    const { data, error } = await supabase.from('students').select('*').eq('slug', slug).single();
    if (error) {
        student = null;
        return;
    }
    student = data;
}

(async () => {
    if (!slug) {
        card.innerHTML = '<p>Slug siswa tidak ditemukan di URL.</p>';
        return;
    }

    const result = await getSessionProfile();
    profile = result.profile;
    renderNavUser(profile);

    await loadStudent();

    if (student && profile) {
        canEdit = profile.role === 'admin' || profile.student_id === student.id;
    }

    render();
})();
