# 🔗 Railway Service Connection Guide

## Cara Menampilkan Panah Koneksi di Railway Architecture View

Railway menampilkan panah koneksi antara services ketika:
1. Services saling terhubung melalui **Environment Variables** yang mereferensikan service lain
2. Services dihubungkan secara eksplisit di **Railway Dashboard**

## Metode 1: Menggunakan Service Reference Variables (Recommended)

Untuk menampilkan panah koneksi antara **Cahayaweb** dan **MySQL** service:

### Langkah-langkah:

1. **Buka Railway Dashboard** → Project **Cahayaweb** → Service **Cahayaweb** → Tab **Variables**

2. **Update Database Variables** untuk menggunakan MySQL service reference:
   ```bash
   # Gunakan Railway CLI atau Dashboard
   railway variables --set DB_HOST='${{MySQL.MYSQLHOST}}'
   railway variables --set DB_PORT='${{MySQL.MYSQLPORT}}'
   railway variables --set DB_USERNAME='${{MySQL.MYSQLUSER}}'
   railway variables --set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
   railway variables --set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
   ```

3. **Atau melalui Dashboard:**
   - Klik service **Cahayaweb** → **Variables**
   - Edit `DB_HOST` → Set value: `${{MySQL.MYSQLHOST}}`
   - Edit `DB_PORT` → Set value: `${{MySQL.MYSQLPORT}}`
   - Edit `DB_USERNAME` → Set value: `${{MySQL.MYSQLUSER}}`
   - Edit `DB_PASSWORD` → Set value: `${{MySQL.MYSQLPASSWORD}}`
   - Edit `DB_DATABASE` → Set value: `${{MySQL.MYSQLDATABASE}}`

4. **Setelah update**, Railway akan otomatis menampilkan panah koneksi di **Architecture** view

## Metode 2: Connect Services via Dashboard

1. Buka **Railway Dashboard** → **Architecture** tab
2. Klik service **Cahayaweb**
3. Drag connection line ke service **MySQL**
4. Railway akan otomatis membuat environment variables yang diperlukan

## Verifikasi Koneksi

Setelah setup, verifikasi dengan:

```bash
# Check variables
railway variables | grep DB_

# Test database connection (via Railway shell)
railway shell
php artisan tinker
DB::connection()->getPdo();
```

## Catatan Penting

- **Service Reference Variables** (`${{ServiceName.VARIABLE}}`) adalah cara terbaik untuk menghubungkan services
- Railway akan otomatis menampilkan panah koneksi ketika variables menggunakan service references
- Pastikan nama service **MySQL** sesuai dengan nama di Railway dashboard Anda
- Jika service MySQL Anda memiliki nama berbeda, ganti `MySQL` dengan nama service yang benar

## Troubleshooting

Jika panah koneksi tidak muncul:

1. **Cek nama service MySQL:**
   ```bash
   # Lihat di Railway Dashboard → Architecture
   # Pastikan nama service sesuai
   ```

2. **Verifikasi variables:**
   ```bash
   railway variables | grep '\${{'
   # Harus menampilkan service references
   ```

3. **Refresh Architecture view** di Railway Dashboard

4. **Pastikan kedua services dalam environment yang sama** (production)

## Current Setup

Saat ini database menggunakan **public proxy host** (`shuttle.proxy.rlwy.net`). Untuk menampilkan panah koneksi, disarankan menggunakan **service reference variables** seperti di atas.

**Keuntungan Service Reference:**
- ✅ Menampilkan panah koneksi di Architecture view
- ✅ Otomatis update jika MySQL service berubah
- ✅ Lebih aman (internal connection)
- ✅ Railway dapat mengoptimalkan network routing

