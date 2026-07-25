import { supabase } from './supabaseClient.js';

export async function getSessionProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { session: null, profile: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return { session, profile };
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

export function requireLogin(profile) {
  if (!profile) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

export function requireAdmin(profile) {
  if (!profile || profile.role !== 'admin') {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

export function renderNavUser(profile) {
  const el = document.getElementById('navUser');
  if (!el) return;

  if (!profile) {
    el.innerHTML = '<a href="login.html" class="nav-btn">Login</a>';
    return;
  }

  const badge = profile.role === 'admin' ? 'Guru/Admin' : 'Siswa';
  el.innerHTML = `
    <span class="nav-username">${profile.username} <small>(${badge})</small></span>
    <button id="logoutBtn" class="nav-btn">Keluar</button>
  `;
  document.getElementById('logoutBtn').addEventListener('click', logout);
}
