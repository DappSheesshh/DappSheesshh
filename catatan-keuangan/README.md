# CatatUang - Penghitung Pengeluaran Harian

CatatUang adalah aplikasi web sederhana untuk membantu pengguna mencatat pengeluaran harian, menghitung total pengeluaran, dan mengontrol anggaran bulanan. Proyek ini dibuat sebagai contoh tugas Pemrograman Web menggunakan HTML, CSS, dan JavaScript tanpa framework.

## Fitur

- Menambahkan pengeluaran dengan nama, jumlah, kategori, tanggal, dan catatan opsional.
- Menghitung total pengeluaran pada bulan berjalan secara otomatis.
- Menentukan anggaran bulanan dan melihat sisa anggaran.
- Menampilkan indikator penggunaan anggaran dan memberi penanda jika anggaran terlampaui.
- Mencari transaksi dan menyaring berdasarkan kategori.
- Menghapus satu transaksi atau semua transaksi dengan dialog konfirmasi.
- Menyimpan transaksi dan anggaran menggunakan `localStorage` pada browser.
- Tampilan responsif untuk layar komputer maupun ponsel.

## Teknologi

- **HTML** untuk struktur halaman dan formulir.
- **CSS** untuk desain dan tata letak responsif.
- **JavaScript** untuk validasi formulir, penghitungan, filter, dan penyimpanan data.

## Cara menjalankan

1. Unduh atau clone repository ini.
2. Pastikan `index.html`, `style.css`, dan `script.js` berada dalam folder yang sama.
3. Buka file `index.html` dengan browser seperti Google Chrome atau Microsoft Edge.
4. Masukkan anggaran bulanan pada bagian Anggaran Bulanan, lalu klik **Simpan anggaran**.
5. Tambahkan transaksi melalui formulir **Tambah pengeluaran**.

Tidak diperlukan instalasi package atau server khusus.

## Contoh penggunaan

Misalnya, pengguna mengatur anggaran bulanan sebesar Rp1.500.000 lalu mencatat:

| Pengeluaran       | Kategori     | Jumlah       |
|-------------------|--------------|-------------:|
| Makan siang       | Makanan      | Rp25.000     |
| Ongkos perjalanan | Transportasi | Rp15.000     |
| Alat tulis        | Pendidikan   | Rp20.000     |
| **Total**         |              | **Rp60.000** |

Sisa anggaran yang ditampilkan menjadi Rp1.440.000, selama transaksi tersebut tercatat pada bulan berjalan.

## Penyimpanan data

Data disimpan pada `localStorage` browser di perangkat yang digunakan. Data tidak otomatis tersinkronisasi ke perangkat lain. Menghapus data situs atau menggunakan browser/perangkat berbeda dapat membuat catatan tidak tersedia lagi.

## Struktur proyek

```teks
catatuang/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Pengembangan

Proyek ini merupakan aplikasi latihan untuk pembelajaran dasar Pemrograman Web. Nilai rupiah dihitung sebagai bilangan bulat agar tidak menggunakan pecahan rupiah pada input transaksi.
