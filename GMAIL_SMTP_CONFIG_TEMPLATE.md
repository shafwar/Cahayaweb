# Gmail SMTP Configuration Template 📧⚙️

## 🎯 **CURRENT .env MAIL CONFIGURATION**

```env
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="cahayaanbiya.travel@gmail.com"
MAIL_FROM_NAME="Cahaya Anbiya Travel"
MAIL_ENCRYPTION=tls
```

## ✅ **UPDATED .env MAIL CONFIGURATION (Gmail SMTP)**

```env
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=cahayaanbiya.travel@gmail.com
MAIL_PASSWORD=YOUR_16_CHAR_APP_PASSWORD_HERE
MAIL_FROM_ADDRESS="cahayaanbiya.travel@gmail.com"
MAIL_FROM_NAME="Cahaya Anbiya Travel"
MAIL_ENCRYPTION=tls
```

## 🔧 **WHAT NEEDS TO BE UPDATED**

### **Changes Required:**

1. **MAIL_USERNAME**: `null` → `cahayaanbiya.travel@gmail.com`
2. **MAIL_PASSWORD**: `null` → `YOUR_16_CHAR_APP_PASSWORD_HERE`

### **Already Correct:**

- ✅ **MAIL_MAILER**: `smtp` (correct)
- ✅ **MAIL_HOST**: `smtp.gmail.com` (correct)
- ✅ **MAIL_PORT**: `587` (correct)
- ✅ **MAIL_ENCRYPTION**: `tls` (correct)
- ✅ **MAIL_FROM_ADDRESS**: `cahayaanbiya.travel@gmail.com` (correct)
- ✅ **MAIL_FROM_NAME**: `Cahaya Anbiya Travel` (correct)

## 📝 **INSTRUCTIONS FOR USER**

### **Step 1: Get Gmail App Password**

1. Go to: https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords → Generate for "Mail"
4. Copy the 16-character password

### **Step 2: Update .env File**

Replace these lines in your `.env` file:

```env
# OLD
MAIL_USERNAME=null
MAIL_PASSWORD=null

# NEW (replace with your actual app password)
MAIL_USERNAME=cahayaanbiya.travel@gmail.com
MAIL_PASSWORD=your-16-char-app-password-here
```

### **Step 3: Test Configuration**

```bash
php artisan config:clear
php artisan cache:clear
```

## 🧪 **TESTING COMMANDS**

### **Test 1: Basic SMTP Connection**

```bash
php artisan tinker --execute="
Mail::raw('Test email from Cahaya Anbiya Travel', function(\$message) {
    \$message->to('naufalshafi15@gmail.com')
            ->subject('Test Email - Gmail SMTP Configuration');
});
echo 'Test email sent successfully!';
"
```

### **Test 2: B2B Booking Email**

```bash
php artisan tinker --execute="
\$booking = App\Models\B2BBooking::latest()->first();
\$emailService = app(App\Services\EmailService::class);
\$result = \$emailService->sendInvoice(\$booking);
echo 'Email result: ' . json_encode(\$result);
"
```

## 🎯 **EXPECTED RESULTS**

### **Success Indicators:**

- ✅ No SMTP authentication errors
- ✅ Email delivered to inbox
- ✅ Email content complete with invoice
- ✅ PDF attachment included

### **Error Indicators:**

- ❌ "Authentication Required" error
- ❌ "Invalid credentials" error
- ❌ "Connection refused" error

## 🚀 **READY FOR SETUP**

**Template siap untuk update konfigurasi Gmail SMTP!**

**Silakan:**

1. **Buat Gmail App Password** (jika belum)
2. **Berikan 16-character password** untuk saya update
3. **Test email delivery** setelah konfigurasi

**Gmail SMTP setup akan selesai dalam 5 menit!** ⚡
