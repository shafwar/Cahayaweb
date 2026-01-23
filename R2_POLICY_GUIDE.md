# R2 Policy Configuration Guide

## 📋 Dua Policy yang Perlu Dikonfigurasi

Ada **2 policy berbeda** yang perlu dikonfigurasi di Cloudflare R2:

### 1. ✅ CORS Policy (SUDAH DIKONFIGURASI)

**Lokasi**: Settings → **CORS Policy**

**Fungsi**: Mengatur cross-origin requests dari browser

**Status**: ✅ **SUDAH DIKONFIGURASI** (jangan diubah)

**Code** (untuk referensi):
```json
[
  {
    "AllowedOrigins": [
      "https://cahayaanbiya.com",
      "http://cahayaanbiya.com",
      "https://www.cahayaanbiya.com",
      "http://www.cahayaanbiya.com",
      "https://*.cahayaanbiya.com",
      "http://*.cahayaanbiya.com",
      "https://cahayaweb-production.up.railway.app",
      "http://cahayaweb-production.up.railway.app",
      "https://*.up.railway.app",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8000",
      "http://cahayaweb.test"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": [
      "Content-Length",
      "Content-Type",
      "ETag",
      "Last-Modified"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

---

### 2. ❌ Bucket Policy (PERLU DIKONFIGURASI)

**Lokasi**: Settings → **Bucket Policy**

**Fungsi**: Mengatur public access ke file (mengizinkan siapa saja membaca file)

**Status**: ❌ **PERLU DIKONFIGURASI** (ini yang menyebabkan 404)

**Code yang harus di-copy**:
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

---

## 🎯 Yang Perlu Dilakukan Sekarang

### Step 1: Buka Bucket Policy Settings

1. Login ke **Cloudflare Dashboard**
2. Buka **R2** → **cahayaanbiya-assets**
3. Klik tab **Settings**
4. Scroll ke bagian **Bucket Policy** (bukan CORS Policy!)
5. Klik **Edit** atau **Add Policy**

### Step 2: Copy & Paste Bucket Policy

Copy code ini (yang lebih pendek):

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

### Step 3: Save & Test

1. Paste code di text editor
2. Klik **Save**
3. Tunggu **2-5 menit**
4. Test dengan:
   ```bash
   php scripts/check-r2-status.php
   ```

---

## 📊 Perbedaan CORS vs Bucket Policy

| Aspek | CORS Policy | Bucket Policy |
|-------|-------------|---------------|
| **Lokasi** | Settings → CORS Policy | Settings → Bucket Policy |
| **Fungsi** | Cross-origin requests | Public file access |
| **Format** | Array `[{...}]` | Object `{...}` |
| **Status** | ✅ Sudah dikonfigurasi | ❌ Perlu dikonfigurasi |
| **Masalah** | Tidak ada | Menyebabkan 404 |

---

## ✅ Checklist

- [x] CORS Policy sudah dikonfigurasi
- [ ] **Bucket Policy perlu dikonfigurasi** ← INI YANG PERLU DILAKUKAN
- [x] Custom Domain Active
- [x] File sudah diupload ke R2
- [x] File permissions sudah di-set

---

## 🚀 Setelah Bucket Policy Dikonfigurasi

Setelah bucket policy disimpan:
- ✅ File akan dapat diakses (HTTP 200, bukan 404)
- ✅ Gambar akan muncul di website
- ✅ Video akan muncul di website
- ✅ Website akan berfungsi 100% normal

---

**Last Updated**: 2026-01-23
**Action Required**: Configure Bucket Policy
