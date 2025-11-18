# 🔗 Railway Service Connection - API Method

## Status Saat Ini

✅ **Database sudah menggunakan internal connection:**
- `DB_HOST`: `mysql.railway.internal` (internal Railway network)
- Koneksi sudah benar dan berfungsi

## Cara Membuat Panah Koneksi Muncul di Architecture View

Railway Architecture view menampilkan panah koneksi ketika services menggunakan **service reference variables** dengan format:
```
${{ServiceName.VARIABLE}}
```

### Metode 1: Melalui Railway Dashboard (Paling Mudah & Recommended) ⭐

1. **Buka Railway Dashboard:**
   - https://railway.app → Project **Cahayaweb** → Service **Cahayaweb**

2. **Edit Variables:**
   - Klik tab **Variables**
   - Edit setiap variable berikut dengan **nilai service reference**:

   ```
   DB_HOST = ${{MySQL.MYSQLHOST}}
   DB_PORT = ${{MySQL.MYSQLPORT}}
   DB_USERNAME = ${{MySQL.MYSQLUSER}}
   DB_PASSWORD = ${{MySQL.MYSQLPASSWORD}}
   DB_DATABASE = ${{MySQL.MYSQLDATABASE}}
   ```

3. **Save** dan Railway akan otomatis:
   - Menampilkan panah koneksi di Architecture view
   - Mengupdate variables dengan service references

### Metode 2: Melalui Railway CLI (Jika Dashboard tidak tersedia)

Railway CLI mungkin tidak langsung support service references. Alternatif:

```bash
# Option A: Gunakan Railway Dashboard API (jika tersedia)
# Atau hubungkan services melalui dashboard

# Option B: Pastikan services dalam environment yang sama
railway status  # Verify current service
```

### Verifikasi Koneksi

Setelah update, verifikasi:

```bash
# 1. Check variables
railway variables | grep DB_

# 2. Test database connection
railway shell
php artisan tinker
DB::connection()->getPdo(); // Should return PDO object
```

### Catatan Penting

1. **Service References** (`${{ServiceName.VARIABLE}}`) adalah cara Railway mengenali dependencies
2. Railway Architecture view **hanya menampilkan panah** ketika variables menggunakan service references
3. Nama service harus **exact match** dengan nama di Railway Dashboard
4. Saat ini menggunakan **internal connection** (`mysql.railway.internal`) yang sudah benar untuk koneksi internal

### Troubleshooting

**Jika panah tidak muncul setelah update:**
1. Refresh browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R)
2. Pastikan kedua services dalam **environment yang sama** (production)
3. Cek nama service MySQL di Dashboard (case-sensitive)
4. Tunggu beberapa detik untuk Railway memproses perubahan

**Jika variables error:**
- Pastikan MySQL service sudah running
- Cek apakah service MySQL expose variables (MYSQLHOST, MYSQLPORT, dll)
- Gunakan Dashboard method untuk auto-setup

## Current Status

✅ Database connection: **Working** (using internal host)
✅ Error handling: **Improved** (robust restore functionality)
⏳ Architecture arrow: **Needs service references** (update via Dashboard)

