# B2B Booking & Payment Flow - Setup Guide

## 🎯 Overview

This implementation provides a complete B2B booking and payment flow for Cahaya Web with the following features:

- **Simplified Status Flow**: `pending` → `confirmed`/`rejected`
- **Email Primary**: All notifications sent via email first
- **WhatsApp Secondary**: Backup notifications via WhatsApp
- **Admin Panel**: Real-time booking management with status timeline
- **Payment Proof Upload**: Partners can upload payment proof
- **Status History Tracking**: Complete audit trail of all status changes

## 🗄️ Database Setup

### 1. Run Migrations

```bash
php artisan migrate
```

This will create/update the `b2b_bookings` table with the new simplified schema.

### 2. Database Schema

```sql
CREATE TABLE b2b_bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(255) UNIQUE,
    invoice_number VARCHAR(255) UNIQUE,
    partner_id BIGINT,
    package_id BIGINT,
    travelers_count INT DEFAULT 1,
    total_amount DECIMAL(15,2),
    b2b_discount DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'IDR',
    status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending',
    status_history JSON,
    payment_proof VARCHAR(255) NULL,
    admin_notes TEXT NULL,
    invoice_url VARCHAR(255) NULL,
    invoice_pdf_path VARCHAR(255) NULL,
    traveler_details JSON,
    special_requests JSON,
    processed_by BIGINT NULL,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (partner_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES packages(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);
```

## 🔧 Configuration

### 1. Environment Variables

Add these to your `.env` file:

```env
# WhatsApp Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ADMIN_PHONE_NUMBER=+6281234567890
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token_here

# Email Configuration (Primary notification channel)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@cahaya-anbiya.com
MAIL_FROM_NAME="Cahaya Anbiya Travel"

# SendGrid Configuration (Alternative)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@cahaya-anbiya.com
SENDGRID_FROM_NAME="Cahaya Anbiya Travel"
```

### 2. WhatsApp Business API Setup

1. Create a Facebook Business Account
2. Set up WhatsApp Business API
3. Get your access token and phone number ID
4. Configure webhook for receiving messages

### 3. Email Service Setup

Choose one of these options:

**Option A: Gmail SMTP**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
```

**Option B: SendGrid**

```env
MAIL_MAILER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 🚀 API Endpoints

### B2B Partner Endpoints

```php
// Create booking
POST /b2b/bookings
{
    "package_id": 1,
    "travelers_count": 2,
    "traveler_details": [
        {
            "name": "John Doe",
            "passport_number": "A1234567",
            "date_of_birth": "1990-01-01",
            "phone": "+6281234567890",
            "email": "john@example.com"
        }
    ],
    "special_requests": ["Wheelchair accessible room"]
}

// Get partner's bookings
GET /b2b/bookings

// Get specific booking
GET /b2b/bookings/{id}

// Upload payment proof
POST /b2b/bookings/{id}/upload-proof
{
    "payment_proof": "file"
}

// Cancel booking
POST /b2b/bookings/{id}/cancel
{
    "reason": "Change of plans"
}
```

### Admin Endpoints

```php
// Get all bookings with filters
GET /admin/b2b-bookings?status=pending&search=CA-B2B

// Get booking details
GET /admin/b2b-bookings/{id}

// Update booking status
PATCH /admin/b2b-bookings/{id}/status
{
    "status": "confirmed",
    "notes": "Payment verified"
}

// Send payment details
POST /admin/b2b-bookings/{id}/send-payment-details

// Send confirmation
POST /admin/b2b-bookings/{id}/send-confirmation

// Bulk update status
POST /admin/b2b-bookings/bulk-update
{
    "booking_ids": [1, 2, 3],
    "status": "confirmed",
    "notes": "Bulk confirmation"
}
```

## 📱 Frontend Components

### 1. B2B Booking Creation

**File**: `resources/js/pages/b2b/booking/create.tsx`

Features:

- Multi-traveler form
- Real-time pricing calculation
- Form validation
- Special requests handling

### 2. Admin Panel

**Files**:

- `resources/js/pages/admin/b2b-bookings/index.tsx` - Booking list
- `resources/js/pages/admin/b2b-bookings/show.tsx` - Booking details

Features:

- Real-time status updates
- Status timeline with history
- Bulk operations
- Payment proof download
- Search and filtering

### 3. Package Integration

**File**: `resources/js/pages/b2b/packages/[id].tsx`

Updated with "Book Now" button that redirects to booking creation flow.

## 📧 Email Templates

### 1. Invoice Email

**File**: `resources/views/emails/b2b/invoice.blade.php`

Features:

- Professional design
- Complete booking details
- Payment instructions
- Company branding

### 2. Confirmation Email

**File**: `resources/views/emails/b2b/booking-confirmation.blade.php`

Features:

- Celebration design
- Next steps guidance
- Traveler details
- Important notes

### 3. Cancellation Email

**File**: `resources/views/emails/b2b/booking-cancellation.blade.php`

Features:

- Clear cancellation notice
- Refund information
- Alternative options
- Contact details

## 🔄 Booking Flow

### 1. Partner Flow

```
1. Partner selects package → clicks "Book Now"
2. System generates Booking Summary + Invoice
3. Invoice sent via Email (primary) + WhatsApp (secondary)
4. Booking marked as "pending"
5. Partner uploads payment proof
6. Admin validates and updates status
7. System sends confirmation/rejection
```

### 2. Admin Flow

```
1. Admin receives booking notification
2. Admin reviews booking in Admin Panel
3. Admin validates payment proof
4. Admin updates status (confirmed/rejected)
5. System automatically sends notifications
6. Status history tracked in timeline
```

## 🎨 UI Features

### 1. Status Timeline

- Visual timeline of all status changes
- Admin notes and timestamps
- Color-coded status indicators
- Responsive design

### 2. Real-time Updates

- Live status updates in Admin Panel
- Instant notifications
- Bulk operations support
- Search and filtering

### 3. Mobile Responsive

- Optimized for all devices
- Touch-friendly interface
- Progressive enhancement
- Fast loading

## 🔒 Security Features

- Authentication required for all endpoints
- Authorization checks (partners can only access their bookings)
- File upload validation
- CSRF protection
- Input sanitization

## 📊 Monitoring & Analytics

- Status change tracking
- Email delivery monitoring
- WhatsApp message logs
- Admin action audit trail
- Performance metrics

## 🚀 Deployment Checklist

1. ✅ Run database migrations
2. ✅ Configure environment variables
3. ✅ Set up WhatsApp Business API
4. ✅ Configure email service
5. ✅ Test booking flow
6. ✅ Test admin panel
7. ✅ Test email templates
8. ✅ Test WhatsApp integration
9. ✅ Set up monitoring
10. ✅ Deploy to production

## 🆘 Troubleshooting

### Common Issues

1. **Email not sending**
    - Check SMTP credentials
    - Verify email service configuration
    - Check spam folder

2. **WhatsApp messages failing**
    - Verify access token
    - Check phone number ID
    - Ensure webhook is configured

3. **File upload issues**
    - Check storage permissions
    - Verify file size limits
    - Check file type restrictions

### Support

For technical support, contact:

- Email: tech@cahaya-anbiya.com
- Phone: +62 21 1234 5678

---

**Built with ❤️ for Cahaya Anbiya Travel**
