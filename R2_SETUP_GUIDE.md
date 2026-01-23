# Cloudflare R2 Setup Guide

## Status Saat Ini

✅ **Kode Aplikasi:**
- Semua file gambar dan video sudah diupload ke R2 bucket (`cahayaanbiya-assets`)
- Semua kode sudah dikonfigurasi untuk menggunakan R2 URLs
- URL generation sudah diperbaiki (tidak ada duplikasi `public/public`)
- File permissions sudah di-set ke `public-read`

❌ **Masalah yang Tersisa:**
- File di R2 masih mengembalikan **HTTP 404** saat diakses via custom domain `https://assets.cahayaanbiya.com`
- Ini adalah masalah konfigurasi di **Cloudflare R2 Dashboard**, bukan masalah kode

## Yang Perlu Dilakukan di Cloudflare R2 Dashboard

### 1. Verifikasi Custom Domain

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih account Anda
3. Buka **R2** dari menu sidebar
4. Pilih bucket `cahayaanbiya-assets`
5. Pergi ke tab **Settings** → **Public Access**
6. Pastikan custom domain `assets.cahayaanbiya.com` sudah:
   - ✅ **Connected** (status: Active)
   - ✅ **Access** enabled
   - ✅ CNAME record di DNS sudah benar

### 2. Konfigurasi Bucket Policy (Public Access)

1. Di bucket `cahayaanbiya-assets`, buka **Settings** → **Public Access**
2. Pastikan **"Allow Access"** atau **"Public Access"** sudah diaktifkan
3. Jika ada opsi **Bucket Policy**, pastikan policy berikut sudah ditambahkan:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::cahayaanbiya-assets/*"
    }
  ]
}
```

### 3. Verifikasi CORS Policy

1. Di bucket `cahayaanbiya-assets`, buka **Settings** → **CORS Policy**
2. Pastikan CORS policy berikut sudah dikonfigurasi:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://cahayaanbiya.com",
      "http://cahayaanbiya.com",
      "https://*.cahayaanbiya.com",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

### 4. Verifikasi DNS CNAME Record

1. Di Cloudflare Dashboard, buka **DNS** → **Records**
2. Pastikan ada CNAME record:
   - **Name:** `assets`
   - **Target:** `9d03ca8e06f677e49fa453f08f9273e4.r2.cloudflarestorage.com` (atau target yang diberikan R2)
   - **Proxy status:** ✅ Proxied (orange cloud) atau ⚪ DNS only (gray cloud)

### 5. Test Akses File

Setelah semua konfigurasi di atas, test dengan:

```bash
curl -I https://assets.cahayaanbiya.com/public/images/arabsaudi.jpg
```

Harus mengembalikan **HTTP 200 OK**, bukan 404.

## Struktur File di R2

File-file sudah diupload dengan struktur berikut:

```
cahayaanbiya-assets/
└── public/
    ├── images/
    │   ├── arabsaudi.jpg
    │   ├── TURKEY.jpeg
    │   ├── egypt.jpeg
    │   ├── dubai1.jpeg
    │   ├── jordan.jpeg
    │   ├── oman.jpg
    │   ├── qatar.jpg
    │   ├── kuwait.jpg
    │   ├── bahrain.jpg
    │   ├── umrah.jpeg
    │   ├── bali.jpeg
    │   ├── b2b.jpeg
    │   ├── turkey2.jpg
    │   ├── cahayanbiyalogo.png
    │   └── ... (21 total images)
    └── videos/
        ├── b2cherosectionvideo.mp4
        └── b2cherosectionvideo-original.mp4
```

## URL Format yang Digunakan

Aplikasi akan menggenerate URL dengan format:
- Images: `https://assets.cahayaanbiya.com/public/images/{filename}`
- Videos: `https://assets.cahayaanbiya.com/public/videos/{filename}`

## Troubleshooting

### Jika file masih 404 setelah konfigurasi:

1. **Cek Custom Domain Status:**
   - Pastikan status adalah "Active" dan "Connected"
   - Jika masih "Pending", tunggu beberapa menit untuk propagasi DNS

2. **Cek Bucket Policy:**
   - Pastikan policy mengizinkan `s3:GetObject` untuk `*` (public)

3. **Cek File Permissions:**
   - Jalankan script: `php scripts/fix-r2-permissions.php`
   - Ini akan memastikan semua file memiliki permission `public-read`

4. **Test dengan R2 Endpoint Langsung:**
   ```bash
   curl -I https://9d03ca8e06f677e49fa453f08f9273e4.r2.cloudflarestorage.com/cahayaanbiya-assets/public/images/arabsaudi.jpg
   ```
   - Jika ini berhasil tapi custom domain tidak, masalahnya di custom domain configuration

5. **Cek Cloudflare Logs:**
   - Buka Cloudflare Dashboard → Analytics → Logs
   - Lihat apakah ada error saat mengakses custom domain

## Scripts yang Tersedia

1. **Upload files ke R2:**
   ```bash
   php scripts/upload-to-r2.php
   ```

2. **Fix file permissions:**
   ```bash
   php scripts/fix-r2-permissions.php
   ```

3. **Verify R2 connection:**
   ```bash
   php scripts/verify-r2-connection.php
   ```

4. **Test R2 asset accessibility:**
   ```bash
   ./scripts/test-r2-assets.sh
   ```

## Catatan Penting

⚠️ **Masalah 404 saat ini BUKAN masalah kode aplikasi**, melainkan masalah konfigurasi Cloudflare R2. Setelah bucket policy dan custom domain dikonfigurasi dengan benar di Cloudflare Dashboard, semua file akan dapat diakses dan website akan berfungsi normal.
