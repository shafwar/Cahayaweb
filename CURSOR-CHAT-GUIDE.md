# 🚨 **CURSOR CHAT GUIDE - CAHAYAWEB PROJECT**

## **⚠️ PENTING: BACA INI SEBELUM MEMULAI CHAT BARU**

### **📖 BAGAIMANA MEMBACA FILE INI:**

1. **File Location:** `CURSOR-CHAT-GUIDE.md` (di root project)
2. **Command untuk buka:** `cat CURSOR-CHAT-GUIDE.md` atau buka di editor
3. **Search keywords:** Gunakan `Ctrl+F` untuk cari informasi spesifik
4. **Section navigation:** Scroll ke section yang relevan

### **🔍 QUICK SEARCH KEYWORDS:**

- **"JANGAN DIUBAH"** - File sensitif yang tidak boleh disentuh
- **"BOLEH DIUBAH"** - File yang aman untuk dimodifikasi
- **"ViteManifestNotFoundException"** - Solusi untuk masalah manifest
- **"Mixed Content Error"** - Solusi untuk HTTPS assets
- **"Railway deployment"** - Prosedur deployment yang aman
- **"emergency"** - Langkah emergency jika website down

---

## 📋 **PROJECT OVERVIEW**

### **Tech Stack:**

- **Backend:** Laravel 11
- **Frontend:** Inertia.js + React + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Deployment:** Railway
- **Database:** SQLite (untuk development, tidak digunakan di production)

### **Domain:** `cahayaweb-production.up.railway.app`

### **Status:** Production Live ✅

---

## 🚨 **FILE-FILE SANGAT SENSITIF - JANGAN DIUBAH!**

### **❌ VITE CONFIGURATION (KRITIS)**

```bash
❌ JANGAN SENTUH FILE INI:
- vite.config.ts
- config/vite.php
- package.json (dependencies)
```

**Alasan:** Mengubah = `ViteManifestNotFoundException` dan website down.

### **❌ BUILD ASSETS (KRITIS)**

```bash
❌ JANGAN SENTUH FILE INI:
- public/build/manifest.json
- public/build/.vite/manifest.json
- public/build/assets/* (semua file JS/CSS)
```

**Alasan:** File auto-generated. Mengubah manual = error deployment.

### **❌ RAILWAY CONFIGURATION (KRITIS)**

```bash
❌ JANGAN SENTUH FILE INI:
- railway.json
```

**Alasan:** Konfigurasi Railway yang sudah optimal. Mengubah = deployment gagal.

---

## ✅ **FILE YANG BOLEH DIUBAH DENGAN AMAN**

### **✅ PAGE COMPONENTS (AMAN)**

```bash
✅ BOLEH UBAH:
- resources/js/pages/*.tsx (semua halaman)
- resources/js/components/*.tsx
```

### **✅ ROUTES (AMAN)**

```bash
✅ BOLEH UBAH:
- routes/web.php
```

### **✅ ENVIRONMENT VARIABLES (AMAN)**

```bash
✅ BOLEH UBAH:
- .env (local development)
- Railway Dashboard Environment Variables
```

---

## 🔧 **IMPLEMENTASI YANG SUDAH BERHASIL**

### **1. Railway Deployment Setup**

**Masalah:** Website tidak bisa di-deploy ke Railway
**Solusi:** Implementasi Railway dengan Nixpacks auto-detection

**Langkah Implementasi:**

1. **Hapus Procfile** - Biarkan Railway auto-detect Laravel
2. **Buat railway.json minimal:**

```json
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "NIXPACKS"
    }
}
```

3. **Set environment variables di Railway:**

```bash
railway variables --set "APP_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "ASSET_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "DB_CONNECTION=sqlite"
```

4. **Test deployment:**

```bash
git add railway.json
git commit -m "🔧 CONFIG: Add Railway configuration"
git push origin main
```

**Status:** ✅ BERHASIL - Railway auto-detection berfungsi

### **2. ViteManifestNotFoundException Fix**

**Masalah:** `ViteManifestNotFoundException` - manifest.json tidak ditemukan
**Solusi:** Copy manifest.json dari `.vite/` ke lokasi yang Laravel harapkan

**Langkah Implementasi:**

1. **Identifikasi masalah:** Laravel mencari manifest.json di `public/build/manifest.json`
2. **Cek lokasi file:** Vite generate di `public/build/.vite/manifest.json`
3. **Copy file:**

```bash
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
```

4. **Force add ke git:**

```bash
git add -f public/build/
git commit -m "🔧 BUILD: Fix ViteManifestNotFoundException - copy manifest.json"
git push origin main
```

**Status:** ✅ BERHASIL - Manifest.json bisa diakses

### **3. Mixed Content Error Resolution**

**Masalah:** Mixed Content Error - assets di-load via HTTP padahal website HTTPS
**Solusi:** Update Vite config untuk menggunakan relative paths

**Langkah Implementasi:**

1. **Identifikasi masalah:** Assets di-load via HTTP, browser block
2. **Update vite.config.ts:**

```typescript
export default defineConfig({
    // ... existing config
    base: '/build/', // Gunakan relative path
});
```

3. **Set environment variables:**

```bash
railway variables --set "APP_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "ASSET_URL=https://cahayaweb-production.up.railway.app"
```

4. **Buat config/vite.php:**

```php
<?php

return [
    'dev_server' => [
        'url' => env('VITE_DEV_SERVER_URL', 'http://localhost:5173'),
    ],
    'build_path' => 'build',
    'manifest_path' => 'build/manifest.json',
    'hot_file' => 'build/hot',
    'asset_url' => env('ASSET_URL', env('APP_URL')),
];
```

5. **Rebuild dan deploy:**

```bash
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/ config/vite.php vite.config.ts
git commit -m "🔧 FIX: Resolve Mixed Content Error - ensure HTTPS assets"
git push origin main
```

**Status:** ✅ BERHASIL - Semua assets di-load via HTTPS

### **4. Database Configuration**

**Masalah:** `Undefined array key "database"` error saat build
**Solusi:** Konfigurasi database untuk tidak menggunakan database

**Langkah Implementasi:**

1. **Identifikasi masalah:** Railway mencoba run `php artisan migrate --force`
2. **Set environment variable:**

```bash
railway variables --set "DB_CONNECTION=sqlite"
```

3. **Pastikan config/database.php menggunakan sqlite:**

```php
'default' => env('DB_CONNECTION', 'sqlite'),
```

4. **Test deployment:**

```bash
git commit -m "🔧 CONFIG: Set database connection to sqlite"
git push origin main
```

**Status:** ✅ BERHASIL - Build process berjalan lancar

### **5. Build Process Optimization**

**Masalah:** Build assets tidak ter-update otomatis
**Solusi:** Implementasi build process yang reliable

**Langkah Implementasi:**

1. **Pastikan .gitignore tidak ignore build assets:**

```bash
# Uncomment atau hapus line ini di .gitignore
# /public/build
```

2. **Build process manual:**

```bash
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/
git commit -m "🔧 BUILD: Update assets"
git push origin main
```

3. **Test deployment:**

```bash
curl -s -I https://cahayaweb-production.up.railway.app/
```

**Status:** ✅ BERHASIL - Build assets ter-update dengan benar

---

## ❌ **IMPLEMENTASI YANG GAGAL (JANGAN ULANGI!)**

### **❌ Procfile dengan Build Command**

```bash
# GAGAL - Konflik dengan Railway auto-detection
web: npm run build && php artisan serve --host=0.0.0.0 --port=$PORT
```

**Hasil:** ❌ Build process tidak reliable, assets tidak ter-update

### **❌ Nixpacks.toml Custom Configuration**

```toml
# GAGAL - Error dalam Nixpacks build system
[phases.setup]
nixPkgs = ["nodejs", "npm"]

[phases.build]
cmds = ["npm run build"]
```

**Hasil:** ❌ `nix-env` error, deployment gagal

### **❌ Absolute HTTPS URLs di Vite Config**

```typescript
# GAGAL - Mixed Content Error
base: process.env.NODE_ENV === 'production' ? 'https://cahayaweb-production.up.railway.app/build/' : '/',
```

**Hasil:** ❌ Assets tidak bisa di-load, website blank

### **❌ Database Array Driver**

```php
// GAGAL - Railway build process error
'default' => env('DB_CONNECTION', 'array'),
```

**Hasil:** ❌ `Undefined array key "database"` error

---

## 🎯 **PROSEDUR DEPLOYMENT YANG AMAN**

### **✅ SEBELUM SETIAP DEPLOY**

```bash
# 1. Build assets
npm run build

# 2. Copy manifest.json ke lokasi yang benar
cp public/build/.vite/manifest.json public/build/manifest.json

# 3. Test di local
php artisan serve
# Buka browser, test semua fitur

# 4. Commit perubahan
git add -f public/build/
git commit -m "🔧 BUILD: Update assets"

# 5. Push ke Railway
git push origin main
```

### **✅ JIKA ADA ViteManifestNotFoundException**

```bash
# 1. Rebuild assets
npm run build

# 2. Copy manifest.json
cp public/build/.vite/manifest.json public/build/manifest.json

# 3. Force push assets
git add -f public/build/
git commit -m "🔧 BUILD: Fix ViteManifestNotFoundException"
git push origin main

# 4. Wait 2-3 minutes untuk deployment
# 5. Test website
```

### **✅ JIKA ADA Mixed Content Error**

```bash
# 1. Cek environment variables di Railway
railway variables --set "APP_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "ASSET_URL=https://cahayaweb-production.up.railway.app"

# 2. Update vite.config.ts untuk relative paths
# base: '/build/',

# 3. Rebuild dan deploy
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/ vite.config.ts
git commit -m "🔧 FIX: Resolve Mixed Content Error"
git push origin main
```

### **✅ JIKA WEBSITE DOWN TOTAL**

```bash
# 1. Cek Railway logs
railway logs

# 2. Rebuild assets fresh
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json

# 3. Force push semua
git add -f public/build/
git commit -m "🚨 EMERGENCY: Fix website down"
git push origin main

# 4. Wait 5-10 minutes
# 5. Test di incognito mode
```

---

## 🚨 **PERINGATAN KHUSUS**

### **⚠️ JANGAN LAKUKAN:**

1. **Menggunakan Procfile** - biarkan Railway auto-detect
2. **Mengubah vite.config.ts** tanpa testing
3. **Mengubah railway.json** - sudah optimal
4. **Push tanpa rebuild** - selalu `npm run build`
5. **Mengabaikan manifest.json** - selalu copy dari `.vite/`
6. **Menggunakan absolute URLs** di Vite config
7. **Mengubah database config** ke array driver
8. **Mengabaikan environment variables** di Railway
9. **Deploy tanpa testing** di local
10. **Mengubah build assets manual**

### **✅ SELALU LAKUKAN:**

1. **Build assets** sebelum push
2. **Copy manifest.json** ke lokasi yang benar
3. **Test di local** sebelum deploy
4. **Set environment variables** di Railway
5. **Use relative paths** di Vite config
6. **Monitor deployment** status
7. **Test di incognito mode** setelah deploy
8. **Check Railway logs** jika ada error
9. **Backup working state** sebelum eksperimen
10. **Follow deployment procedure** yang sudah ada

---

## 📱 **TESTING PROCEDURES**

### **Local Testing:**

```bash
# 1. Build assets
npm run build

# 2. Copy manifest.json
cp public/build/.vite/manifest.json public/build/manifest.json

# 3. Start server
php artisan serve

# 4. Test di browser
# - Buka http://localhost:8000
# - Cek console untuk errors
# - Test semua halaman
```

### **Production Testing:**

```bash
# 1. Test HTTP response
curl -s -I https://cahayaweb-production.up.railway.app/

# 2. Test manifest.json
curl -s https://cahayaweb-production.up.railway.app/build/manifest.json | head -5

# 3. Test assets
curl -s https://cahayaweb-production.up.railway.app/build/assets/app-BcAkxhND.css | head -3

# 4. Test di browser incognito
# - Buka https://cahayaweb-production.up.railway.app/
# - Cek console untuk errors
# - Test semua fitur
```

---

## 🔧 **TROUBLESHOOTING QUICK GUIDE**

### **Error: ViteManifestNotFoundException**

```bash
# Fix: Copy manifest.json
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/
git push origin main
```

### **Error: Mixed Content Error**

```bash
# Fix: Update Vite config dan environment variables
# 1. Update vite.config.ts: base: '/build/'
# 2. Set Railway variables:
railway variables --set "APP_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "ASSET_URL=https://cahayaweb-production.up.railway.app"
# 3. Rebuild dan deploy
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/ vite.config.ts
git push origin main
```

### **Error: Undefined array key "database"**

```bash
# Fix: Set database connection
railway variables --set "DB_CONNECTION=sqlite"
git push origin main
```

### **Error: Build Failed**

```bash
# Fix: Rebuild fresh
rm -rf public/build/
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/
git push origin main
```

### **Error: Website Down (HTTP 500)**

```bash
# Fix: Check logs dan rebuild
railway logs
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/
git commit -m "🚨 EMERGENCY: Fix website down"
git push origin main
```

---

## 📚 **FITUR YANG SUDAH ADA**

### **✅ Halaman Lengkap:**

- Landing page dengan select mode (B2B/B2C)
- Home page dengan hero section
- About page
- Destinations page
- Packages page dengan detail
- Highlights page
- Blog page
- Contact page
- B2B dashboard

### **✅ Fitur Khusus:**

- Inertia.js + React frontend
- TypeScript support
- Tailwind CSS styling
- Responsive design
- Dark mode support
- SEO optimized

### **✅ Konfigurasi:**

- Laravel 11 backend
- Vite build system
- Railway deployment
- SQLite database (development)
- Environment variables

---

## 🎯 **COMMIT MESSAGE TEMPLATE**

### **✅ Format yang Benar:**

```bash
🔧 BUILD: Update assets with [feature]
✨ FEATURE: Add [feature] with [details]
🔄 MERGE: Complete merge from [branch]
🔧 FIX: Resolve [issue] in [file]
🚨 EMERGENCY: Fix website down
🔧 CONFIG: Update [configuration]
```

### **❌ Format yang Salah:**

```bash
update
fix
merge
```

---

## 🚨 **EMERGENCY CONTACTS**

### **Jika Website Down Total:**

1. **Check Railway logs:** `railway logs`
2. **Verify manifest.json:** exists di `public/build/`
3. **Check environment variables:** di Railway Dashboard
4. **Rebuild assets:** `npm run build`

### **Jika Masih Ada Masalah:**

1. **Rollback ke commit stabil** terakhir
2. **Rebuild assets fresh**
3. **Test di incognito mode**
4. **Check console errors**

---

## 🎉 **KESIMPULAN**

### **✅ FOUNDATION YANG STABIL:**

- Railway deployment dengan Nixpacks auto-detection
- Vite build system yang optimal
- HTTPS assets tanpa Mixed Content Error
- Manifest.json di lokasi yang benar

### **✅ DEPLOYMENT YANG AMAN:**

- Selalu rebuild assets sebelum push
- Copy manifest.json ke lokasi yang benar
- Set environment variables di Railway
- Test di local sebelum deploy

### **✅ WEBSITE STATUS:**

- Semua fitur lengkap
- Performance optimal
- HTTPS secure
- SEO optimized
- Ready for production

---

## 📞 **SUPPORT**

**Jika ada masalah:**

1. **Baca guide ini** terlebih dahulu
2. **Check troubleshooting** section
3. **Follow emergency procedures**
4. **Test di incognito mode**
5. **Wait 2-3 minutes** untuk deployment

---

**Dokumentasi ini adalah panduan LENGKAP untuk menghindari semua kesalahan yang pernah terjadi dan memastikan deployment yang aman!** 🚀

**PENTING: Cursor Chat Baru harus mengikuti panduan ini dengan KETAT untuk menghindari kerusakan website!** ⚠️

---

## 🆕 **UNTUK CURSOR CHAT BARU**

### **📋 CHECKLIST SEBELUM MULAI:**

- [ ] **Baca file ini** dari awal sampai akhir
- [ ] **Pahami file sensitif** yang tidak boleh diubah
- [ ] **Cek project structure** dan tech stack
- [ ] **Review implementasi berhasil** yang sudah ada
- [ ] **Pahami prosedur deployment** yang aman

### **🚀 LANGKAH PERTAMA YANG HARUS DILAKUKAN:**

1. **Buka terminal** di project directory
2. **Jalankan:** `cat CURSOR-CHAT-GUIDE.md`
3. **Baca section "FILE-FILE SANGAT SENSITIF"**
4. **Pahami "PROSEDUR DEPLOYMENT YANG AMAN"**
5. **Review "IMPLEMENTASI YANG SUDAH BERHASIL"**

### **❓ JIKA ADA PERTANYAAN:**

1. **Cari di file ini** terlebih dahulu dengan `Ctrl+F`
2. **Check troubleshooting section** untuk solusi
3. **Review emergency procedures** jika ada masalah
4. **Ikuti best practices** yang sudah ditulis

### **🔧 JIKA INGIN MENAMBAH FITUR BARU:**

1. **Identifikasi file yang aman** untuk diubah
2. **Follow deployment procedure** yang sudah ada
3. **Test di local** sebelum push
4. **Build assets** sebelum deploy
5. **Monitor deployment** status

### **📞 JIKA ADA MASALAH:**

1. **Check troubleshooting guide** di file ini
2. **Follow emergency procedures** jika website down
3. **Review "IMPLEMENTASI YANG GAGAL"** untuk menghindari kesalahan
4. **Use incognito mode** untuk testing

---

## 🔍 **DETAILED IMPLEMENTATION HISTORY**

### **Phase 1: Initial Railway Setup**

**Problem:** Website tidak bisa di-deploy ke Railway
**Solution:** Implementasi Railway dengan Nixpacks auto-detection

**Steps:**

1. **Remove Procfile** - Let Railway auto-detect Laravel
2. **Create minimal railway.json:**

```json
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "NIXPACKS"
    }
}
```

3. **Set environment variables:**

```bash
railway variables --set "APP_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "ASSET_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "DB_CONNECTION=sqlite"
```

4. **Deploy and test:**

```bash
git add railway.json
git commit -m "🔧 CONFIG: Add Railway configuration"
git push origin main
```

**Result:** ✅ Railway auto-detection working

### **Phase 2: ViteManifestNotFoundException**

**Problem:** `ViteManifestNotFoundException` - manifest.json not found
**Solution:** Copy manifest.json from `.vite/` to Laravel expected location

**Steps:**

1. **Identify issue:** Laravel looking for manifest.json in `public/build/manifest.json`
2. **Check file location:** Vite generates in `public/build/.vite/manifest.json`
3. **Copy file:**

```bash
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
```

4. **Force add to git:**

```bash
git add -f public/build/
git commit -m "🔧 BUILD: Fix ViteManifestNotFoundException - copy manifest.json"
git push origin main
```

**Result:** ✅ Manifest.json accessible

### **Phase 3: Mixed Content Error**

**Problem:** Mixed Content Error - assets loaded via HTTP while website HTTPS
**Solution:** Update Vite config to use relative paths

**Steps:**

1. **Identify issue:** Assets loaded via HTTP, browser blocking
2. **Update vite.config.ts:**

```typescript
export default defineConfig({
    // ... existing config
    base: '/build/', // Use relative path
});
```

3. **Set environment variables:**

```bash
railway variables --set "APP_URL=https://cahayaweb-production.up.railway.app"
railway variables --set "ASSET_URL=https://cahayaweb-production.up.railway.app"
```

4. **Create config/vite.php:**

```php
<?php

return [
    'dev_server' => [
        'url' => env('VITE_DEV_SERVER_URL', 'http://localhost:5173'),
    ],
    'build_path' => 'build',
    'manifest_path' => 'build/manifest.json',
    'hot_file' => 'build/hot',
    'asset_url' => env('ASSET_URL', env('APP_URL')),
];
```

5. **Rebuild and deploy:**

```bash
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/ config/vite.php vite.config.ts
git commit -m "🔧 FIX: Resolve Mixed Content Error - ensure HTTPS assets"
git push origin main
```

**Result:** ✅ All assets loaded via HTTPS

### **Phase 4: Database Configuration**

**Problem:** `Undefined array key "database"` error during build
**Solution:** Configure database to not use database

**Steps:**

1. **Identify issue:** Railway trying to run `php artisan migrate --force`
2. **Set environment variable:**

```bash
railway variables --set "DB_CONNECTION=sqlite"
```

3. **Ensure config/database.php uses sqlite:**

```php
'default' => env('DB_CONNECTION', 'sqlite'),
```

4. **Test deployment:**

```bash
git commit -m "🔧 CONFIG: Set database connection to sqlite"
git push origin main
```

**Result:** ✅ Build process running smoothly

### **Phase 5: Final Optimization**

**Problem:** Build assets not updated automatically
**Solution:** Implement reliable build process

**Steps:**

1. **Ensure .gitignore doesn't ignore build assets:**

```bash
# Uncomment or remove this line in .gitignore
# /public/build
```

2. **Manual build process:**

```bash
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json
git add -f public/build/
git commit -m "🔧 BUILD: Update assets"
git push origin main
```

3. **Test deployment:**

```bash
curl -s -I https://cahayaweb-production.up.railway.app/
```

**Result:** ✅ Build assets updated correctly

---

## 🎯 **TUJUAN FILE INI:**

**Memastikan Cursor Chat baru bisa langsung paham project tanpa trial and error, dan menghindari kerusakan website yang sudah stabil!**

**Dokumentasi ini mencakup SEMUA implementasi yang berhasil dan gagal, sehingga Cursor Chat baru bisa belajar dari pengalaman dan menghindari kesalahan yang sama!** 🚀
