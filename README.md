# **Simulator Sistem Operasi - UAS**

**Universitas Bahaudin Mudhary (UNIBA) Madura**  
**Mata Kuliah: Sistem Operasi**  
**Semester Genap 2025/2026**  
**Dosen: Mohammad Iqbal Bachtiar, S.T., M.T.**

## 📋 **Deskripsi Proyek**

Simulator Sistem Operasi ini adalah aplikasi web interaktif yang mensimulasikan konsep-konsep fundamental sistem operasi melalui antarmuka visual yang mudah digunakan. Simulator ini dirancang untuk membantu mahasiswa memahami mekanisme internal sistem operasi dengan cara yang praktis dan visual.

## ✨ **Fitur Utama**

### 1. **Manajemen Proses**
- Tambah, edit, dan hapus proses
- Visualisasi Process Control Block (PCB)
- Status proses: New, Ready, Running, Waiting, Terminated
- Atribut proses: PID, Burst Time, Arrival Time, Priority

### 2. **Penjadwalan CPU**
- **FCFS** (First Come First Serve)
- **SJF** (Shortest Job First)
- **Priority Scheduling**
- **Round Robin** dengan quantum time yang dapat dikonfigurasi
- Visualisasi Gantt Chart interaktif
- Perhitungan metrik kinerja:
  - Waiting Time
  - Turnaround Time
  - Response Time

### 3. **Manajemen Memori**
- Alokasi dan dealokasi memori dinamis
- Tiga algoritma alokasi:
  - **First Fit**
  - **Best Fit**
  - **Worst Fit**
- Visualisasi memori real-time
- Deteksi fragmentasi eksternal

### 4. **Sinkronisasi Proses**
- Simulasi **Producer-Consumer Problem**
- Implementasi **Semaphore** (mutex, empty, full)
- Buffer dengan ukuran konfigurasi
- Log aktivitas produksi dan konsumsi

### 5. **Sistem Berkas**
- Operasi file dasar: create, read, write, delete
- Struktur direktori hierarkis
- Pembedaan file dan direktori
- Visualisasi tree structure

## 🛠 **Teknologi yang Digunakan**

- **HTML5** - Struktur halaman web
- **CSS3** - Styling dan layout dengan Bootstrap 5
- **JavaScript (ES6+)** - Logika aplikasi dan interaktivitas
- **Bootstrap 5** - Framework CSS untuk responsivitas
- **Chart.js** - Visualisasi Gantt Chart
- **Font Awesome** - Ikon untuk UI

## 📁 **Struktur Proyek**

```
simulator-os/
├── index.html              # File utama HTML
├── style.css               # Styling kustom
├── README.md               # Dokumentasi ini
├── script.js               # Main JavaScript file
├── assets/                 # Aset gambar/font
└── modules/                # Modul JavaScript
    ├── process-manager.js  # Manajemen proses
    ├── cpu-scheduler.js    # Algoritma penjadwalan
    ├── memory-manager.js   # Manajemen memori
    └── file-system.js      # Sistem berkas
```

## 🚀 **Cara Menjalankan**

### **Metode 1: Local Server (Direkomendasikan)**
1. Clone atau download proyek ini
2. Letakkan semua file dalam satu folder
3. Jalankan server lokal:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve`
4. Buka browser dan akses: `http://localhost:8000`

### **Metode 2: File Langsung**
1. Buka file `index.html` langsung di browser modern
2. Pastikan koneksi internet tersedia (untuk load CDN)

## 📊 **Panduan Penggunaan**

### **1. Menambahkan Proses**
1. Pilih tab "Manajemen Proses"
2. Isi form: PID, Burst Time, Arrival Time, Priority
3. Klik "Tambah Proses"
4. Proses akan muncul di tabel PCB

### **2. Menjalankan Penjadwalan**
1. Tambahkan beberapa proses terlebih dahulu
2. Pilih tab "Penjadwalan CPU"
3. Pilih algoritma yang diinginkan
4. Untuk Round Robin, atur quantum time
5. Klik "Jalankan Penjadwalan"
6. Lihat hasil di Gantt Chart dan tabel metrik

### **3. Alokasi Memori**
1. Pilih tab "Manajemen Memori"
2. Atur ukuran total memori
3. Pilih metode alokasi
4. Masukkan PID dan ukuran memori proses
5. Klik "Alokasi Memori"
6. Amati visualisasi memori dan informasi fragmentasi

### **4. Simulasi Producer-Consumer**
1. Pilih tab "Sinkronisasi"
2. Atur ukuran buffer dan kecepatan
3. Klik "Start Simulasi"
4. Amati interaksi producer dan consumer
5. Monitor nilai semaphore di real-time

### **5. Operasi File**
1. Pilih tab "Sistem Berkas"
2. Buat file/direktori baru
3. Baca/tulis konten file
4. Lihat struktur direktori dalam bentuk tree
5. Hapus file/direktori yang tidak diperlukan

## 🎯 **Tujuan Pembelajaran**

Setelah menggunakan simulator ini, mahasiswa diharapkan dapat:

1. Memahami konsep **manajemen proses** dan statusnya
2. Menganalisis perbedaan **algoritma penjadwalan CPU**
3. Memahami masalah **alokasi memori** dan **fragmentasi**
4. Mengimplementasikan **sinkronisasi proses** dengan semaphore
5. Memahami operasi dasar **sistem berkas**

## 👥 **Tim Pengembang**

- **Nama Amrosi 1** - NIM: 2402310187
- **Nama Ratna Kurnia Puti 2** - NIM: 2402310181

**Dibawah bimbingan:**  
Mohammad Iqbal Bachtiar, S.T., M.T.  
Dosen Sistem Operasi, UNIBA Madura

## 📝 **Persyaratan Sistem**

- Browser modern (Chrome 80+, Firefox 75+, Edge 80+)
- Resolusi layar minimal 1024x768
- Koneksi internet (untuk CDN Bootstrap dan Chart.js)
- JavaScript enabled

## ⚠️ **Batasan dan Catatan**

1. Simulator ini untuk tujuan edukasi
2. Tidak semua edge case sistem operasi real diimplementasikan
3. Performa simulasi bergantung pada spesifikasi browser
4. Data tidak disimpan secara persistensi (hilang saat refresh)

## 🔧 **Pengembangan Lebih Lanjut**

Beberapa fitur yang dapat ditambahkan:

- [ ] Simulasi deadlock detection
- [ ] Algoritma page replacement
- [ ] Sistem berkas dengan permission
- [ ] Simulasi multi-core scheduling
- [ ] Ekspor hasil simulasi ke PDF
- [ ] Mode challenge dengan soal otomatis

## 📄 **Lisensi**

Proyek ini dibuat untuk keperluan akademik UAS Sistem Operasi UNIBA Madura Semester Genap 2025/2026.

---

**© 2025 UAS Sistem Operasi - UNIBA MADURA**  
**Semester Genap 2025/2026**