# Cloudflare R2 Public Access Configuration Guide

## ⚠️ Catatan Penting

Cloudflare R2 **TIDAK menggunakan Bucket Policy** seperti AWS S3. Public access dikonfigurasi dengan cara yang berbeda.

## 🔧 Cara Mengaktifkan Public Access di Cloudflare R2

### Method 1: Public Access Toggle (Paling Mudah)

1. Buka **Cloudflare Dashboard** → **R2** → **cahayaanbiya-assets**
2. Klik tab **Settings**
3. Di bagian **General**, cari **"Public Access"** atau **"Allow Access"**
4. Pastikan toggle **"Public Access"** atau **"Allow Access"** sudah **ENABLED** ✅
5. Jika belum, klik toggle untuk mengaktifkan

### Method 2: Custom Domain Configuration

Jika custom domain sudah **Active** dan **Enabled**, pastikan:

1. Custom domain `assets.cahayaanbiya.com` sudah:
   - ✅ Status: **Active**
   - ✅ Access: **Enabled**
   - ✅ CNAME record sudah benar di DNS

2. Public Access sudah enabled di bucket settings

### Method 3: R2 API (Jika Method 1 & 2 tidak tersedia)

Jika tidak ada opsi "Public Access" di UI, mungkin perlu menggunakan R2 API atau ada setting lain.

## 🔍 Verifikasi Public Access

Setelah mengaktifkan public access, test dengan:

```bash
# Test akses file
curl -I https://assets.cahayaanbiya.com/public/images/arabsaudi.jpg

# Expected: HTTP 200 (bukan 404)
```

## 📋 Checklist

- [x] CORS Policy sudah dikonfigurasi
- [ ] **Public Access enabled** ← INI YANG PERLU DICEK
- [x] Custom Domain Active & Enabled
- [x] File sudah diupload ke R2
- [x] File permissions sudah di-set

## 🎯 Langkah Selanjutnya

1. **Cek Settings → General** untuk opsi "Public Access" atau "Allow Access"
2. **Pastikan toggle sudah ENABLED**
3. **Tunggu 2-5 menit** untuk propagasi
4. **Test ulang** dengan script:
   ```bash
   php scripts/check-r2-status.php
   ```

## 💡 Catatan

Cloudflare R2 menggunakan sistem yang berbeda dari AWS S3:
- ❌ **Tidak ada Bucket Policy** (seperti AWS S3)
- ✅ **Menggunakan Public Access toggle** di Settings
- ✅ **Custom Domain** sudah mengaktifkan public access jika enabled

Jika custom domain sudah **Active** dan **Enabled**, tapi file masih 404, kemungkinan:
1. Public Access toggle belum enabled
2. Perlu menunggu propagasi lebih lama (10-15 menit)
3. Ada masalah dengan CNAME record di DNS

---

**Last Updated**: 2026-01-23
**Action**: Check Public Access toggle in R2 Settings
