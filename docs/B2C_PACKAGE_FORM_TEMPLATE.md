# Template pengisian — Admin B2C Create package

## Production: paket sudah ada (mis. Umrah Premium) — Register Online “mati” karena deadline

Ikuti urutan ini; setelah simpan, tombol **Register Online** akan hidup selama **Status = Open**, kuota belum penuh, dan **deadline masih di masa depan**.

### Opsi A — Satu klik di halaman Edit (disarankan)

1. Login admin → **Packages** → buka paket yang bermasalah (**Edit**).
2. Di atas form, buka panel **“Template & perbaikan cepat”**.
3. Klik **“Aktifkan Register Online (deadline 30 Apr 2026 23:59 + Open)”** — field **Registration deadline** dan **Status** terisi otomatis.
4. Klik **Save changes** di bawah.
5. Buka situs `/packages` dan cek kartu paket (hard refresh bila perlu).

Opsional: tombol **“Isi teks & jadwal dari template Umrah April …”** mengisi deskripsi, syarat, highlights, dll. **tanpa mengubah** kode paket atau nama (slug tetap aman).

### Opsi B — Isi manual (salin-tempel)

1. Buka **Edit** paket yang sama.
2. Isi field berikut (datetime pakai input **datetime-local** di browser; nilai internal: `YYYY-MM-DD` + `T` + `HH:mm`).

| Field | Nilai untuk salin |
|--------|-------------------|
| Registration deadline | `2026-04-30T23:59` (tampilan picker: sesuai zona browser; server menyimpan sesuai **APP_TIMEZONE**, default **Asia/Jakarta**) |
| Status | **Open — accepting registrations** |
| Pax capacity / Pax booked | Sesuaikan (mis. 40 / 0) |

3. **Save changes**.

> **Catatan:** Keberangkatan contoh **14–24 April 2026**. Jika Anda ingin tutup pendaftaran **sebelum** tanggal berangkat, set deadline lebih awal (mis. `2026-04-10T23:59`). Tanggal **30 April** dipakai sebagai contoh “masih jauh ke depan” agar Register Online pasti aktif; sesuaikan kebijakan bisnis Anda.

### Railway / server

- Set **`APP_TIMEZONE=Asia/Jakarta`** di environment jika belum (default di kode sudah Jakarta).

---

## Mengembalikan daftar paket lama (legacy) ke database

Daftar yang dulu hardcoded di halaman publik `/packages` bisa diisi ke tabel `b2c_travel_packages` (muncul di admin **Packages** dan di website) dengan:

```bash
php artisan db:seed --class=LegacyB2cTravelPackagesSeeder --force
```

- **11 baris** (kode unik `LEGACY-01-` … `LEGACY-11-`) disesuaikan dengan kolom DB: nama, lokasi, periode, harga, kapasitas, gambar `images/packages/...`, highlights, features, dates, hotels, `sort_order` 1–11.
- **Idempotent:** jika `package_code` sudah ada, baris dilewati (tidak duplikat).
- **Deadline pendaftaran** diset seragam jauh ke depan (lihat konstanta di seeder) agar status “open” konsisten; sesuaikan di admin bila perlu.
- **Production (Railway):** setelah deploy terbaru, `migrate:safe` juga memanggil seeder ini sekali per startup pasca-migrasi sukses — jadi katalog legacy ikut terisi tanpa perlu ingat perintah manual. Jika Anda belum deploy versi itu, jalankan perintah di atas sekali di **Railway → Service → Shell**.

---

Gunakan contoh di bawah sebagai **acuan** saat membuat paket baru. Selalu **ubah `package_code` dan nama** agar unik di database. Deadline `registration_deadline` harus format datetime yang valid (field browser: datetime-local).

**Penting:** Dropdown **Status = Open** hanya satu bagian dari aturan. Tombol **Register Online** di situs publik aktif hanya jika (1) status Open, (2) kuota belum penuh, dan (3) **waktu sekarang masih sebelum `registration_deadline`**. Jika deadline sudah lewat, admin tetap bisa menampilkan “Open” di form, tetapi situs akan menampilkan “Registration closed” sampai Anda **memperpanjang deadline** (atau menutup paket secara manual). Zona waktu penyimpanan mengikuti `APP_TIMEZONE` (default **Asia/Jakarta**).

## Ringkasan alur Media

1. Di bagian **Media**, pilih atau seret file gambar (JPEG / PNG / WebP) — **poster vertikal** didukung (mis. ±1080×1920).
2. **Tanpa crop di browser**; file dikompres ringan di klien lalu diunggah.
3. **Server** menjalankan **kompresi** GD (hingga ±1600×3200px, kualitas ~85%) lalu menyimpan ke **Cloudflare R2** di folder `images/b2c-packages/`.
4. **Path** terisi otomatis di form; saat **Create package**, path tersimpan di database. Halaman **`/packages`** memuat daftar dari DB dan menampilkan gambar lewat URL CDN.
5. Setelah sukses, browser diarahkan ke **`/packages`** (banner flash di halaman publik). Jika gagal (validasi atau error server), di halaman **create** muncul **toast** atas layar (bukan modal crop).
6. **Admin daftar paket** (`/admin/b2c-packages`): aksi sukses/gagal (hapus, update, dll.) memakai **toast** auto-dismiss di atas; **lonceng** membuka inbox pendaftaran terbaru (polling ringan ~16 dtk). Push instan: siapkan Laravel Reverb / Pusher + Echo.
7. **Gambar paket (admin):** unggah langsung tanpa zoom/crop di form B2C — kompresi klien + server. Jika masih muncul dialog “Atur posisi gambar”, lakukan hard refresh atau pastikan deploy memakai build frontend terbaru (bukan mode edit CMS di halaman publik `/packages`).

### Deploy Railway (Dockerfile, bukan Nixpacks)

Build production memakai **`Dockerfile`** di root repo (lihat `railway.json`: `builder: DOCKERFILE`). Ini menghindari error **504** saat Nixpacks mengunduh tarball **nixpkgs** dari GitHub. Aset front-end dibangun di stage **Node 22**; image akhir memakai **php:8.4-cli-bookworm** + ekstensi `pdo_mysql`, `gd`, `intl`, `zip`, `xml`, `dom`, dll. Proses jalan server memakai **`scripts/railway-start.sh`**: setelah refactor route ke **controller** (bukan closure di `web.php`), startup memanggil **`route:cache`** dan **`view:cache`** (dengan `|| true` per langkah agar tetap jalan `serve` jika ada edge case).

### Troubleshooting: lonceng / toast / unggah tanpa crop tidak terlihat di production

Gejala yang berarti browser atau server masih memakai **versi lama**:

- Ada **banner kuning** bertuliskan `Package deleted.` tepat di atas tabel (versi baru memakai **toast** di atas layar dengan ikon centang dan label **Berhasil**).
- **Tidak ada ikon lonceng** di baris atas admin (sebelah tombol Logout).
- Saat pilih gambar di **create**, masih muncul modal **Atur posisi gambar** (versi baru tidak memakai modal itu sama sekali di admin B2C).

**Perbaikan:**

1. Pastikan **Railway / CI** menjalankan `npm run build` pada deploy terbaru (lihat `railway.json` build).
2. Setelah deploy, buka `/admin/b2c-packages` dengan **hard refresh**: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac), atau jendela **Incognito**.
3. Jika domain di belakang **Cloudflare**, pertimbangkan **Bypass cache** untuk path `/admin*` (HTML) agar tag `@vite` memuat hash file JS/CSS terbaru.

---


Nilai teknis yang sama dipakai di kode: `resources/js/lib/b2cPackageFillTemplates.ts` (tombol cepat di halaman **Edit** / **Create**).

## Contoh nilai field

| Field | Contoh |
|--------|--------|
| Package code | `CAH-UMR-2026-04` |
| Package name | `Umrah Premium 12 Hari — April 2026` |
| Departure period | `14–24 April 2026` |
| Duration label | `10 Days` |
| Registration deadline | `2026-04-30T23:59` (format datetime-local; harus **masih ke depan** agar Register Online aktif) |
| Status | `Open` atau `Closed` |
| Pax capacity | `40` |
| Location | `Makkah & Madinah` |
| Package type | `Umrah` (boleh teks bebas) |
| Price display | `From Rp 45.000.000 / pax` |
| Sort order | `10` |
| Image | Unggah lewat form Media; path disimpan otomatis di database (tanpa input manual). |

### Description (short)

```text
Paket umrah dengan hotel bintang 5 dekat Masjidil Haram, mutawwif berpengalaman, dan dokumentasi lengkap. Termasuk tiket pesawat PP, visa, asuransi, dan makan 3x sehari.
```

### Terms & conditions

```text
Peserta wajib memiliki paspor min. 6 bulan validitas. Pembatalan <30 hari sebelum keberangkatan dikenakan biaya sesuai kebijakan maskapai. Cahaya Anbiya berhak menolak pendaftaran jika kuota penuh.
```

### Highlights (satu baris = satu bullet)

```text
Hotel 5* walking distance
Mutawwif berbahasa Indonesia
Manasik intensif
```

### Features (satu baris = satu item)

```text
Tiket PP ekonomi premium
Visa umrah
Asuransi perjalanan
Makan 3x
```

### Departure dates (`Tanggal|Status`)

```text
14 April 2026|Available
18 April 2026|Limited
```

### Hotels (`Nama|Lokasi|Bintang`)

```text
Pullman Zamzam Makkah|Makkah|5
Oberoi Madinah|Madinah|5
```

---

## Endpoint teknis (admin, auth)

| Method | Path | Fungsi |
|--------|------|--------|
| POST | `/admin/b2c-packages/upload-image` | Body: `multipart/form-data` field `image` → R2 + kompresi, respons JSON `path` + `url` |

Batas ukuran dan tipe file mengikuti `config/cms_media_guide.php` (sama seperti upload CMS).
