# 🛡️ DEPLOYMENT SAFETY GUIDE

## 📋 Overview

Berdasarkan analisa mendalam dari `CURSOR-CHAT-GUIDE.md` dan best practices, dokumen ini menjelaskan prosedur deployment yang aman untuk project Cahayaweb.

---

## 🚨 CRITICAL FILES - JANGAN DIUBAH

### ❌ File Sensitif:
- `vite.config.ts` - Konfigurasi Vite yang sudah optimal
- `config/vite.php` - Laravel Vite config
- `package.json` dependencies - Jangan ubah tanpa testing
- `public/build/manifest.json` - Auto-generated
- `public/build/assets/*` - Auto-generated
- `railway.json` - Konfigurasi Railway optimal

---

## ✅ SAFE DEPLOYMENT PROCEDURE

### **Metode 1: Menggunakan Safe Deploy Script (Recommended)**

```bash
# 1. Pre-deployment check
./scripts/pre-deploy-check.sh

# 2. Safe deployment
./scripts/safe-deploy.sh "🔧 BUILD: Your commit message"
```

Script ini akan otomatis:
- ✅ Cek semua requirements
- ✅ Buat backup branch
- ✅ Build assets
- ✅ Copy manifest.json
- ✅ Verify build files
- ✅ Commit & push dengan aman

### **Metode 2: Manual Deployment**

```bash
# 1. Pre-deployment checks
git status                    # Pastikan tidak ada uncommitted changes
git branch                    # Pastikan di branch main

# 2. Create backup
git branch backup-pre-deploy-$(date +%Y%m%d-%H%M%S)

# 3. Build assets
npm run build

# 4. Copy manifest (CRITICAL!)
cp public/build/.vite/manifest.json public/build/manifest.json

# 5. Test locally (RECOMMENDED)
php artisan serve
# Test di browser: http://localhost:8000

# 6. Stage & commit
git add -f public/build/
git commit -m "🔧 BUILD: Your commit message"

# 7. Push to Railway
git push origin main

# 8. Monitor deployment
railway logs
```

---

## 🔄 ROLLBACK PROCEDURE

### **Menggunakan Rollback Script:**

```bash
# Rollback ke commit atau branch tertentu
./scripts/rollback.sh [commit-hash|branch-name]

# Contoh:
./scripts/rollback.sh backup-pre-deploy-20260123-120000
./scripts/rollback.sh 62f9198
```

### **Manual Rollback:**

```bash
# 1. List backup branches
git branch --list | grep backup-

# 2. Rollback ke backup branch
git reset --hard backup-pre-deploy-20260123-120000

# 3. Rebuild assets
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json

# 4. Commit rebuild
git add -f public/build/
git commit -m "🔄 ROLLBACK: Rebuild assets after rollback"

# 5. Force push (HATI-HATI!)
git push origin main --force
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Sebelum setiap deployment, pastikan:

- [ ] **Git Status**
  - [ ] Di branch `main`
  - [ ] Tidak ada uncommitted changes
  - [ ] Remote repository terkoneksi

- [ ] **Dependencies**
  - [ ] `node_modules` terinstall (`npm install`)
  - [ ] `composer.json` dependencies terinstall (jika ada)

- [ ] **Build Process**
  - [ ] `npm run build` berhasil tanpa error
  - [ ] Manifest file ter-copy: `public/build/manifest.json`
  - [ ] Assets directory ada: `public/build/assets/`

- [ ] **Testing**
  - [ ] Test di local: `php artisan serve`
  - [ ] Test semua halaman utama
  - [ ] Test B2B/B2C navigation
  - [ ] Cek browser console untuk errors

- [ ] **Railway**
  - [ ] Railway CLI terinstall
  - [ ] Sudah login: `railway login`
  - [ ] Environment variables sudah di-set

- [ ] **Backup**
  - [ ] Backup branch sudah dibuat
  - [ ] Commit hash dicatat untuk rollback

---

## 📦 CACHE HEADERS UNTUK BUILD ASSETS

Agar 4G/sinyal lemah lebih cepat pada kunjungan berikutnya, set cache lama untuk aset yang di-hash (`/build/assets/*`).

### Nginx (Railway / VPS)

Tambahkan di dalam `server { ... }`:

```nginx
location /build/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### Apache (.htaccess di root `public/`)

Jika Anda menyajikan dari `public/`, tambahkan di `public/.htaccess`:

```apache
<IfModule mod_headers.c>
    <FilesMatch "\.(js|css|woff2?|ttf|eot)$">
        <If "%{REQUEST_URI} =~ m#^/build/#">
            Header set Cache-Control "public, max-age=31536000, immutable"
        </If>
    </FilesMatch>
</IfModule>
```

Atau untuk seluruh folder build:

```apache
<IfModule mod_headers.c>
    SetEnvIf Request_URI "^/build/" is_build_asset
    Header set Cache-Control "public, max-age=31536000, immutable" env=is_build_asset
</IfModule>
```

---

## 🚨 EMERGENCY PROCEDURES

### **Jika Website Down:**

```bash
# 1. Check Railway logs
railway logs

# 2. Check manifest.json exists
ls -la public/build/manifest.json

# 3. Rebuild assets fresh
npm run build
cp public/build/.vite/manifest.json public/build/manifest.json

# 4. Force push
git add -f public/build/
git commit -m "🚨 EMERGENCY: Fix website down"
git push origin main

# 5. Wait 5-10 minutes
# 6. Test di incognito mode
```

### **Jika ViteManifestNotFoundException:**

```bash
# 1. Rebuild assets
npm run build

# 2. Copy manifest (CRITICAL!)
cp public/build/.vite/manifest.json public/build/manifest.json

# 3. Force push
git add -f public/build/
git commit -m "🔧 BUILD: Fix ViteManifestNotFoundException"
git push origin main
```

### **Jika Build Fails:**

```bash
# 1. Clear cache
rm -rf node_modules package-lock.json
npm install

# 2. Rebuild
npm run build

# 3. If still fails, check:
#    - Node.js version compatibility
#    - Package.json dependencies
#    - Error messages in build output
```

---

## 📊 POST-DEPLOYMENT MONITORING

Setelah deployment:

1. **Monitor Railway Logs:**
   ```bash
   railway logs
   ```

2. **Test Website:**
   - Buka: https://cahayaanbiya.com
   - Test di incognito mode
   - Cek browser console untuk errors
   - Test semua fitur utama

3. **Verify Assets:**
   ```bash
   curl -I https://cahayaanbiya.com/build/manifest.json
   ```

4. **Check Environment Variables:**
   ```bash
   railway variables
   ```

---

## 🎯 COMMIT MESSAGE TEMPLATE

### ✅ Format yang Benar:

```bash
🔧 BUILD: Update assets with [feature]
✨ FEATURE: Add [feature] with [details]
🔄 MERGE: Complete merge from [branch]
🔧 FIX: Resolve [issue] in [file]
🚨 EMERGENCY: Fix website down
🔄 ROLLBACK: Rebuild assets after rollback
```

### ❌ Format yang Salah:

```bash
update
fix
merge
deploy
```

---

## ⚠️ JANGAN LAKUKAN

1. ❌ Push tanpa rebuild assets
2. ❌ Mengabaikan copy manifest.json
3. ❌ Deploy tanpa testing di local
4. ❌ Mengubah file sensitif tanpa backup
5. ❌ Force push tanpa backup branch
6. ❌ Deploy di branch selain main
7. ❌ Mengubah vite.config.ts tanpa testing
8. ❌ Mengubah railway.json
9. ❌ Mengubah build assets manual
10. ❌ Deploy tanpa monitoring logs

---

## ✅ SELALU LAKUKAN

1. ✅ Build assets sebelum push
2. ✅ Copy manifest.json ke lokasi yang benar
3. ✅ Test di local sebelum deploy
4. ✅ Buat backup branch sebelum deploy
5. ✅ Monitor deployment status
6. ✅ Test di incognito mode setelah deploy
7. ✅ Check Railway logs jika ada error
8. ✅ Follow deployment procedure yang sudah ada
9. ✅ Gunakan commit message yang jelas
10. ✅ Verify environment variables di Railway

---

## 🔧 TROUBLESHOOTING

### **Problem: Build Fails**
- **Solution:** Clear cache, reinstall dependencies, check Node.js version

### **Problem: Manifest Not Found**
- **Solution:** Copy manifest: `cp public/build/.vite/manifest.json public/build/manifest.json`

### **Problem: Mixed Content Error**
- **Solution:** Update environment variables di Railway untuk HTTPS

### **Problem: B2B/B2C Navigation Not Working**
- **Solution:** Check Ziggy configuration, verify HTTPS enforcement

### **Problem: Website Down After Deploy**
- **Solution:** Rollback ke backup branch, rebuild assets, redeploy

---

## 📞 SUPPORT

Jika ada masalah:

1. **Check logs:** `railway logs`
2. **Review this guide:** Cari solusi di troubleshooting
3. **Rollback if needed:** Gunakan rollback script
4. **Test locally:** Pastikan bekerja di local sebelum deploy ulang

---

## 🎉 BEST PRACTICES SUMMARY

1. **Always backup** sebelum deploy
2. **Always test** di local sebelum push
3. **Always build** assets sebelum commit
4. **Always copy** manifest.json
5. **Always monitor** deployment logs
6. **Always verify** setelah deploy
7. **Always rollback** jika ada masalah

---

**Dokumentasi ini adalah panduan LENGKAP untuk deployment yang aman berdasarkan analisa mendalam dari CURSOR-CHAT-GUIDE.md dan best practices!** 🚀
