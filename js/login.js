import { login } from './auth.js';
import { initBgSlideshow, initThemeToggle } from './nav.js';

const GUEST_KEY = 'bantara_guest';

const form = document.getElementById('loginForm');
const errEl = document.getElementById('errorMessage');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    errEl.classList.remove('show');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const success = login(username, password);

    if (!success) {
        errEl.textContent = 'Username atau password salah!';
        errEl.classList.add('show');
        return;
    }

    sessionStorage.removeItem(GUEST_KEY);
    window.location.href = 'index.html';
});

document.getElementById('togglePassword').addEventListener('click', () => {
    const pw = document.getElementById('password');
    pw.type = pw.type === 'password' ? 'text' : 'password';
});

document.getElementById('guestLogin').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem(GUEST_KEY, 'true');
    window.location.href = 'index.html';
});

initBgSlideshow();
initThemeToggle();
