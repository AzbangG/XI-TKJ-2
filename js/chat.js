import { supabase } from './supabaseClient.js';
import { initNav } from './nav.js';
import { ACCOUNTS } from './accounts.js';

const messagesEl = document.getElementById('chatMessages');
const form = document.getElementById('chatForm');
const input = document.getElementById('chatInput');
const guestNotice = document.getElementById('chatGuestNotice');

let profile = null;
const avatarMap = {}; // username -> foto_url

async function loadAvatars() {
    const slugToUsername = {};
    ACCOUNTS.forEach(a => { if (a.slug) slugToUsername[a.slug] = a.username; });

    const slugs = Object.keys(slugToUsername);
    if (!slugs.length) return;

    const { data, error } = await supabase.from('students').select('slug, foto_url').in('slug', slugs);
    if (error || !data) return;

    data.forEach(s => {
        if (s.foto_url) avatarMap[slugToUsername[s.slug]] = s.foto_url;
    });
}

function avatarFor(username) {
    return avatarMap[username] || 'Images/Icon/User.png';
}

function formatTime(iso) {
    const d = new Date(iso);
    try {
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function canDelete(msg) {
    if (!profile || !profile.username) return false;
    return profile.role === 'admin' || msg.sender_username === profile.username;
}

function bubbleHtml(msg) {
    const isOwn = profile && msg.sender_username === profile.username;
    const showDelete = canDelete(msg);
    const avatarImg = `<img src="${avatarFor(msg.sender_username)}" class="chat-avatar" alt="" width="32" height="32" onerror="this.onerror=null;this.src='Images/Icon/User.png';">`;

    return `
        <div class="chat-bubble-row ${isOwn ? 'own' : 'other'}" data-id="${msg.id}">
            ${!isOwn ? avatarImg : ''}
            <div class="chat-bubble-col">
                <div class="chat-sender">${escapeHtml(msg.sender_username)}${msg.sender_role === 'admin' ? ' (Admin)' : ''}</div>
                <div class="chat-bubble">${escapeHtml(msg.isi)}</div>
                <div class="chat-meta">
                    <span class="chat-time">${formatTime(msg.created_at)}</span>
                    ${showDelete ? `<button class="chat-delete-btn" data-id="${msg.id}" type="button"><img src="Images/Icon/Trash.png" alt="Hapus" width="13" height="13"></button>` : ''}
                </div>
            </div>
            ${isOwn ? avatarImg : ''}
        </div>
    `;
}

function renderMessages(messages) {
    if (!messages.length) {
        messagesEl.innerHTML = '<p style="text-align:center;opacity:0.6;">Belum ada chat. Mulai obrolan pertama!</p>';
        return;
    }
    messagesEl.innerHTML = messages.map(bubbleHtml).join('');
    bindDeleteButtons();
    scrollToBottom();
}

function scrollToBottom() {
    requestAnimationFrame(() => {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    });
}

function bindDeleteButtons() {
    messagesEl.querySelectorAll('.chat-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const { error } = await supabase.from('messages').delete().eq('id', id);
            if (error) { alert('Gagal menghapus: ' + error.message); return; }
            document.querySelector(`.chat-bubble-row[data-id="${id}"]`)?.remove();
        });
    });
}

async function loadMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(200);

    if (error) {
        messagesEl.innerHTML = `<p style="text-align:center;">Gagal memuat chat: ${error.message}</p>`;
        return;
    }

    renderMessages(data || []);
}

function appendMessage(msg) {
    const empty = messagesEl.querySelector('p');
    if (empty) messagesEl.innerHTML = '';

    const isOwn = profile && msg.sender_username === profile.username;
    const wasNearBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 100;
    messagesEl.insertAdjacentHTML('beforeend', bubbleHtml(msg));
    bindDeleteButtons();
    if (isOwn || wasNearBottom) scrollToBottom();
}

function subscribeRealtime() {
    supabase
        .channel('messages-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            appendMessage(payload.new);
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
            document.querySelector(`.chat-bubble-row[data-id="${payload.old.id}"]`)?.remove();
        })
        .subscribe();
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isi = input.value.trim();
    if (!isi || !profile) return;

    const submitBtn = form.querySelector('.chat-send-btn');
    submitBtn.disabled = true;

    const { error } = await supabase.from('messages').insert({
        sender_username: profile.username,
        sender_role: profile.role,
        isi,
    });

    submitBtn.disabled = false;

    if (error) { alert('Gagal mengirim: ' + error.message); return; }
    input.value = '';
    input.style.height = 'auto';
    scrollToBottom();
});

input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
    }
});

(async () => {
    profile = await initNav();
    if (!profile) return;

    if (profile.username) {
        form.classList.remove('hidden');
    } else {
        guestNotice.classList.remove('hidden');
    }

    await loadAvatars();
    await loadMessages();
    subscribeRealtime();
})();
