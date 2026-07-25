import { supabase } from './supabaseClient.js';

const form = document.getElementById('loginForm');
const errEl = document.getElementById('loginError');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.style.display = 'none';

    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const email = username.includes('@') ? username : `${username}@bantara.local`;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        errEl.textContent = 'Username atau password salah.';
        errEl.style.display = 'block';
        return;
    }

    window.location.href = 'index.html';
});
