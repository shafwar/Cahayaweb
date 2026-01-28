# R2: Setup Dokumen B2B (Agent Verification) — Atasi Error 404

## Perilaku baru (setelah implementasi)

**Folder `public/agent-verifications/` di R2 dibuat otomatis** saat ada dokumen B2B yang di-upload dan R2 dikonfigurasi:

- Jika **R2 dikonfigurasi** (`R2_*` / `AWS_*` di `.env` dan `R2Helper::isConfigured()` true), setiap dokumen (Business License, Tax Certificate, Company Profile) dari registrasi B2B **langsung disimpan ke R2** di path `public/agent-verifications/<nama-file>.pdf` (atau ekstensi lain).
- Admin mengunduh dokumen lewat endpoint **Download Document** di B2B Admin; backend mencoba **R2 dulu**, lalu fallback ke local `public` disk.
- Anda **tidak perlu** membuat folder `agent-verifications` secara manual di R2; folder tersebut tercipta saat file pertama di-upload melalui aplikasi.

Saat download mengarah ke  
`assets.cahayaanbiya.com/public/agent-verifications/xxx.pdf`  
lalu muncul **Error 404: Object not found**, penyebabnya biasanya:

1. **File belum ada di R2** (mis. upload lama hanya ke local, atau R2 belum dikonfigurasi saat itu)  
2. **Akses publik via custom domain belum diaktifkan** untuk bucket R2

Berikut yang perlu Anda lakukan di R2/assets.

---

## 1. Pastikan Custom Domain & Public Access Aktif

Agar URL `https://assets.cahayaanbiya.com/...` bisa diakses publik:

1. Buka **Cloudflare Dashboard** → **R2** → bucket **cahayaanbiya-assets** (atau nama bucket Anda).
2. Masuk ke **Settings**.
3. Di bagian **Custom Domains**:
   - Pastikan `assets.cahayaanbiya.com` **terhubung** dan status **Active**.
   - Pastikan **Access to Bucket** = **Allowed** (bukan "Not allowed").
     - Jika "Not allowed", pilih **…** di samping domain → **Enable domain** (atau opsi serupa di UI terbaru).
4. Jika domain belum ada:
   - Klik **Add** under Custom Domains.
   - Masukkan `assets.cahayaanbiya.com` → **Continue** → ikuti langkah (DNS, dll.) → **Connect Domain**.
   - Tunggu status menjadi **Active**.

Tanpa custom domain yang **Active** dan **Access = Allowed**, semua request ke `assets.cahayaanbiya.com/...` bisa berujung 404 atau “not publicly accessible”.

---

## 2. Pastikan File Ada di Path yang Benar di R2

Aplikasi mencari file di URL:

```
https://assets.cahayaanbiya.com/public/agent-verifications/<nama-file>.pdf
```

Di dalam bucket, path-nya harus persis:

```
public/agent-verifications/<nama-file>.pdf
```

Contoh: `public/agent-verifications/f7b4731b-95a8-43de-8d48-a12f459af858.pdf`.

Saat ini, dokumen B2B (agent verification) di-upload ke **local disk** server (`storage/app/public/agent-verifications/`), **bukan** ke R2. Jadi:

- File yang hanya ada di server **tidak** akan ketemu di R2 → 404 wajar.
- Agar download lewat R2 tidak 404, file harus **ada** di R2 di path di atas.

### 2.1 Upload Manual via Cloudflare Dashboard

1. Di **R2** → bucket Anda → **Objects**.
2. Pastikan ada folder:
   - `public`
   - di dalamnya: `agent-verifications`
3. Upload file PDF ke `public/agent-verifications/` dengan **nama file yang sama** persis seperti di database (mis. `f7b4731b-95a8-43de-8d48-a12f459af858.pdf`).

Path lengkap di bucket harus: `public/agent-verifications/f7b4731b-95a8-43de-8d48-a12f459af858.pdf` (sesuaikan nama file dengan data Anda).

### 2.2 Upload/Sync dari Server ke R2 (opsional)

Jika file sudah ada di server production (`storage/app/public/agent-verifications/`), Anda bisa:

- Pakai **Wrangler** / **R2 API** / script untuk upload ke path `public/agent-verifications/<filename>` di bucket yang dipakai `assets.cahayaanbiya.com`, **atau**
- Jika ada pipeline deploy, tambahkan step untuk sync folder `storage/app/public/agent-verifications/` ke R2 path tersebut.

Setelah file ada di `public/agent-verifications/...` di R2 dan custom domain **Allowed**, URL  
`https://assets.cahayaanbiya.com/public/agent-verifications/xxx.pdf`  
seharusnya bisa diakses (dan download dari aplikasi tidak lagi 404 dari R2).

---

## 3. Ringkasan Checklist

| Yang dicek | Di mana | Harus |
|-----------|--------|--------|
| Custom domain `assets.cahayaanbiya.com` | R2 → Bucket → Settings → Custom Domains | Status **Active** |
| Akses publik untuk domain itu | Same section | **Access to Bucket** = **Allowed** |
| Path di bucket | R2 → Bucket → Objects | Ada folder `public/agent-verifications/` |
| File PDF | Di dalam `public/agent-verifications/` | Nama file sama dengan yang di app (mis. UUID.pdf) |

---

## 4. Jika Tetap 404 Setelah Langkah di Atas

1. **Cek URL persis** yang dipakai app (buka network tab saat klik download), bandingkan dengan path objek di R2 (case-sensitive, harus sama).
2. **Cek CORS** jika akses dari browser: R2 → Bucket → **Settings** → **CORS Policy** — pastikan origin `https://cahayaanbiya.com` (dan variant lain yang dipakai) di-**Allow**.
3. **Cek DNS**: `assets.cahayaanbiya.com` harus mengarah ke target R2 yang diberikan Cloudflare (biasanya CNAME ke `...r2.cloudflarestorage.com` atau domain yang ditunjukkan di Custom Domains).

Dengan **Custom Domain aktif + Access Allowed** dan **file ada di `public/agent-verifications/`** di R2, error 404 “Object not found” untuk dokumen B2B seharusnya bisa dihilangkan.
