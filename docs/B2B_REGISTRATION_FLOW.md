# B2B Registration Flow – Architecture & Safeguards

Dokumen ini mendeskripsikan alur registrasi B2B (guest → buat akun → halaman verifikasi) dan aturan yang **tidak boleh dilanggar** agar issue (loading tidak tampil, redirect gagal) tidak terulang.

---

## 1. Alur yang benar (end-to-end)

```
[Guest] Isi form B2B (register-agent)
    → POST /b2b/register (pakai path relatif agar request ikut protokol halaman, hindari Mixed Content HTTPS→HTTP)
    → Backend: simpan request ke session (b2b_registration_data, b2b_registration_files)
    → Redirect 302 ke: /register?mode=b2b&redirect=<absolute_url_b2b/register/continue>

[User] Halaman Register (auth/register)
    → Form state HARUS menyertakan mode + redirect (dari URL → useEffect → setData)
    → User isi name, email, password
    → Klik "Create account" → loading HARUS langsung tampil (isSubmitting + processing)
    → POST /register (body = form state, termasuk mode & redirect)

[Backend] RegisteredUserController::store
    → Buat user, Auth::login()
    → PRIORITY 1: session has b2b_registration_data? → redirect GET b2b.register.store.continue
    → PRIORITY 2: input mode === 'b2b'? → redirect b2b.register dengan error
    → PRIORITY 3: input redirect? (same-origin) → redirect ke path tersebut

[Backend] AgentVerificationController::storeContinue (GET, auth)
    → Ambil data dari session, buat AgentVerification, clear session
    → Redirect ke b2b.pending

[User] Halaman Pending Verification
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

- **Urutan pengecekan jangan diubah:** (1) session `b2b_registration_data`, (2) input `mode === 'b2b'`, (3) input `redirect`.
- **Jangan panggil `session()->regenerateToken()` sebelum cek session B2B** (agar data registrasi tidak hilang).
- **Redirect param:** hanya gunakan path yang aman (same-origin / allowlist path), jangan redirect ke URL arbitrer (open redirect).

### 2.3 Backend (AgentVerificationController)

- **store() (guest):** redirect ke register **dengan** `mode=b2b` dan `redirect=<full_url_continue>` (HTTPS di production).
- **storeContinue():** hanya GET, middleware auth; baca session, buat verification, redirect ke pending.

---

## 3. Failure modes & penanganan

| Failure                                     | Penyebab                          | Penanganan saat ini                                                                                                                                                                                                                 |
| ------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session hilang antara form B2B dan register | Session expired, cookie, domain   | Backend: jika tidak ada session tapi `mode=b2b` → redirect ke b2b.register + error. User isi ulang form.                                                                                                                            |
| mode/redirect tidak terkirim di POST        | Hanya di URL, tidak di form state | Form state wajib berisi mode & redirect; useEffect + optional sync sebelum post.                                                                                                                                                    |
| Loading tidak kelihatan                     | Hanya andal pada `processing`     | `isSubmitting` lokal + showLoading.                                                                                                                                                                                                 |
| Double submit                               | User klik berulang                | Guard `if (processing \|\| isSubmitting) return`.                                                                                                                                                                                   |
| Email sudah terdaftar di flow B2B           | User pilih "log in here"          | Link login dengan mode=b2b & redirect=continue. Setelah login, `AuthenticatedSessionController::determineRedirectTarget` memakai param redirect jika path `/b2b/register/continue` sehingga user lanjut ke storeContinue → pending. |

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
