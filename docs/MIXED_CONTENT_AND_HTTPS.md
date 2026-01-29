# Mixed Content & Network Error – Analisis Mendalam & Pencegahan Sistematis

Dokumen ini menjelaskan **apa itu Mixed Content dan Network Error**, **mengapa terjadi di project ini**, dan **langkah sistematis** agar tidak terulang.

---

## 1. Apa itu Mixed Content?

**Mixed Content** = halaman di-load lewat **HTTPS** (aman), tetapi meminta resource atau mengirim request ke **HTTP** (tidak aman).

- Browser memblokir request HTTP dari halaman HTTPS (kebijakan keamanan).
- Gejala: request gagal, Console menampilkan _"Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://...'. This request has been blocked"_.
- Dampak: **Network Error** (mis. AxiosError `ERR_NETWORK`), form submit tidak jalan, redirect atau API call gagal.

**Ringkas:** Halaman HTTPS → request ke HTTP → diblokir browser → Network Error.

---

## 2. Mengapa Terjadi di Project Ini?

### 2.1 Rantai penyebab

1. **Laravel di belakang reverse proxy (Railway, Cloudflare, dll.)**
    - Browser user: `https://cahayaanbiya.com/...` (HTTPS).
    - Request ke server bisa sampai sebagai **HTTP** (proxy yang terminate SSL, atau header `X-Forwarded-Proto` tidak dikirim/dibaca).
    - Laravel memakai `$request->getSchemeAndHttpHost()` dan `config('app.url')` untuk membangun URL.
    - Jika request “terlihat” HTTP atau `APP_URL` di env masih `http://`, maka **semua URL yang di-generate** (redirect, Ziggy, `route(..., true)`) bisa jadi **http://**.

2. **Ziggy (route di frontend)**
    - Base URL Ziggy di-inject dari backend (HandleInertiaRequests) memakai `$request->getSchemeAndHttpHost()` dan logic force HTTPS.
    - Jika saat itu request belum “terlihat” HTTPS (proxy/header salah), Ziggy bisa dapat base **http://**.
    - `route('b2b.register.store', {}, true)` di frontend lalu menghasilkan **http://cahayaanbiya.com/b2b/register**.

3. **Submit form dari halaman HTTPS**
    - User di `https://cahayaanbiya.com/b2b/register` klik Submit.
    - Inertia/Axios POST ke URL dari Ziggy → **http://cahayaanbiya.com/b2b/register**.
    - Browser: halaman HTTPS tidak boleh request ke HTTP → **blokir** → Mixed Content → **Network Error**.

Jadi akar masalahnya: **ada URL absolut http:// yang sampai ke frontend dan dipakai untuk request dari halaman HTTPS.**

---

## 3. Lapisan yang Sudah Ada (tetap perlu dijaga)

| Lapisan                      | Lokasi                                          | Fungsi                                                                                                      |
| ---------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **1. Blade inline script**   | `resources/views/app.blade.php`                 | Override `XMLHttpRequest.open` dan `fetch` **sebelum** script lain; konversi http→https dan Ziggy override. |
| **2. App.tsx**               | `resources/js/app.tsx`                          | Override `route()`, `fetch`, `XMLHttpRequest.open` saat `window.location.protocol === 'https:'`.            |
| **3. HandleInertiaRequests** | `app/Http/Middleware/HandleInertiaRequests.php` | Base URL Ziggy dipaksa HTTPS jika request URL/https atau `X-Forwarded-Proto` https.                         |
| **4. Backend redirect**      | Beberapa controller                             | `route(..., true)` lalu `str_replace('http://', 'https://', ...)` untuk redirect.                           |

Masalah bisa tetap muncul jika:

- Ziggy/`route()` dijalankan **sebelum** override (race),
- atau URL dipakai dari sumber lain (cache, response, dll.),  
  maka **paling aman** untuk request kritis (form submit) adalah **tidak bergantung pada URL absolut dari backend**.

---

## 4. Aturan Sistematis agar Tidak Terulang

### 4.1 Environment (production)

- **APP_URL** harus **https://** (bukan http).  
  Contoh: `APP_URL=https://cahayaanbiya.com`
- Pastikan reverse proxy mengirim **X-Forwarded-Proto: https** (atau set TrustProxies dan skema yang benar) agar Laravel “lihat” request sebagai HTTPS.

### 4.2 Backend (PHP)

- **URL::forceScheme('https')** di production: di `AppServiceProvider::boot()` semua URL yang di-generate Laravel (`route()`, `url()`, redirect) memakai skema HTTPS. Ini memastikan Ziggy dan redirect tidak pernah menghasilkan http:// di production.
- Untuk **redirect** yang pakai URL absolut: tetap normalisasi ke HTTPS (sudah dilakukan di beberapa controller dengan `str_replace`) sebagai lapisan kedua.
- HandleInertiaRequests memaksa base URL Ziggy ke HTTPS berdasarkan request URL / `X-Forwarded-Proto`. **Jangan** menghapus atau melemahkan logic itu tanpa pengganti.

### 4.3 Frontend – form submit & request kritis

- **Prioritas 1 (paling aman):** Untuk **form POST** yang harus selalu jalan di HTTPS (mis. B2B register, login, register), gunakan **path relatif** (mis. `'/b2b/register'`, `'/login'`, `'/register'`) sehingga request **selalu** ke origin + protokol yang sama dengan halaman (HTTPS → HTTPS).
- **Prioritas 2:** Jika tetap pakai `route(name, {}, true)`:
    - Pastikan override `route()` dan `XMLHttpRequest.open` di app.blade.php dan app.tsx **tetap ada** dan jalan sebelum request pertama.
    - Atau normalisasi URL di pemanggil: jika `window.location.protocol === 'https:'` dan URL dari route dimulai `http://`, ganti ke `https://` atau pakai path relatif.
- **Jangan** menghapus atau menonaktifkan script force HTTPS di `app.blade.php` dan di `app.tsx` tanpa pengganti.

### 4.4 Axios / fetch

- Pakai **path relatif** (mis. `axios.post('/admin/...')`) agar request ikut origin + protokol halaman.
- Jangan set `baseURL` ke URL http.

### 4.5 Checklist sebelum release / deploy

- [ ] Production: `APP_URL` = `https://...`
- [ ] Production: proxy set `X-Forwarded-Proto: https`
- [ ] Form submit kritis (B2B register, login, register, dll.) pakai path relatif atau URL yang sudah dipastikan https
- [ ] Tidak ada penghapusan override HTTPS di app.blade.php / app.tsx
- [ ] Test manual: buka situs lewat **https**, submit form, pastikan tidak ada error Mixed Content / Network Error di Console

---

## 5. Referensi kode (pencegahan)

| Tujuan                                    | Lokasi                                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Force HTTPS untuk semua URL di production | `app/Providers/AppServiceProvider.php` → `URL::forceScheme('https')`       |
| Override XHR/fetch paling awal            | `resources/views/app.blade.php` (inline script di `<head>`)                |
| Override route/XHR/fetch di React         | `resources/js/app.tsx` (saat `protocol === 'https:'`)                      |
| Base URL Ziggy dipaksa HTTPS              | `app/Http/Middleware/HandleInertiaRequests.php`                            |
| Submit B2B pakai path relatif             | `resources/js/pages/b2b/register-agent.tsx` → `post('/b2b/register', ...)` |
| Redirect backend ke HTTPS                 | Beberapa controller: `str_replace('http://', 'https://', $url)`            |

---

## 6. Ringkasan

- **Mixed Content** = halaman HTTPS meminta ke HTTP → diblokir browser.
- **Network Error** = konsekuensi request yang diblokir (mis. Axios/Inertia).
- **Penyebab di project:** URL absolut `http://` (dari Ziggy/backend) dipakai untuk request dari halaman HTTPS.
- **Pencegahan sistematis:**  
  (1) APP_URL & proxy HTTPS benar,  
  (2) Backend tetap paksa HTTPS untuk redirect/URL ke frontend,  
  (3) Form submit kritis pakai **path relatif**,  
  (4) Jangan hapus override HTTPS di Blade dan app.tsx,  
  (5) Checklist dan test HTTPS sebelum release.

Dengan aturan ini dan kode yang sudah ada, risiko Mixed Content / Network Error bisa dijaga agar tidak terulang selama konfigurasi dan konvensi di atas diikuti.
