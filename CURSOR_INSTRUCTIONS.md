# Instruksi Khusus untuk Cursor (Sekarang dan Masa Depan)

**Dokumen ini adalah dokumentasi instruksi resmi untuk Cursor AI.** Setiap perubahan kode di project ini harus mematuhi panduan di bawah.

---

## 1. Jangan Melakukan Hal yang Sensitif

- **Jangan mengubah** file, konfigurasi, atau alur yang tidak ada hubungan langsung dengan masalah yang sedang diperbaiki.
- **Jangan** mengubah global behavior (exception handler, middleware umum, env, config) kecuali memang diperlukan untuk masalah tersebut dan dampaknya jelas.
- **Fokus hanya** pada area kode yang relevan dengan issue; jangan refactor atau “perbaiki” hal lain di file yang sama.
- **Hindari** menambah dependency baru, mengubah struktur DB di luar migration yang dibutuhkan, atau mengubah flow auth/security tanpa keperluan yang jelas.

---

## 2. Prinsip Perubahan

| Prinsip            | Maksud                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Minimal**        | Ubah hanya yang perlu; jangan menambah fitur atau refactor di luar scope.                                                             |
| **Aman**           | Jangan menghapus validasi, sanitasi, atau penanganan error yang sudah ada.                                                            |
| **Tidak sensitif** | Jangan mengubah file kritikal (vite.config, railway.json, .env, config yang dipakai production) kecuali diminta dan didokumentasikan. |
| **Stick to flow**  | Hormati alur bisnis dan flow yang sudah ada; perbaiki bug tanpa mengubah alur yang benar.                                             |

---

## 3. Sebelum dan Sesudah Perubahan

- **Sebelum:** Pastikan Anda hanya mengubah kode yang terkait langsung dengan masalah.
- **Sesudah:** Jangan meninggalkan perubahan di file lain yang tidak relevan; rollback atau revert jika tidak sengaja terubah.

---

## 4. Deployment

- Ikuti **DEPLOYMENT_SAFETY_GUIDE.md** untuk setiap git push ke production (backup branch, build, commit message, push).
- Jangan force push tanpa backup; jangan push tanpa build assets jika ada perubahan frontend.

---

## 5. Referensi

- **Alur B2B:** `docs/B2B_REGISTRATION_FLOW.md`
- **Deployment:** `DEPLOYMENT_SAFETY_GUIDE.md`
- **Panduan umum:** `CURSOR-CHAT-GUIDE.md` (jika ada)

---

**Ringkas:** Setiap perubahan harus **fokus, minimal, aman, dan tidak sensitif**. Jangan mengubah hal yang tidak ada hubungannya dengan masalah yang diselesaikan.
