# Template pengisian — Admin B2C Create package

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

## Ringkasan alur Media

1. Di bagian **Media**, pilih atau seret file gambar (JPEG / PNG / WebP) — **poster vertikal** didukung (mis. ±1080×1920).
2. **Tanpa crop di browser**; file dikompres ringan di klien lalu diunggah.
3. **Server** menjalankan **kompresi** GD (hingga ±1600×3200px, kualitas ~85%) lalu menyimpan ke **Cloudflare R2** di folder `images/b2c-packages/`.
4. **Path** terisi otomatis di form; saat **Create package**, path tersimpan di database. Halaman **`/packages`** memuat daftar dari DB dan menampilkan gambar lewat URL CDN.
5. Setelah sukses, browser diarahkan ke **`/packages`** (banner flash di halaman publik). Jika gagal (validasi atau error server), di halaman **create** muncul **toast** atas layar (bukan modal crop).
6. **Admin daftar paket** (`/admin/b2c-packages`): aksi sukses/gagal (hapus, update, dll.) memakai **toast** auto-dismiss di atas; **lonceng** membuka inbox pendaftaran terbaru (polling ringan ~16 dtk). Push instan: siapkan Laravel Reverb / Pusher + Echo.
7. **Gambar paket (admin):** unggah langsung tanpa zoom/crop di form B2C — kompresi klien + server. Jika masih muncul dialog “Atur posisi gambar”, lakukan hard refresh atau pastikan deploy memakai build frontend terbaru (bukan mode edit CMS di halaman publik `/packages`).

### Deploy Railway (Dockerfile, bukan Nixpacks)

Build production memakai **`Dockerfile`** di root repo (lihat `railway.json`: `builder: DOCKERFILE`). Ini menghindari error **504** saat Nixpacks mengunduh tarball **nixpkgs** dari GitHub. Aset front-end dibangun di stage **Node 22**; image akhir memakai **php:8.4-cli-bookworm** + ekstensi `pdo_mysql`, `gd`, `intl`, `zip`, `xml`, `dom`, dll. Proses jalan server memakai **`scripts/railway-start.sh`**: sengaja **tanpa** `route:cache` karena banyak route closure di `web.php` — `route:cache` akan gagal dan (dengan `&&`) memblokir `php artisan serve`, sehingga situs tidak bisa diakses.

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


## Contoh nilai field

| Field | Contoh |
|--------|--------|
| Package code | `CAH-UMR-2026-04` |
| Package name | `Umrah Premium 12 Hari — April 2026` |
| Departure period | `14–24 April 2026` |
| Duration label | `10 Days` |
| Registration deadline | `2026-04-01 23:59` (sesuaikan dengan timezone server) |
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
