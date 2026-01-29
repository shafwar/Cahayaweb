# B2B Registration Flow – Architecture & Safeguards

Dokumen ini mendeskripsikan alur registrasi B2B (guest → buat akun → halaman verifikasi) dan aturan yang **tidak boleh dilanggar** agar issue (loading tidak tampil, redirect gagal, data tidak muncul di admin) tidak terulang.

---

## 1. Alur yang benar (end-to-end)

```
[Guest] Isi form B2B (register-agent)
    → POST /b2b/register (path relatif agar request ikut protokol halaman)
    → Backend: simpan ke SESSION (b2b_registration_data, b2b_registration_files)
               DAN buat DRAFT di DB (b2b_registration_drafts) dengan token; file disalin ke R2/public (temp-b2b-drafts/{token}/)
    → Redirect 302 ke: /register?mode=b2b&redirect=<url_b2b/register/continue?b2b_token=TOKEN>

[User] Halaman Register (auth/register)
    → Form state HARUS menyertakan mode + redirect (dari URL → useEffect → setData)
    → User isi name, email, password, klik "Create account"
    → POST /register (body = form state, termasuk mode & redirect)

[Backend] RegisteredUserController::store
    → Buat user, Auth::login()
    → Jika session punya b2b_registration_data: redirect ke continue (prefer redirect param agar b2b_token ikut)
    → Jika session kosong tapi redirect = /b2b/register/continue?b2b_token=...: redirect ke URL itu (storeContinue akan pakai draft)
    → Jika mode=b2b dan tidak ada data: redirect ke b2b.register dengan error

[Backend] AgentVerificationController::storeContinue (GET, auth)
    → Jika session punya data: buat AgentVerification dari session, clear session
    → Jika session kosong tapi request ada b2b_token: load draft, buat AgentVerification dari draft, hapus draft
    → Redirect ke b2b.pending

[User] Halaman Pending Verification → status Pending, data muncul di admin
```

---

## 2. Aturan yang tidak boleh dilanggar

### 2.1 Frontend (auth/register.tsx)

- **Mode & redirect harus ikut di body POST**  
  Inertia `useForm().post(url, options)` hanya mengirim **state form**; `options.data` tidak dipakai. Jadi `mode` dan `redirect` harus ada di **form state** (bukan hanya di URL atau di options).
    - Wajib: field `mode` dan `redirect` di type/initial state.
    - Wajib: `useEffect` yang baca query URL dan `setData` agar mode/redirect masuk state.
    - Opsional defensif: right before `post()`, sync lagi mode/redirect dari URL ke state jika belum ada.

- **Loading harus langsung terlihat**  
  `processing` dari Inertia baru true setelah request jalan, jadi ada jeda tanpa feedback.
    - Wajib: state lokal `isSubmitting` di-set `true` di awal `submit` (sebelum `post()`).
    - Wajib: tombol dan input pakai `showLoading = isSubmitting || processing` (disabled + teks loading).

- **Cegah double submit**  
  Di awal handler submit: `if (processing || isSubmitting) return;`.

### 2.2 Backend (RegisteredUserController::store)

- **Urutan:** (1) redirect ke continue jika session ada (pakai redirect param jika aman agar b2b_token ikut); (2) jika session kosong tapi redirect = continue URL → redirect ke itu (draft flow); (3) jika mode=b2b → error ke b2b.register; (4) redirect param lain (same-origin).
- **Redirect param:** hanya path yang aman (allowlist /b2b, /login, /), jangan open redirect.

### 2.3 Backend (AgentVerificationController)

- **store() (guest):** simpan session + buat draft (token, payload, file_paths di R2/public), redirect ke register dengan `redirect=<url_continue?b2b_token=TOKEN>`.
- **storeContinue():** GET, auth; coba session dulu; jika kosong dan ada `b2b_token` → load draft, buat AgentVerification, hapus draft; redirect ke pending.

---

## 3. Failure modes & penanganan

| Failure                                      | Penyebab                 | Penanganan saat ini                                                                                                                                              |
| -------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session hilang (multi-instance, file driver) | Request ke instance lain | **Draft + b2b_token:** data di `b2b_registration_drafts`, file di R2/public; redirect URL berisi `b2b_token`; storeContinue load dari draft jika session kosong. |
| Session expired / cookie                     | Idle lama                | Redirect param = continue?b2b_token=... → storeContinue pakai draft. Draft kadaluarsa 1 jam.                                                                     |
| mode/redirect tidak terkirim di POST         | Hanya di URL             | Form state wajib mode & redirect; useEffect sync dari URL.                                                                                                       |
| Loading tidak kelihatan                      | Hanya `processing`       | `isSubmitting` lokal + showLoading.                                                                                                                              |
| Double submit                                | User klik berulang       | Guard `if (processing \|\| isSubmitting) return`.                                                                                                                |
| Email sudah terdaftar di flow B2B            | User pilih "log in here" | Link login dengan redirect=continue; setelah login redirect ke storeContinue (dengan token jika ada) → pending.                                                  |

---

## 4. Pencegahan regresi

- **Jangan** menghapus `mode`/`redirect` dari form state atau dari useEffect sync di register.
- **Jangan** andalkan hanya `processing` untuk tampilan loading tombol; tetap pakai state lokal untuk submit.
- **Jangan** ubah urutan prioritas di `RegisteredUserController::store` (session → mode → redirect).
- Saat menambah flow serupa (form → redirect ke auth → redirect berikutnya), ikuti pola yang sama: param di URL **dan** di form state, loading lokal, backend cek session dulu lalu param.

---

## 5. Referensi kode

- **Register form state & sync:** `resources/js/pages/auth/register.tsx` (type `RegisterForm`, `useEffect`, `showLoading`).
- **Register backend:** `app/Http/Controllers/Auth/RegisteredUserController.php` (store: session → mode → redirect).
- **B2B store redirect ke register:** `app/Http/Controllers/AgentVerificationController.php` (store, baris ~124–137).
- **Continue & pending:** `AgentVerificationController::storeContinue`, redirect ke `b2b.pending`.
