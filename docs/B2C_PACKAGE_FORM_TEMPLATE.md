# Template pengisian — Admin B2C Create package

Gunakan contoh di bawah sebagai **acuan** saat membuat paket baru. Selalu **ubah `package_code` dan nama** agar unik di database. Deadline `registration_deadline` harus format datetime yang valid (field browser: datetime-local).

## Ringkasan alur Media

1. Di bagian **Media**, pilih atau seret file gambar (JPEG / PNG / WebP).
2. Atur **crop** (rasio 16:9, cocok untuk kartu paket di halaman publik).
3. Browser mengirim file; **server** menjalankan **kompresi** (GD, max ±1920px, kualitas ~85%) lalu menyimpan ke **Cloudflare R2** di folder `images/b2c-packages/`.
4. Field **path** terisi otomatis, misalnya `images/b2c-packages/a1b2c3d4-....jpg`. Halaman publik membangun URL aset dari path ini (CDN `assets.cahayaanbiya.com`).

Anda juga boleh menempel **URL https** penuh ke gambar yang sudah ada di CDN, jika perlu.

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
| Image path | *(kosongkan lalu unggah)* atau `images/b2c-packages/<uuid>.jpg` setelah upload |

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
