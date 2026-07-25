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

export function initBgSlideshow() {
    const root = document.getElementById('bgSlideshow');
    if (!root) return;

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

    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 6000);
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

function formatDateFallback(now) {
    return `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
}

function formatTimeFallback(now) {
    return `${pad2(now.getHours())}.${pad2(now.getMinutes())}.${pad2(now.getSeconds())}`;
}

function initClock() {
    const dateEl = document.getElementById('currentDate');
    const timeEl = document.getElementById('currentTime');
    if (!dateEl || !timeEl) return;

    function tick() {
        const now = new Date();

        try {
            dateEl.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            dateEl.textContent = formatDateFallback(now);
        }

        try {
            timeEl.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
            timeEl.textContent = formatTimeFallback(now);
        }
    }

    tick();
    setInterval(tick, 1000);
}

function renderTopNavUser(profile) {
    const userInfo = document.getElementById('userInfo');
    const usernameEl = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');
    const loginLink = document.getElementById('loginLink');
    if (!userInfo) return;

    if (profile) {
        const label = profile.role === 'admin' ? `${profile.username} (Admin)` : profile.username;
        usernameEl.textContent = label.charAt(0).toUpperCase() + label.slice(1);
        userInfo.style.display = 'flex';
        logoutBtn.style.display = 'flex';
        loginLink.style.display = 'none';
        logoutBtn.addEventListener('click', logout);
    } else {
        userInfo.style.display = 'none';
        logoutBtn.style.display = 'none';
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

const GUEST_KEY = 'bantara_guest';

export async function initNav({ requireAuth = true } = {}) {
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) bottomNav.innerHTML = bottomNavHtml();

    initBgSlideshow();
    initThemeToggle();
    initClock();
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
