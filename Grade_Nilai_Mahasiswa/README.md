# Penghitung Grade Nilai

Tugas **Pemrograman Web**: program sederhana yang menerapkan **percabangan** (`if / else if / else`) dan **perulangan** (`for` dan `while`) menggunakan HTML, CSS, dan JavaScript murni, tanpa framework maupun library.

|                 |                               |
|-----------------|-------------------------------|
| **Nama**        | Wakhid Ahmad Daffa Nur Riva'i |
| **NIM**         | 25534008                      |
| **Kelas**       | 3D                            |
| **Mata Kuliah** | Pemrograman Web               |

## Deskripsi

Pengguna memasukkan **nama** dan **nilai** (0 sampai 100). Program kemudian:

1. memeriksa apakah input valid,
2. menentukan grade dari nilai tersebut (A, A-, B+, B, B-, C+, C, D, atau E),
3. menampilkan data dalam tabel beserta grafik batang sederhana,
4. menghitung statistik: jumlah data, rata-rata, nilai tertinggi, dan nilai terendah.

## Fitur

- Input nama dan nilai dengan validasi
- Penentuan grade otomatis (A, A-, B+, B, B-, C+, C, D, E)
- Tabel data dengan grafik batang dari karakter `█`
- Statistik: jumlah data, rata-rata (beserta grade-nya), tertinggi, dan terendah
- Tombol **Tambah** (atau tekan Enter di kolom nilai) dan tombol **Reset**
- Tampilan responsif (nyaman di laptop maupun HP)

## Struktur File

```
penghitung-grade-nilai/
├── index.html    # kerangka halaman (form, tabel, statistik)
├── style.css     # tampilan halaman
├── script.js     # logika program (percabangan dan perulangan)
└── README.md     # dokumentasi
```

|      File     |                                                      Fungsi                                                        |
|---------------|--------------------------------------------------------------------------------------------------------------------|
| `index.html`  | Berisi form input, tabel hasil, dan kartu statistik. Tabel dan statistik disembunyikan (`hidden`) sampai ada data. |
| `style.css`   | Mengatur tata letak, warna, tabel, dan warna grade.                                                                |
| `script.js`   | Seluruh logika: validasi, penentuan grade, grafik, tabel, dan statistik.                                           |


## Cara Penggunaan

1. Isi kolom **Nama**.
2. Isi kolom **Nilai** dengan angka 0 sampai 100.
3. Klik **Tambah** atau tekan **Enter**.
4. Data muncul di tabel, statistik ikut diperbarui. Ulangi untuk menambah data lain.
5. Klik **Reset** untuk menghapus semua data.

## Skala Penilaian

|  Nilai  | Grade | Keterangan    |
|---------|-------|---------------|
| 80 - 84 | A-    | Sangat Baik   |
| 75 - 79 | B+    | Baik          |
| 70 - 74 | B     | Baik          |
| 65 - 69 | B-    | Baik          |
| 60 - 64 | C+    | Cukup         |
| 55 - 59 | C     | Cukup         |
| 40 - 54 | D     | Kurang        |
| < 40    | E     | Sangat Kurang |

## Penjelasan Kode

### Alur Program

1. Saat tombol **Tambah** diklik, fungsi `tambahData()` dijalankan.
2. Input dicek (nama kosong, nilai kosong, nilai di luar 0-100). Jika tidak valid, muncul pesan error dan proses berhenti.
3. Jika valid, data disimpan ke array `dataNilai` sebagai objek `{ nama, nilai }`.
4. Fungsi `tampilkanData()` membaca seluruh isi array, lalu membangun ulang tabel dan menghitung statistik.
5. Untuk setiap data, `tentukanGrade()` menentukan grade dan `buatBar()` membuat grafik batangnya.

### Percabangan

| Lokasi (`script.js`)     | Jenis | Penjelasan |
|--------------------------|-------|------------|
| Fungsi `tentukanGrade()` | `if / else if / else` (9 cabang) | Menentukan grade A, A-, B+, B, B-, C+, C, D, atau E sesuai rentang nilai pada tabel skala di atas. Pengecekan dari nilai terbesar ke terkecil, jadi cabang pertama yang benar yang dipakai. |
| Fungsi `tambahData()`    | `if` | Menolak input jika nama kosong. |
| Fungsi `tambahData()`    | `if` | Menolak input jika nilai kosong. |
| Fungsi `tambahData()`    | `if` dengan operator `\|\|` (OR) | Menolak nilai yang kurang dari 0 **atau** lebih dari 100. |
| Fungsi `tampilkanData()` | `if` | Jika array kosong, tabel dan statistik disembunyikan lalu fungsi berhenti (`return`). |
| Fungsi `tampilkanData()` | `if` | Jika nilai saat ini lebih besar dari `tertinggi`, perbarui `tertinggi`. |
| Fungsi `tampilkanData()` | `if` | Jika nilai saat ini lebih kecil dari `terendah`, perbarui `terendah`. |
| Fungsi `tampilkanData()` | `if` | Jika kolom ke-4 (indeks 3, kolom Grade), beri class warna sesuai grade. |
| Fungsi `buatBar()`       | `if` | Jika grafik kosong (nilai di bawah 10), tampilkan tanda `-`. |
| Event `keydown`          | `if` | Menjalankan `tambahData()` saat tombol Enter ditekan. |

### Perulangan

| Lokasi (`script.js`)     | Jenis | Penjelasan |
|--------------------------|-------|------------|
| Fungsi `tampilkanData()` | `for` | Menelusuri array `dataNilai` dari indeks 0 sampai data terakhir. Setiap putaran membuat satu baris tabel, menjumlahkan total nilai, dan memperbarui nilai tertinggi/terendah. Dipilih `for` karena jumlah putaran sudah diketahui (sebanyak isi array). |
| Fungsi `tampilkanData()` | `for` bersarang | Di dalam tiap baris, perulangan kedua mengisi kolom satu per satu (No, Nama, Nilai, Grade, Grafik). |
| Fungsi `buatBar()`       | `while` | Menambahkan karakter `█` selama `i < panjang`, dengan `panjang = Math.floor(nilai / 10)`. Dipilih `while` karena jumlah putaran bergantung pada nilai yang diinput. |

Contoh `buatBar()`:

- nilai 85: `Math.floor(85 / 10)` = 8, hasilnya `████████` (8 blok)
- nilai 100: hasilnya 10 blok
- nilai 5: `Math.floor(5 / 10)` = 0, `while` tidak berjalan, hasilnya `-`

### Fungsi-fungsi Utama

|           Fungsi             |                              Tugas                                     |
|------------------------------|------------------------------------------------------------------------|
| `tentukanGrade(nilai)`       | Menerima angka, mengembalikan objek `{ grade, keterangan }`.           |
| `buatBar(nilai)`             | Menerima angka, mengembalikan string grafik batang.                    |
| `tampilkanPesan(teks, tipe)` | Menampilkan pesan error (merah) atau sukses (hijau).                   |
| `tampilkanData()`            | Membangun ulang tabel dan menghitung statistik dari array `dataNilai`. |
| `tambahData()`               | Validasi input, menyimpan data, lalu memperbarui tampilan.             |
| `resetData()`                | Mengosongkan array dan menyembunyikan tabel serta statistik.           |

### Catatan Teknis

- Teks nama dari pengguna dimasukkan ke tabel dengan `textContent`, bukan `innerHTML`, sehingga tidak diproses sebagai kode HTML.
- Grade rata-rata dihitung dari nilai rata-rata **sebelum dibulatkan**. Angka yang tampil dibulatkan 1 desimal dengan `toFixed(1)`.
- Warna grade memakai huruf pertama saja (`A`, `B`, `C`, `D`, `E`), sehingga A dan A- sama-sama hijau, B+/B/B- sama-sama teal, dan seterusnya.

## Contoh Pengujian

|     Input    | Hasil yang diharapkan                              |
|--------------|----------------------------------------------------|
| Nilai 90     | Grade A, grafik 9 blok                             |
| Nilai 85     | Grade A (batas bawah A)                            |
| Nilai 84     | Grade A-                                           |
| Nilai 80     | Grade A- (batas bawah A-)                          |
| Nilai 79     | Grade B+                                           |
| Nilai 70     | Grade B                                            |
| Nilai 69     | Grade B-                                           |
| Nilai 64     | Grade C+                                           |
| Nilai 55     | Grade C                                            |
| Nilai 54     | Grade D                                            |
| Nilai 39     | Grade E                                            |
| Nilai 101    | Pesan error "Nilai harus di antara 0 sampai 100."  |
| Nilai kosong | Pesan error "Nilai tidak boleh kosong."            |
| Nama kosong  | Pesan error "Nama tidak boleh kosong."             |
| Klik Reset   | Semua data hilang, tabel dan statistik tersembunyi |

## Keterbatasan

- Data hanya disimpan di memori browser (array JavaScript), jadi **hilang saat halaman di-refresh**.
- Belum ada fitur menghapus atau mengubah satu data tertentu, hanya reset semua.

## Teknologi

- HTML
- CSS3
- JavaScript