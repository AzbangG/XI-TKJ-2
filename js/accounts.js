// Daftar akun login — atur manual di sini, gak lewat Supabase Auth.
// username & password bebas diganti, role: 'admin' (guru) atau 'user' (siswa)
// slug WAJIB sama persis kayak slug di tabel students (buat nentuin siswa mana yang boleh diedit)
export const ACCOUNTS = [
    { username: 'guru', password: 'guru123', role: 'admin' },

    { username: 'abdullah-khaerul-azzam', password: 'abdullah-khaerul-azzam', role: 'user', slug: 'abdullah-khaerul-azzam' }, // Abdullah Khaerul Azzam - NIS 11252070
    { username: 'abdullah-mubarok', password: 'abdullah-mubarok', role: 'user', slug: 'abdullah-mubarok' }, // Abdullah Mubarok - NIS 11252103
    { username: 'aditya-pratama-suhendi', password: 'aditya-pratama-suhendi', role: 'user', slug: 'aditya-pratama-suhendi' }, // Aditya Pratama Suhendi - NIS 11252071
    { username: 'alam-dwi-maulana', password: 'alam-dwi-maulana', role: 'user', slug: 'alam-dwi-maulana' }, // Alam Dwi Maulana - NIS 11252106
    { username: 'aldiansyah', password: 'aldiansyah', role: 'user', slug: 'aldiansyah' }, // Aldiansyah - NIS 11252073
    { username: 'arya-galing-ahmad', password: 'arya-galing-ahmad', role: 'user', slug: 'arya-galing-ahmad' }, // Arya Galing Ahmad - NIS 11252005
    { username: 'axelle-ashwan-finnegan', password: 'axelle-ashwan-finnegan', role: 'user', slug: 'axelle-ashwan-finnegan' }, // Axelle Ashwan Finnegan - NIS 11252076
    { username: 'aziz-taufik-qurohman', password: 'aziz-taufik-qurohman', role: 'user', slug: 'aziz-taufik-qurohman' }, // Aziz Taufik Qurohman - NIS 11252110
    { username: 'bayu-luthfiadi', password: 'bayu-luthfiadi', role: 'user', slug: 'bayu-luthfiadi' }, // Bayu Luthfiadi - NIS 11252078
    { username: 'cheivin-herlino-ahady-tanjung', password: 'cheivin-herlino-ahady-tanjung', role: 'user', slug: 'cheivin-herlino-ahady-tanjung' }, // Cheivin Herlino Ahady Tanjung - NIS 11252111
    { username: 'farel-fadilah', password: 'farel-fadilah', role: 'user', slug: 'farel-fadilah' }, // Farel Fadilah - NIS 11252080
    { username: 'farrel-surya-ramadhan', password: 'farrel-surya-ramadhan', role: 'user', slug: 'farrel-surya-ramadhan' }, // Farrel Surya Ramadhan - NIS 11252081
    { username: 'irsyad-khairul-anam', password: 'irsyad-khairul-anam', role: 'user', slug: 'irsyad-khairul-anam' }, // Irsyad Khairul Anam - NIS 11252044
    { username: 'kiki-febrian', password: 'kiki-febrian', role: 'user', slug: 'kiki-febrian' }, // Kiki Febrian - NIS 11252017
    { username: 'muh-iqbal', password: 'muh-iqbal', role: 'user', slug: 'muh-iqbal' }, // Muh. Iqbal - NIS 11252022
    { username: 'muhamad-alfajri', password: 'muhamad-alfajri', role: 'user', slug: 'muhamad-alfajri' }, // Muhamad Alfajri - NIS 11252020
    { username: 'muhamad-andrian-kafi', password: 'muhamad-andrian-kafi', role: 'user', slug: 'muhamad-andrian-kafi' }, // Muhamad Andrian Kafi - NIS 11252048
    { username: 'muhamad-fadil-alfatih', password: 'muhamad-fadil-alfatih', role: 'user', slug: 'muhamad-fadil-alfatih' }, // Muhamad Fadil Alfatih - NIS 11252121
    { username: 'muhamad-fahri', password: 'muhamad-fahri', role: 'user', slug: 'muhamad-fahri' }, // Muhamad Fahri - NIS 11252021
    { username: 'muhammad-ajwad-fhadil', password: 'muhammad-ajwad-fhadil', role: 'user', slug: 'muhammad-ajwad-fhadil' }, // Muhammad Ajwad Fhadil - NIS 11252120
    { username: 'muhammad-alhafidzi-fathul-yadi', password: 'muhammad-alhafidzi-fathul-yadi', role: 'user', slug: 'muhammad-alhafidzi-fathul-yadi' }, // Muhammad Alhafidzi Fathul Yadi - NIS 11252123
    { username: 'muhammad-dava-andrian', password: 'muhammad-dava-andrian', role: 'user', slug: 'muhammad-dava-andrian' }, // Muhammad Dava Andrian - NIS 11252023
    { username: 'muhammad-luthfi', password: 'muhammad-luthfi', role: 'user', slug: 'muhammad-luthfi' }, // Muhammad Luthfi - NIS 11252024
    { username: 'nadja-mudin-al-ayyuby-nasution', password: 'nadja-mudin-al-ayyuby-nasution', role: 'user', slug: 'nadja-mudin-al-ayyuby-nasution' }, // Nadja Mudin Al Ayyuby Nasution - NIS 11252097
    { username: 'rezki-awalludin', password: 'rezki-awalludin', role: 'user', slug: 'rezki-awalludin' }, // Rezki Awalludin - NIS 11252031
    { username: 'ridho-ahmad-ibramavie', password: 'ridho-ahmad-ibramavie', role: 'user', slug: 'ridho-ahmad-ibramavie' }, // Ridho Ahmad Ibramavie - NIS 11252062
    { username: 'rifqi-nabil-ukasyah', password: 'rifqi-nabil-ukasyah', role: 'user', slug: 'rifqi-nabil-ukasyah' }, // Rifqi Nabil Ukasyah - NIS 11252032
    { username: 'sendy-arkana-bahrudin', password: 'sendy-arkana-bahrudin', role: 'user', slug: 'sendy-arkana-bahrudin' }, // Sendy Arkana Bahrudin - NIS 11252101
    { username: 'vincent', password: 'vincent', role: 'user', slug: 'vincent' }, // Vincent - NIS 11252102
    { username: 'virgian-haryatama-putra', password: 'virgian-haryatama-putra', role: 'user', slug: 'virgian-haryatama-putra' }, // Virgian Haryatama Putra - NIS 11252134
    { username: 'yasakha', password: 'yasakha', role: 'user', slug: 'yasakha' }, // Yasakha - NIS 11252034
];
