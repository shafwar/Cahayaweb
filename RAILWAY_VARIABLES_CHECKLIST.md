# Railway Variables – Checklist & Verifikasi

Dokumen ini merangkum **semua environment variables** yang diperlukan agar Cahayaweb di Railway berjalan dengan baik, termasuk **upload dokumen B2B ke R2** dan koneksi database.

---

## 1. Variabel Wajib (App & Deploy)

| Variable                | Contoh / Nilai                                | Keterangan                                             |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------ |
| `APP_KEY`               | (base64)                                      | **Wajib.** Generate: `php artisan key:generate --show` |
| `APP_ENV`               | `production`                                  |                                                        |
| `APP_DEBUG`             | `false`                                       | Harus `false` di production                            |
| `APP_URL`               | `https://cahayaweb-production.up.railway.app` | URL deployment (HTTPS)                                 |
| `ASSET_URL`             | Sama dengan `APP_URL`                         | Untuk asset Laravel/Vite                               |
| `ZIGGY_URL`             | Sama dengan `APP_URL`                         | Untuk route() di frontend (Inertia)                    |
| `NIXPACKS_NODE_VERSION` | `20`                                          | **Penting** agar build Vite sukses (Node 20)           |

---

## 2. Database (MySQL di Railway)

Jika memakai **MySQL** sebagai service terpisah, gunakan **service reference** agar koneksi dan panah di Architecture tampil:

| Variable        | Nilai (service reference)  | Keterangan                                                   |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| `DB_CONNECTION` | `mysql`                    | Ganti dari `sqlite` jika pakai MySQL                         |
| `DB_HOST`       | `${{MySQL.MYSQLHOST}}`     | Atau nama service Anda, mis. `${{CahayawebMySQL.MYSQLHOST}}` |
| `DB_PORT`       | `${{MySQL.MYSQLPORT}}`     |                                                              |
| `DB_DATABASE`   | `${{MySQL.MYSQLDATABASE}}` |                                                              |
| `DB_USERNAME`   | `${{MySQL.MYSQLUSER}}`     |                                                              |
| `DB_PASSWORD`   | `${{MySQL.MYSQLPASSWORD}}` |                                                              |

**Cara set:** Railway Dashboard → Cahayaweb → Variables → Referensi dari service MySQL, atau jalankan `./update-railway-variables.sh` (sesuaikan nama service).

---

## 3. R2 / Upload Dokumen B2B

Agar **dokumen verifikasi B2B** (business license, tax certificate, company profile) tersimpan di R2 dan admin bisa download, **disk `r2`** harus dikonfigurasi. Bisa pakai prefix `R2_*` atau `AWS_*` (fallback).

| Variable                     | Contoh                                          | Keterangan                   |
| ---------------------------- | ----------------------------------------------- | ---------------------------- |
| `R2_ACCESS_KEY_ID`           | (dari Cloudflare R2)                            | Atau `AWS_ACCESS_KEY_ID`     |
| `R2_SECRET_ACCESS_KEY`       | (dari Cloudflare R2)                            | Atau `AWS_SECRET_ACCESS_KEY` |
| `R2_BUCKET`                  | `cahayaanbiya-assets`                           | Atau `AWS_BUCKET`            |
| `R2_URL`                     | `https://assets.cahayaanbiya.com`               | Custom domain R2             |
| `R2_ENDPOINT`                | `https://<account-id>.r2.cloudflarestorage.com` | Atau `AWS_ENDPOINT`          |
| `R2_REGION`                  | `auto`                                          | Optional                     |
| `R2_USE_PATH_STYLE_ENDPOINT` | `true`                                          | Optional, default true       |
| `R2_ROOT`                    | `public`                                        | Optional, default `public`   |

**Catatan:** Aplikasi mendukung **AWS\_\*** sebagai fallback (mis. `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`, `AWS_URL`, `AWS_ENDPOINT`). Di Railway Anda bisa pakai prefix `R2_*` atau `AWS_*`; keduanya dipakai oleh disk `r2`.

**Penting:**

- **R2_ENDPOINT wajib** agar R2 dianggap terkonfigurasi untuk upload B2B (Cloudflare R2 memakai endpoint S3-compatible custom). Tanpa endpoint, aplikasi pakai disk `public` untuk upload.
- **Tidak perlu** mengubah `FILESYSTEM_DISK` ke `r2` untuk seluruh app (opsional; jika set `r2`, default storage pakai R2).
- Cukup set variabel R2/AWS di atas; upload B2B otomatis pakai disk `r2` jika terkonfigurasi.
- Admin download dokumen melalui Laravel (stream dari R2), bukan URL publik.

---

## 4. Admin & Session

| Variable                | Contoh                | Keterangan                                               |
| ----------------------- | --------------------- | -------------------------------------------------------- |
| `APP_ADMIN_EMAILS`      | `admin@cahayaweb.com` | Email yang dianggap admin (bisa banyak, comma-separated) |
| `SESSION_DRIVER`        | `database`            | Disarankan jika pakai MySQL                              |
| `SESSION_SECURE_COOKIE` | `true`                | Disarankan untuk HTTPS                                   |

---

## 5. Verifikasi Koneksi & Upload

### Cek variables (tanpa nilai rahasia)

```bash
railway variables
```

Pastikan setidaknya: `APP_KEY`, `APP_URL`, `ASSET_URL`, `ZIGGY_URL`, `DB_*` (jika MySQL), dan `R2_*` / `AWS_*` (jika pakai R2).

### Jalankan script verifikasi (dalam konteks Railway)

```bash
railway run php scripts/verify-railway-env.php
```

Script akan:

- Menampilkan variabel mana yang ter-set (nilai disembunyikan)
- Mengecek koneksi database
- Mengecek konfigurasi disk R2 dan folder B2B `agent-verifications`
- Memberi rekomendasi jika ada yang kurang

### Cek dokumen B2B di R2 (setelah deploy)

```bash
railway run php scripts/agent-verifications-r2.php
```

Untuk backfill dokumen lama dari local ke R2:

```bash
railway run php scripts/agent-verifications-r2.php --sync
```

### Monitor log setelah deploy

```bash
railway logs
```

Pastikan tidak ada error saat startup (config, DB, session).

---

## 6. Ringkasan Ceklist

- [ ] `APP_KEY` set
- [ ] `APP_URL` / `ASSET_URL` / `ZIGGY_URL` = URL deployment (HTTPS)
- [ ] `NIXPACKS_NODE_VERSION=20`
- [ ] Database: `DB_CONNECTION` + service reference `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` jika pakai MySQL
- [ ] R2: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_URL`, `R2_ENDPOINT` agar upload/download dokumen B2B ke R2
- [ ] `APP_ADMIN_EMAILS` untuk login admin
- [ ] Setelah deploy: `railway run php scripts/verify-railway-env.php` dan `railway logs` untuk memastikan sistem dan upload berjalan baik
