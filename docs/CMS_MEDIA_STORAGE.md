# CMS Media Storage & Admin Guide

## Ringkasan

- **Gambar & video** → Disimpan di R2 (Cloudflare)
- **Deskripsi/teks/konten** → Hanya di database
- **Gambar** → Auto-compress sebelum upload (max 1920×1080, quality 85%)
- **Video** → Max 50MB, format MP4/WebM, disimpan langsung ke R2

---

## Panduan Admin (ditampilkan di CMS)

### Gambar
- **Ukuran disarankan:** 1920×1080px
- **Ukuran minimal:** 400×300px
- **Max file:** 5MB
- **Format:** JPEG, PNG, WebP
- **Auto-compress:** Ya — gambar di-resize dan dikompres sebelum upload ke R2

### Video
- **Ukuran disarankan:** 1920×1080px
- **Max file:** 50MB
- **Format:** MP4 (H.264), WebM
- **Tips:** Kompres video sebelum upload untuk performa lebih baik

---

## Konfigurasi

File: `config/cms_media_guide.php`

```php
'images' => [
    'recommended_width' => 1920,
    'recommended_height' => 1080,
    'max_file_size_mb' => 5,
    'short' => '1920×1080px recommended · Max 5MB · Auto-compressed',
],
'videos' => [
    'recommended_width' => 1920,
    'recommended_height' => 1080,
    'max_file_size_mb' => 50,
    'short' => '1920×1080px recommended · Max 50MB · MP4/WebM',
],
```

---

## Endpoints

| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/admin/upload-image` | POST | Upload gambar → R2, auto-compress |
| `/admin/upload-video` | POST | Upload video → R2 |
| `/admin/update-section` | POST | Update teks/deskripsi → database saja |

---

## Lokasi Penyimpanan R2

- **Gambar:** `images/{uuid}.{ext}`
- **Video:** `videos/{uuid}.{ext}`
- **Package images (fallback):** `images/packages/packages1.png`, `images/packages/packages2.png`, dll.

Path relatif (misal `images/xxx.jpg`, `videos/xxx.mp4`) disimpan di database table `sections` kolom `image` atau `video`.

### Folder `public/images/packages/`

Gambar package (packages1.png, packages2.png, packages3.png, dll.) disimpan di `public/images/packages/` untuk konsistensi dan R2. **Penting:** Jangan gunakan `public/packages/` karena folder itu akan konflik dengan rute Laravel `/packages`. Pastikan folder `public/images/packages/` di-upload ke R2 di path `images/packages/` agar fallback image berfungsi di production.
