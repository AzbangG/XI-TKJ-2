import { getSessionProfile, logout } from './auth.js';

const BG_IMAGES = [
    'Images/Background/1.jpg',
    'Images/Background/2.jpg',
    'Images/Background/3.jpg',
    'Images/Background/4.jpg',
    'Images/Background/5.jpg',
    'Images/Background/6.jpg',
];

const NAV_ITEMS = [
    { href: 'index.html', icon: 'Images/Icon/Siswa.png', label: 'Siswa' },
    { href: 'jadwal.html', icon: 'Images/Icon/Jadwal.png', label: 'Jadwal' },
    { href: 'piket.html', icon: 'Images/Icon/Piket.png', label: 'Piket' },
    { href: 'tugas.html', icon: 'Images/Icon/Tugas.png', label: 'Tugas' },
    { href: 'info.html', icon: 'Images/Icon/Info.png', label: 'Info' },
];

let slideshowTimer = null;

export function initBgSlideshow() {
    const root = document.getElementById('bgSlideshow');
    if (!root) return;

    root.innerHTML = '';
    if (slideshowTimer) clearInterval(slideshowTimer);

    BG_IMAGES.forEach((img, i) => {
        const slide = document.createElement('div');
        slide.className = 'bg-slide';
        slide.style.backgroundImage = `url('${img}')`;
        if (i === 0) slide.classList.add('active');
        root.appendChild(slide);
    });

    let current = 0;
    const slides = root.querySelectorAll('.bg-slide');
    if (slides.length < 2) return;

    slideshowTimer = setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 6000);
}

// Dipanggil kalau ada background custom dari admin (site_config) —
// gantiin slideshow biar background custom-nya keliatan (sebelumnya
// ketutup sama slideshow yang selalu di atas).
export function setCustomBackground(url) {
    const root = document.getElementById('bgSlideshow');
    if (!root) return;

    if (slideshowTimer) clearInterval(slideshowTimer);
    slideshowTimer = null;

    root.innerHTML = `<div class="bg-slide active" style="background-image:url('${url}')"></div>`;
}

export function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function pad2(n) { return String(n).padStart(2, '0'); }

function formatTimeFallback(now) {
    return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
}

function initClock() {
    const timeEl = document.getElementById('currentTime');
    if (!timeEl) return;

    function tick() {
        const now = new Date();
        try {
            timeEl.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            timeEl.textContent = formatTimeFallback(now);
        }
    }

    tick();
    setInterval(tick, 1000 * 15);
}

function renderTopNavUser(profile) {
    const userInfo = document.getElementById('userInfo');
    const usernameEl = document.getElementById('username');
    const loginLink = document.getElementById('loginLink');
    if (!userInfo) return;

    if (profile && profile.username) {
        const label = profile.role === 'admin' ? `${profile.username} (Admin)` : profile.username;
        usernameEl.textContent = label.charAt(0).toUpperCase() + label.slice(1);
        userInfo.style.display = 'flex';
        loginLink.style.display = 'none';
    } else {
        userInfo.style.display = 'none';
        loginLink.style.display = 'flex';
    }
}

function highlightActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#bottomNav .nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === current);
    });
}

function bottomNavHtml() {
    return NAV_ITEMS.map(n => `
        <a href="${n.href}" class="nav-item">
            <span class="nav-icon"><img src="${n.icon}" alt="${n.label}"></span>
            <span class="nav-label">${n.label}</span>
        </a>
    `).join('');
}

function topNavHtml() {
    return `
        <div class="nav-left">
            <span class="nav-clock" id="currentTime">--:--</span>
        </div>
        <div class="nav-right">
            <div class="user-info" id="userInfo" style="display:none;">
                <img src="Images/Icon/User.png" class="nav-icon-img" alt="User">
                <span class="username" id="username">User</span>
            </div>
            <a href="login.html" id="loginLink" class="icon-btn" style="display:none;">
                <img src="Images/Icon/User.png" class="nav-icon-img" alt="Login">
            </a>
            <button id="theme-toggle" class="icon-btn" type="button">
                <img src="Images/Icon/Sun.png" class="theme-icon theme-icon-sun" alt="Mode terang">
                <img src="Images/Icon/Moon.png" class="theme-icon theme-icon-moon" alt="Mode gelap">
            </button>
            <div class="more-wrap">
                <button id="moreBtn" class="icon-btn" type="button">
                    <img src="Images/Icon/More.png" class="nav-icon-img" alt="More">
                </button>
                <div id="moreDropdown" class="more-dropdown hidden">
                    <button id="settingsMenuBtn" class="dropdown-item hidden" type="button">⚙️ Pengaturan</button>
                    <button id="logoutMenuBtn" class="dropdown-item" type="button">
                        <img src="Images/Icon/Logout.png" class="dropdown-icon" alt="Logout"> Keluar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function initMoreMenu() {
    const moreBtn = document.getElementById('moreBtn');
    const dropdown = document.getElementById('moreDropdown');
    const logoutBtn = document.getElementById('logoutMenuBtn');
    if (!moreBtn || !dropdown) return;

    moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== moreBtn) {
            dropdown.classList.add('hidden');
        }
    });

    logoutBtn.addEventListener('click', logout);
}

// Dipanggil dari halaman yang punya menu pengaturan (index.html) buat
// nampilin item "Pengaturan" di dropdown more, khusus admin.
export function enableSettingsMenuItem(onClick) {
    const btn = document.getElementById('settingsMenuBtn');
    if (!btn) return;
    btn.classList.remove('hidden');
    btn.addEventListener('click', () => {
        document.getElementById('moreDropdown').classList.add('hidden');
        onClick();
    });
}

const GUEST_KEY = 'bantara_guest';

export async function initNav({ requireAuth = true } = {}) {
    const topNav = document.getElementById('topNavRoot');
    if (topNav) topNav.innerHTML = topNavHtml();

    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) bottomNav.innerHTML = bottomNavHtml();

    initBgSlideshow();
    initThemeToggle();
    initClock();
    initMoreMenu();
    highlightActiveNav();

    const { session, profile } = await getSessionProfile();
    const isGuest = sessionStorage.getItem(GUEST_KEY) === 'true';

    if (requireAuth && !session && !isGuest) {
        window.location.href = 'login.html';
        return null;
    }

    renderTopNavUser(profile);
    return profile || {};
}
