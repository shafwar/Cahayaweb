# B2B Agent Verification – Dokumen ke R2

## Ringkasan

Dokumen pendaftaran agen B2B (Business License, Tax Certificate, Company Profile) disimpan ke **Cloudflare R2** saat R2 dikonfigurasi. Di production (Railway) **R2 wajib dikonfigurasi** agar dokumen tidak hilang (multi-instance / redeploy).

## Path di R2

- **Folder di bucket:** `public/agent-verifications/`
- Bukan `public/documents/` — folder `documents` dipakai keperluan lain.
- Di dashboard R2: buka bucket → navigasi ke **public** → **agent-verifications** untuk melihat file B2B.

## Konfigurasi Production (Railway)

Set variabel lingkungan berikut di Railway:

| Variable               | Contoh / Keterangan                                    |
| ---------------------- | ------------------------------------------------------ |
| `R2_ACCESS_KEY_ID`     | Access Key dari Cloudflare R2                          |
| `R2_SECRET_ACCESS_KEY` | Secret Key dari Cloudflare R2                          |
| `R2_BUCKET`            | Nama bucket (mis. `cahayaanbiya-assets`)               |
| `R2_URL`               | Custom domain (mis. `https://assets.cahayaanbiya.com`) |
| `R2_ENDPOINT`          | `https://<account-id>.r2.cloudflarestorage.com`        |
| `R2_ROOT`              | (opsional) `public` — prefix path di bucket            |

**Tidak perlu** mengubah `FILESYSTEM_DISK` untuk B2B: controller memakai disk `r2` secara eksplisit bila R2 dikonfigurasi (`R2Helper::isR2DiskConfigured()`).

## Alur Dokumen

1. **Guest submit** (`POST /b2b/register`): file disimpan sementara di disk `public` (temp), lalu disalin ke R2 di `temp-b2b-drafts/{token}/` dan payload + path disimpan di tabel `b2b_registration_drafts`.
2. **Setelah register** (`GET /b2b/register/continue?b2b_token=...`): draft dibaca, file dari R2 (`temp-b2b-drafts/`) disalin ke `agent-verifications/` di R2, lalu record `agent_verifications` dibuat dengan path `agent-verifications/xxx.pdf`.
3. **Admin download**: controller membaca dari disk `r2` dengan path `agent-verifications/xxx.pdf` (root disk = `public` → key di bucket = `public/agent-verifications/xxx.pdf`).

## Jika R2 Belum Dikonfigurasi di Production

- Jika user (guest) mengunggah file dan R2 tidak dikonfigurasi, form akan menampilkan error: _"Document storage is temporarily unavailable. Please try again later or contact support."_
- Ini mencegah terbentuknya data verifikasi tanpa dokumen.

## Migrasi

Tidak ada migrasi khusus untuk fitur ini. Kolom `business_license_file`, `tax_certificate_file`, `company_profile_file` sudah ada di tabel `agent_verifications`. Cukup pastikan R2 dikonfigurasi di production.
