import { ACCOUNTS } from './accounts.js';

const AUTH_KEY = 'bantara_auth';

export function login(username, password) {
    const uname = username.trim().toLowerCase();
    const account = ACCOUNTS.find(a => a.username.toLowerCase() === uname && a.password === password);
    if (!account) return false;

    sessionStorage.setItem(AUTH_KEY, JSON.stringify({
        username: account.username,
        role: account.role,
        slug: account.slug || null,
    }));
    return true;
}

export async function getSessionProfile() {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return { session: null, profile: null };

    try {
        const profile = JSON.parse(raw);
        return { session: profile, profile };
    } catch {
        return { session: null, profile: null };
    }
}

export function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}
