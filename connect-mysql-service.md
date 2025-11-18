# 🔗 Cara Menghubungkan MySQL Service di Railway

## Opsi 1: Melalui Railway Dashboard (Paling Mudah) ⭐

1. **Buka Railway Dashboard:**
   - Login ke https://railway.app
   - Pilih project **Cahayaweb**
   - Klik tab **Architecture**

2. **Hubungkan Services:**
   - Di Architecture view, Anda akan melihat service **Cahayaweb** dan **MySQL**
   - **Klik dan drag** dari service **Cahayaweb** ke service **MySQL**
   - Atau klik service **Cahayaweb** → **Settings** → **Dependencies** → Add **MySQL**

3. **Railway akan otomatis:**
   - Membuat environment variables yang menghubungkan kedua services
   - Menampilkan panah koneksi di Architecture view
   - Mengupdate variables dengan service references

## Opsi 2: Melalui Terminal (Manual)

Jika MySQL service Anda bernama **MySQL**, jalankan:

```bash
./update-railway-variables.sh
```

**Atau manual:**

```bash
# Ganti 'MySQL' dengan nama service MySQL Anda jika berbeda
railway variables --set "DB_HOST=\${{MySQL.MYSQLHOST}}"
railway variables --set "DB_PORT=\${{MySQL.MYSQLPORT}}"
railway variables --set "DB_USERNAME=\${{MySQL.MYSQLUSER}}"
railway variables --set "DB_PASSWORD=\${{MySQL.MYSQLPASSWORD}}"
railway variables --set "DB_DATABASE=\${{MySQL.MYSQLDATABASE}}"
```

## Verifikasi

Setelah menghubungkan:

1. **Refresh Architecture view** di Railway Dashboard
2. **Panah koneksi** akan muncul antara Cahayaweb ↔ MySQL
3. **Test koneksi:**
   ```bash
   railway variables | grep DB_
   railway shell
   php artisan tinker
   DB::connection()->getPdo(); // Harus berhasil
   ```

## Troubleshooting

**Jika panah tidak muncul:**
- Pastikan kedua services dalam **environment yang sama** (production)
- Cek nama service MySQL di Dashboard (mungkin bukan "MySQL")
- Refresh browser setelah update variables
- Coba reconnect services di Architecture view

**Jika variables error:**
- Pastikan MySQL service sudah running
- Cek apakah service MySQL expose variables (MYSQLHOST, MYSQLPORT, dll)
- Gunakan Opsi 1 (Dashboard) untuk auto-setup
