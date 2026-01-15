# Railway Admin Setup Guide

## Admin Account Credentials

Setelah deployment, admin account akan otomatis dibuat dengan credentials berikut:

- **Email**: `admin@cahayaweb.com`
- **Password**: `Admin123!`

## Environment Variables di Railway

Pastikan environment variables berikut sudah diset di Railway Dashboard:

```
APP_ADMIN_EMAILS=admin@cahayaweb.com
NIXPACKS_NODE_VERSION=20
```

**Penting:** `NIXPACKS_NODE_VERSION=20` diperlukan untuk memastikan Railway menggunakan Node.js 20 (bukan 18 default) yang diperlukan oleh `vite@7.0.6` dan `laravel-vite-plugin@2.0.0`.

## Cara Setup di Railway

1. Buka Railway Dashboard → Project Anda → Service Cahayaweb
2. Klik tab **Variables**
3. Tambahkan atau update variable:
   - **Key**: `APP_ADMIN_EMAILS`
   - **Value**: `admin@cahayaweb.com`
4. Save dan tunggu deployment selesai

## Testing Admin Login

1. Buka URL deployment Anda: `https://your-app.up.railway.app/admin`
2. Login dengan:
   - Email: `admin@cahayaweb.com`
   - Password: `Admin123!`
3. Anda akan di-redirect ke Admin Dashboard

## Troubleshooting

Jika masih tidak bisa login:

1. **Cek Environment Variables**: Pastikan `APP_ADMIN_EMAILS` sudah diset di Railway
2. **Cek Database**: Pastikan user admin sudah dibuat (seeder akan otomatis berjalan saat deployment)
3. **Cek Logs**: Lihat Railway logs untuk melihat error yang terjadi
4. **Clear Cache**: Jika perlu, jalankan `php artisan config:clear` di Railway shell

## Manual Admin Creation (Jika Seeder Gagal)

Jika seeder tidak berjalan, Anda bisa membuat admin secara manual:

```bash
# Via Railway Shell
railway shell
php artisan tinker

# Di tinker, jalankan:
$user = \App\Models\User::create([
    'name' => 'Admin Cahaya Anbiya',
    'email' => 'admin@cahayaweb.com',
    'password' => \Illuminate\Support\Facades\Hash::make('Admin123!'),
    'email_verified_at' => now(),
]);
```

## Catatan Penting

- Password default adalah `Admin123!` - **SANGAT DISARANKAN** untuk mengganti password setelah login pertama kali
- Email admin harus sesuai dengan `APP_ADMIN_EMAILS` di environment variables
- Seeder akan otomatis berjalan setiap kali deployment jika ada migration baru
