import { supabase } from './supabaseClient.js';
import { initNav } from './nav.js';

const DAYS = [
    { key: 'senin', label: 'Senin', icon: '🌅' },
    { key: 'selasa', label: 'Selasa', icon: '🌤️' },
    { key: 'rabu', label: 'Rabu', icon: '☀️' },
    { key: 'kamis', label: 'Kamis', icon: '🌥️' },
    { key: 'jumat', label: 'Jumat', icon: '🌆' },
    { key: 'sabtu', label: 'Sabtu', icon: '🌇' },
];

const grid = document.getElementById('piketGrid');
let canManage = false;
let piketData = {};

async function loadPiket() {
    const { data, error } = await supabase.from('piket').select('*').order('hari').order('urutan');

    if (error) {
        grid.innerHTML = `<p>Gagal memuat jadwal piket: ${error.message}</p>`;
        return;
    }

    piketData = {};
    DAYS.forEach(d => { piketData[d.key] = []; });
    (data || []).forEach(row => {
        if (!piketData[row.hari]) piketData[row.hari] = [];
        piketData[row.hari].push(row);
    });

    render();
    highlightToday();
}

function dayCardHtml(day) {
    const items = piketData[day.key] || [];

    return `
        <div class="day-card" data-day="${day.key}">
            <div class="day-header">
                <div class="day-name"><span class="day-icon">${day.icon}</span> ${day.label}</div>
                <div class="student-count">${items.length} orang</div>
            </div>
            <div class="students-list" data-day-list="${day.key}">
                ${items.map((it, i) => `
                    <div class="student-item">
                        <div class="student-number">${i + 1}</div>
                        <div class="student-name view-mode">${it.nama}</div>
                        <input class="student-name-input edit-mode hidden" value="${it.nama.replace(/"/g, '&quot;')}">
                        <div class="student-emoji">🧹</div>
                        ${canManage ? '<button class="remove-item edit-mode hidden" type="button">✕</button>' : ''}
                    </div>
                `).join('')}
            </div>
            ${canManage ? `
                <div class="day-edit-actions">
                    <button class="btn-add-name edit-mode hidden" type="button" data-day="${day.key}">+ Tambah</button>
                    <button class="btn-edit-day" type="button" data-day="${day.key}">✏️ Edit</button>
                    <button class="btn-save-day btn edit-mode hidden" type="button" data-day="${day.key}">💾 Simpan</button>
                </div>
            ` : ''}
        </div>
    `;
}

function render() {
    grid.innerHTML = DAYS.map(dayCardHtml).join('');
    if (canManage) bindEditHandlers();
}

function newStudentItemHtml() {
    return `
        <div class="student-item">
            <div class="student-number">•</div>
            <div class="student-name view-mode hidden"></div>
            <input class="student-name-input edit-mode" placeholder="Nama siswa">
            <div class="student-emoji">🧹</div>
            <button class="remove-item edit-mode" type="button">✕</button>
        </div>
    `;
}

function bindEditHandlers() {
    document.querySelectorAll('.btn-edit-day').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.day-card');
            card.querySelectorAll('.view-mode').forEach(el => el.classList.add('hidden'));
            card.querySelectorAll('.edit-mode').forEach(el => el.classList.remove('hidden'));
            btn.classList.add('hidden');
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.student-item').remove());
    });

    document.querySelectorAll('.btn-add-name').forEach(btn => {
        btn.addEventListener('click', () => {
            const list = document.querySelector(`[data-day-list="${btn.dataset.day}"]`);
            list.insertAdjacentHTML('beforeend', newStudentItemHtml());
            const newItem = list.lastElementChild;
            newItem.querySelector('.remove-item').addEventListener('click', () => newItem.remove());
        });
    });

    document.querySelectorAll('.btn-save-day').forEach(btn => {
        btn.addEventListener('click', async () => {
            const day = btn.dataset.day;
            const card = btn.closest('.day-card');
            const names = [...card.querySelectorAll('.student-name-input')]
                .map(input => input.value.trim())
                .filter(Boolean);

            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            const { error: delErr } = await supabase.from('piket').delete().eq('hari', day);
            if (delErr) { alert('Gagal menyimpan: ' + delErr.message); btn.disabled = false; btn.textContent = '💾 Simpan'; return; }

            if (names.length) {
                const { error: insErr } = await supabase.from('piket').insert(
                    names.map((nama, i) => ({ hari: day, nama, urutan: i }))
                );
                if (insErr) { alert('Gagal menyimpan: ' + insErr.message); btn.disabled = false; btn.textContent = '💾 Simpan'; return; }
            }

            await loadPiket();
        });
    });
}

function highlightToday() {
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const currentDay = days[new Date().getDay()];
    if (currentDay === 'minggu') return;

    const todayCard = document.querySelector(`.day-card[data-day="${currentDay}"]`);
    if (todayCard) todayCard.classList.add('today');
}

(async () => {
    const profile = await initNav();
    if (!profile) return;

    canManage = profile.role === 'admin' || profile.role === 'pengurus';

    await loadPiket();
})();
