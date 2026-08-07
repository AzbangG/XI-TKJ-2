# XI TKJ 2 — versi Supabase (login lokal)

## Struktur

- `index.html` — daftar siswa (dinamis dari Supabase)
- `siswa.html` — **1 halaman** detail siswa untuk semua siswa, data dimuat lewat `?slug=nama-siswa`
- `login.html` — login (akun diatur manual, bukan Supabase Auth)
- `tugas.html` — daftar tugas, admin bisa tambah/hapus
- `jadwal.html`, `piket.html`, `info.html` — udah dipasangin navbar atas/bawah yang sama
- `css/base.css` — style lama (dipindah dari `style.css`)
- `css/app.css` — style komponen baru (form, kartu, modal, tugas)
- `css/login.css` — style halaman login
- `js/accounts.js` — **daftar akun login** (username, password, role, slug siswa)
- `js/auth.js` — cek login ke `accounts.js`, simpan status ke `sessionStorage`
- `js/nav.js` — navbar bersama (jam, tema, status login, guard wajib login)
- `sql/schema.sql` — tabel + RLS (tulis dibuka, gate login di JS) + storage bucket
- `sql/seed_students.sql` — data 30 siswa lama, hasil extract otomatis
- `sql/migrate_local_accounts.sql` — **jalankan ini kalau sebelumnya udah pernah pakai skema versi Supabase Auth**, buat buka akses tulis

## Setup Supabase (gratis)

1. Buat project baru di https://supabase.com (atau pakai yang udah ada)
2. Buka **SQL Editor**:
   - Project baru → jalankan `sql/schema.sql`
   - Project yang sebelumnya udah pernah pakai versi Supabase Auth → jalankan `sql/migrate_local_accounts.sql` aja
3. Jalankan isi `sql/seed_students.sql` kalau data siswa belum ada
4. Buka **Storage**, pastikan bucket `media` ada dan public
5. Buka **Project Settings > API**, salin `Project URL` dan `anon public key` ke `js/supabaseClient.js`

## Akun login

Login **gak lagi** pakai Supabase Auth — semua akun diatur langsung di `js/accounts.js`:

```js
export const ACCOUNTS = [
    { username: 'guru', password: 'guru123', role: 'admin' },
    { username: 'muhamad-abi-fadilah', password: 'muhamad-abi-fadilah', role: 'user', slug: 'muhamad-abi-fadilah' },
    // ...30 siswa lainnya, password default = username
];
```

- Mau ganti password / username siswa → tinggal edit langsung baris itu di file, gak perlu ke dashboard Supabase
- `slug` di tiap akun siswa **harus sama persis** dengan kolom `slug` di tabel `students` — itu yang nentuin siswa itu boleh edit data siswa yang mana
- **Default password sama dengan username** — sebelum dipakai beneran, ganti dulu password-nya biar gak gampang ketebak

⚠️ **Catatan keamanan**: karena login sekarang cuma di sisi tampilan (bukan di database), siapa aja yang tau `anon key` Supabase (yang emang nempel di kode frontend) bisa akses API-nya langsung tanpa lewat form login. Cukup aman buat website kelas yang gak nyimpen data sensitif, tapi bukan level keamanan production.

## Guest / tanpa login

Ada tombol "masuk sebagai tamu" di halaman login — bisa liat-liat semua halaman tanpa akun, tapi gak ada tombol edit/tambah/hapus yang muncul.

## Deploy gratis

- **Vercel**: import folder ini sebagai static project (tanpa build command)
- **GitHub Pages**: push folder ini ke repo, aktifkan Pages dari branch `main`

## Yang belum dikerjain

`Games/` masih pakai kode lama. Kasih tau kalau mau itu juga dirapihin.
