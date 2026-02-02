# R2: Setup Dokumen B2B (Agent Verification)

## Pemisahan data vs dokumen

| Yang disimpan                                                    | Di mana                                   | Keterangan                                                         |
| ---------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| **Data B2B** (nama perusahaan, kontak, alamat, dll.)             | **Database saja**                         | Tabel `agent_verifications` + relasi `user`. Tidak disimpan di R2. |
| **Dokumen** (Business License, Tax Certificate, Company Profile) | **R2** (atau disk `public` jika R2 gagal) | Hanya file; path-nya disimpan di kolom di database.                |

- **Database**: Semua data diri B2B dan **path** ke file dokumen.
- **R2**: Hanya file PDF/gambar; tidak menyimpan data profil. Setiap dokumen bisa diidentifikasi “milik siapa” lewat path dan record di DB.

## Struktur path di R2 (per akun B2B)

Dokumen di R2 diorganisir **per user dan per aplikasi** sehingga bisa dipisah per orang:

```
public/documents/agent-verifications/{user_id}/{verification_id}/
  ├── {uuid}.pdf   (business_license_file)
  ├── {uuid}.pdf   (tax_certificate_file)
  └── {uuid}.pdf   (company_profile_file)
```

- **`user_id`**: ID user (akun B2B) di database → dokumen milik orang ini.
- **`verification_id`**: ID aplikasi verifikasi (`agent_verifications.id`) → satu folder = satu aplikasi B2B.

Admin bisa mengembalikan “dokumen dari orang mana” lewat record `agent_verifications` (user_id + verification_id) dan path yang disimpan.

## Alur sistem (desain saat ini)

1. **User B2B** mengisi form registrasi dan meng-upload dokumen (Business License, Tax Certificate, Company Profile).
2. **Backend** menyimpan **data** ke database dulu (agar aplikasi selalu muncul di admin, redirect ke Verification Pending), lalu meng-upload **file**:
    - Jika **R2 dikonfigurasi** (semua env `R2_*` terisi, termasuk **R2_ENDPOINT**), file disimpan ke **R2** di path `public/documents/agent-verifications/{user_id}/{verification_id}/{uuid}.<ext>`.
    - Jika R2 gagal (credentials/endpoint salah), fallback ke disk **public** (local) agar submit tidak gagal.
3. **Path file** disimpan di database (contoh: `documents/agent-verifications/42/17/uuid.pdf` → user_id 42, verification_id 17).
4. **Admin** mengunduh dokumen lewat **Download Document** di halaman Agent Verifications. Backend **stream file dari R2 dulu** (jika R2 configured), lalu fallback ke disk public. Admin tidak mengakses URL publik R2; semua lewat endpoint Laravel.

**Env wajib agar R2 dipakai untuk B2B dokumen (di Railway / .env):**

- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_URL` (custom domain, mis. `https://assets.cahayaanbiya.com`)
- **`R2_ENDPOINT`** (endpoint Cloudflare R2, mis. `https://<account-id>.r2.cloudflarestorage.com`)

Tanpa `R2_ENDPOINT`, aplikasi tidak menganggap R2 “configured” dan akan pakai disk `public` untuk upload.

---

## Perilaku teknis

- **Data** → hanya di database; **dokumen** → hanya di R2 (atau public); path dokumen → di database.
- **Path di R2** → `documents/agent-verifications/{user_id}/{verification_id}/` sehingga dokumen terfilter per akun B2B.
- Admin mengunduh lewat route **Download Document**; backend stream dari R2 dulu, lalu fallback ke disk `public`. Dokumen “milik siapa” ditentukan dari record `agent_verifications` (user_id + verification_id) dan path yang disimpan.
- Folder di R2 dibuat otomatis saat upload pertama; tidak perlu membuat folder secara manual.

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

| Yang dicek                              | Di mana                                 | Harus                                             |
| --------------------------------------- | --------------------------------------- | ------------------------------------------------- |
| Custom domain `assets.cahayaanbiya.com` | R2 → Bucket → Settings → Custom Domains | Status **Active**                                 |
| Akses publik untuk domain itu           | Same section                            | **Access to Bucket** = **Allowed**                |
| Path di bucket                          | R2 → Bucket → Objects                   | Ada folder `public/agent-verifications/`          |
| File PDF                                | Di dalam `public/agent-verifications/`  | Nama file sama dengan yang di app (mis. UUID.pdf) |

---

## 4. Jika Tetap 404 Setelah Langkah di Atas

1. **Cek URL persis** yang dipakai app (buka network tab saat klik download), bandingkan dengan path objek di R2 (case-sensitive, harus sama).
2. **Cek CORS** jika akses dari browser: R2 → Bucket → **Settings** → **CORS Policy** — pastikan origin `https://cahayaanbiya.com` (dan variant lain yang dipakai) di-**Allow**.
3. **Cek DNS**: `assets.cahayaanbiya.com` harus mengarah ke target R2 yang diberikan Cloudflare (biasanya CNAME ke `...r2.cloudflarestorage.com` atau domain yang ditunjukkan di Custom Domains).

Dengan **Custom Domain aktif + Access Allowed** dan **file ada di `public/agent-verifications/`** di R2, error 404 “Object not found” untuk dokumen B2B seharusnya bisa dihilangkan.
