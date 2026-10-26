// Array untuk menyimpan semua data yang sudah ditambahkan
const dataNilai = [];

// Mengambil elemen dari HTML
const inputNama = document.getElementById("nama");
const inputNilai = document.getElementById("nilai");
const btnTambah = document.getElementById("btnTambah");
const btnReset = document.getElementById("btnReset");
const pesan = document.getElementById("pesan");
const tabel = document.getElementById("tabel");
const isiTabel = document.getElementById("isiTabel");
const statistik = document.getElementById("statistik");

// PERCABANGAN: menentukan grade (9 kondisi: A, A-, B+, B, B-, C+, C, D, E)
function tentukanGrade(nilai) {
  let grade;
  let keterangan;

  if (nilai >= 85) {
    grade = "A";
    keterangan = "Sangat Baik";
  } else if (nilai >= 80) {
    grade = "A-";
    keterangan = "Sangat Baik";
  } else if (nilai >= 75) {
    grade = "B+";
    keterangan = "Baik";
  } else if (nilai >= 70) {
    grade = "B";
    keterangan = "Baik";
  } else if (nilai >= 65) {
    grade = "B-";
    keterangan = "Baik";
  } else if (nilai >= 60) {
    grade = "C+";
    keterangan = "Cukup";
  } else if (nilai >= 55) {
    grade = "C";
    keterangan = "Cukup";
  } else if (nilai >= 40) {
    grade = "D";
    keterangan = "Kurang";
  } else {
    grade = "E";
    keterangan = "Sangat Kurang";
  }

  return { grade: grade, keterangan: keterangan };
}

// PERULANGAN WHILE: membuat grafik batang dari karakter "█"
// Setiap 10 poin nilai = 1 blok
function buatBar(nilai) {
  const panjang = Math.floor(nilai / 10);
  let bar = "";
  let i = 0;

  while (i < panjang) {
    bar += "█";
    i++;
  }

  if (bar === "") {
    return "-";
  }
  return bar;
}

// Menampilkan pesan (tipe: "error" atau "sukses")
function tampilkanPesan(teks, tipe) {
  pesan.textContent = teks;
  pesan.className = "pesan " + tipe;
}

// Menampilkan tabel dan statistik dari isi array dataNilai
function tampilkanData() {
  isiTabel.innerHTML = "";

  // Jika belum ada data, sembunyikan tabel dan statistik
  if (dataNilai.length === 0) {
    tabel.hidden = true;
    statistik.hidden = true;
    return;
  }

  tabel.hidden = false;
  statistik.hidden = false;

  let total = 0;
  let tertinggi = dataNilai[0].nilai;
  let terendah = dataNilai[0].nilai;

  // PERULANGAN FOR: menelusuri setiap data di array
  for (let i = 0; i < dataNilai.length; i++) {
    const item = dataNilai[i];
    const hasil = tentukanGrade(item.nilai);
    const baris = document.createElement("tr");

    const kolom = [
      i + 1,
      item.nama,
      item.nilai,
      hasil.grade + " (" + hasil.keterangan + ")",
      buatBar(item.nilai),
    ];

    // PERULANGAN FOR (bersarang): mengisi tiap kolom pada baris
    for (let j = 0; j < kolom.length; j++) {
      const td = document.createElement("td");
      td.textContent = kolom[j];

      if (j === 3) {
        td.className = "grade-" + hasil.grade;
      }
      baris.appendChild(td);
    }

    isiTabel.appendChild(baris);

    // Menghitung total, nilai tertinggi, dan terendah
    total += item.nilai;
    if (item.nilai > tertinggi) {
      tertinggi = item.nilai;
    }
    if (item.nilai < terendah) {
      terendah = item.nilai;
    }
  }

  const rata = total / dataNilai.length;

  document.getElementById("jumlah").textContent = dataNilai.length;
  document.getElementById("rata").textContent =
    rata.toFixed(1) + " (" + tentukanGrade(rata).grade + ")";
  document.getElementById("tinggi").textContent = tertinggi;
  document.getElementById("rendah").textContent = terendah;
}

// Menambah data baru setelah divalidasi
function tambahData() {
  const nama = inputNama.value.trim();
  const nilaiTeks = inputNilai.value.trim();

  // PERCABANGAN: validasi input
  if (nama === "") {
    tampilkanPesan("Nama tidak boleh kosong.", "error");
    return;
  }
  if (nilaiTeks === "") {
    tampilkanPesan("Nilai tidak boleh kosong.", "error");
    return;
  }

  const nilai = Number(nilaiTeks);

  if (nilai < 0 || nilai > 100) {
    tampilkanPesan("Nilai harus di antara 0 sampai 100.", "error");
    return;
  }

  dataNilai.push({ nama: nama, nilai: nilai });
  tampilkanData();
  tampilkanPesan("Data " + nama + " berhasil ditambahkan.", "sukses");

  inputNama.value = "";
  inputNilai.value = "";
  inputNama.focus();
}

// Menghapus semua data
function resetData() {
  dataNilai.length = 0;
  tampilkanData();
  pesan.textContent = "";
  pesan.className = "pesan";
}

// Event: tombol diklik, dan tekan Enter di kolom nilai
btnTambah.addEventListener("click", tambahData);
btnReset.addEventListener("click", resetData);
inputNilai.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    tambahData();
  }
});