// Daftar akun login — atur manual di sini, gak lewat Supabase Auth.
// username & password bebas diganti, role: 'admin' (guru) atau 'user' (siswa)
// slug WAJIB sama persis kayak slug di tabel students (buat nentuin siswa mana yang boleh diedit)
export const ACCOUNTS = [
    { username: 'guru', password: 'guru123', role: 'admin' },

    { username: 'muhamad-abi-fadilah', password: 'muhamad-abi-fadilah', role: 'user', slug: 'muhamad-abi-fadilah' }, // Muhamad Abi Fadilah
    { username: 'aditya-pratama-suhendi', password: 'aditya-pratama-suhendi', role: 'user', slug: 'aditya-pratama-suhendi' }, // Aditya Pratama Suhendi
    { username: 'aldiansyah', password: 'aldiansyah', role: 'user', slug: 'aldiansyah' }, // Aldiansyah
    { username: 'alfian-aditiansyah', password: 'alfian-aditiansyah', role: 'user', slug: 'alfian-aditiansyah' }, // Alfian Aditiansyah
    { username: 'arga-fazri-ramadhan', password: 'arga-fazri-ramadhan', role: 'user', slug: 'arga-fazri-ramadhan' }, // Arga Fazri Ramadhan
    { username: 'muhamad-arif-kurniawan', password: 'muhamad-arif-kurniawan', role: 'user', slug: 'muhamad-arif-kurniawan' }, // Muhamad Arif Kurniawan
    { username: 'axelle-ashwan-finnegan', password: 'axelle-ashwan-finnegan', role: 'user', slug: 'axelle-ashwan-finnegan' }, // Axelle Ashwan Finnegan
    { username: 'abdullah-khaerul-azzam', password: 'abdullah-khaerul-azzam', role: 'user', slug: 'abdullah-khaerul-azzam' }, // Abdullah Khaerul Azzam
    { username: 'bagus-putra-ramadhan', password: 'bagus-putra-ramadhan', role: 'user', slug: 'bagus-putra-ramadhan' }, // Bagus Putra Ramadhan
    { username: 'bayu-lutfiadi', password: 'bayu-lutfiadi', role: 'user', slug: 'bayu-lutfiadi' }, // Bayu Lutfiadi
    { username: 'farel-fadilah', password: 'farel-fadilah', role: 'user', slug: 'farel-fadilah' }, // Farel Fadilah
    { username: 'farrel-surya-ramadhan', password: 'farrel-surya-ramadhan', role: 'user', slug: 'farrel-surya-ramadhan' }, // Farrel Surya Ramadhan
    { username: 'muhamad-alfazar', password: 'muhamad-alfazar', role: 'user', slug: 'muhamad-alfazar' }, // Muhamad Alfazar
    { username: 'garrick-elbert-chandra', password: 'garrick-elbert-chandra', role: 'user', slug: 'garrick-elbert-chandra' }, // Garrick Elbert Chandra
    { username: 'haikal-fadillah', password: 'haikal-fadillah', role: 'user', slug: 'haikal-fadillah' }, // Haikal Fadillah
    { username: 'muhamad-hajik', password: 'muhamad-hajik', role: 'user', slug: 'muhamad-hajik' }, // Muhamad Hajik
    { username: 'ihram-maqil-ghaisan', password: 'ihram-maqil-ghaisan', role: 'user', slug: 'ihram-maqil-ghaisan' }, // Ihram Maqil Ghaisan
    { username: 'isabil-nuh-ardiansiah', password: 'isabil-nuh-ardiansiah', role: 'user', slug: 'isabil-nuh-ardiansiah' }, // Isabil Nuh Ardiansiah
    { username: 'margianto', password: 'margianto', role: 'user', slug: 'margianto' }, // Margianto
    { username: 'muhammad-nabil', password: 'muhammad-nabil', role: 'user', slug: 'muhammad-nabil' }, // Muhammad Nabil
    { username: 'nadja-mudin-al-ayyuby-nasution', password: 'nadja-mudin-al-ayyuby-nasution', role: 'user', slug: 'nadja-mudin-al-ayyuby-nasution' }, // Nadja Mudin Al Ayyuby Nasution
    { username: 'muhammad-fahrel-narwis', password: 'muhammad-fahrel-narwis', role: 'user', slug: 'muhammad-fahrel-narwis' }, // Muhammad Fahrel Narwis
    { username: 'raditya-ilham-pratama', password: 'raditya-ilham-pratama', role: 'user', slug: 'raditya-ilham-pratama' }, // Raditya Ilham Pratama
    { username: 'rasya-putra-bulivar', password: 'rasya-putra-bulivar', role: 'user', slug: 'rasya-putra-bulivar' }, // Rasya Putra Bulivar
    { username: 'ridho-yudi-al-khafiz', password: 'ridho-yudi-al-khafiz', role: 'user', slug: 'ridho-yudi-al-khafiz' }, // Ridho Yudi Al Khafiz
    { username: 'abdul-rohim', password: 'abdul-rohim', role: 'user', slug: 'abdul-rohim' }, // Abdul Rohim
    { username: 'sendy-arkana-bahrudin', password: 'sendy-arkana-bahrudin', role: 'user', slug: 'sendy-arkana-bahrudin' }, // Sendy Arkana Bahrudin
    { username: 'vincent', password: 'vincent', role: 'user', slug: 'vincent' }, // Vincent
    { username: 'muhammad-zaky-muzakir', password: 'muhammad-zaky-muzakir', role: 'user', slug: 'muhammad-zaky-muzakir' }, // Muhammad Zaky Muzakir
    { username: 'ahmad-zaky-munawar', password: 'ahmad-zaky-munawar', role: 'user', slug: 'ahmad-zaky-munawar' }, // Ahmad Zaky Munawar
];
