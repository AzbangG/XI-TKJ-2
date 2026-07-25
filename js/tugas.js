import { supabase } from './supabaseClient.js';
import { getSessionProfile, renderNavUser } from './auth.js';

const list = document.getElementById('tugasList');
const addForm = document.getElementById('addTugasForm');

let isAdmin = false;

async function loadTugas() {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('deadline', { ascending: true, nullsFirst: false });

    if (error) {
        list.innerHTML = `<p>Gagal memuat tugas: ${error.message}</p>`;
        return;
    }

    if (!data.length) {
        list.innerHTML = '<p>Belum ada tugas.</p>';
        return;
    }

    list.innerHTML = data.map(t => `
        <div class="tugas-item">
            <div>
                <h3>${t.judul}</h3>
                ${t.mapel ? `<div class="mapel">${t.mapel}</div>` : ''}
                ${t.deskripsi ? `<p>${t.deskripsi}</p>` : ''}
                ${t.deadline ? `<div class="deadline">Deadline: ${t.deadline}</div>` : ''}
            </div>
            ${isAdmin ? `<button class="btn-danger" data-id="${t.id}">Hapus</button>` : ''}
        </div>
    `).join('');

    if (isAdmin) {
        list.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Hapus tugas ini?')) return;
                const { error } = await supabase.from('tasks').delete().eq('id', btn.dataset.id);
                if (error) { alert('Gagal hapus: ' + error.message); return; }
                loadTugas();
            });
        });
    }
}

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('tasks').insert({
        judul: document.getElementById('tJudul').value.trim(),
        mapel: document.getElementById('tMapel').value.trim(),
        deskripsi: document.getElementById('tDeskripsi').value.trim(),
        deadline: document.getElementById('tDeadline').value || null,
    });

    if (error) { alert('Gagal menambah tugas: ' + error.message); return; }
    addForm.reset();
    loadTugas();
});

(async () => {
    const { profile } = await getSessionProfile();
    renderNavUser(profile);
    isAdmin = profile?.role === 'admin';
    if (isAdmin) addForm.classList.remove('hidden');
    await loadTugas();
})();
