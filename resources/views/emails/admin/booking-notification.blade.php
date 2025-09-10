<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Notification - {{ $booking->booking_reference }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .notification-badge {
            background: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
            border: 2px solid #f59e0b;
        }
        .booking-details {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .detail-label {
            font-weight: 600;
            color: #666;
        }
        .detail-value {
            font-weight: 500;
        }
        .partner-info {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .partner-title {
            font-size: 18px;
            font-weight: 700;
            color: #166534;
            margin-bottom: 15px;
        }
        .package-info {
            background: #fef7ff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .package-title {
            font-size: 18px;
            font-weight: 700;
            color: #7c2d12;
            margin-bottom: 15px;
        }
        .action-section {
            background: #fef2f2;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #fca5a5;
            margin-bottom: 30px;
        }
        .action-title {
            font-size: 18px;
            font-weight: 600;
            color: #dc2626;
            margin-bottom: 15px;
        }
        .action-button {
            display: inline-block;
            background: #dc2626;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 10px;
        }
        .footer {
            background: #2d3748;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .highlight {
            background: #dbeafe;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🔔 Admin Notification</h1>
            <p>Cahaya Anbiya Travel - Admin Panel</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Notification Badge -->
            <div class="notification-badge">
                <h2 style="margin: 0; font-size: 24px;">
                    @if($type === 'new_booking')
                        🆕 New B2B Booking Received
                    @elseif($type === 'payment_proof')
                        💰 Payment Proof Uploaded
                    @elseif($type === 'status_update')
                        📋 Booking Status Updated
                    @else
                        📧 B2B Booking Update
                    @endif
                </h2>
                <p style="margin: 10px 0 0 0; font-size: 16px;">
                    @if($type === 'new_booking')
                        A new booking requires your attention
                    @elseif($type === 'payment_proof')
                        Partner has uploaded payment proof for verification
                    @elseif($type === 'status_update')
                        Booking status has been updated
                    @else
                        Booking requires admin attention
                    @endif
                </p>
            </div>

            <!-- Booking Details -->
            <div class="booking-details">
                <div class="detail-row">
                    <span class="detail-label">Booking Reference:</span>
                    <span class="detail-value">{{ $booking->booking_reference }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span>
                    <span class="detail-value">{{ $booking->invoice_number }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="text-transform: capitalize; font-weight: 700; color:
                        @if($booking->status === 'pending') #f59e0b
                        @elseif($booking->status === 'confirmed') #10b981
                        @else #ef4444
                        @endif">
                        {{ $booking->status }}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value" style="font-weight: 700; color: #059669;">
                        Rp {{ number_format($booking->final_amount, 0, ',', '.') }}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Created:</span>
                    <span class="detail-value">{{ $booking->created_at->format('d F Y H:i') }}</span>
                </div>
            </div>

            <!-- Partner Information -->
            <div class="partner-info">
                <div class="partner-title">🏢 Partner Information</div>
                <div class="detail-row">
                    <span class="detail-label">Company Name:</span>
                    <span class="detail-value">{{ $company_name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact Person:</span>
                    <span class="detail-value">{{ $partner->b2b_verification->contact_person ?? $partner->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{ $partner->b2b_verification->contact_email ?? $partner->email }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{{ $partner->b2b_verification->contact_phone ?? 'N/A' }}</span>
                </div>
            </div>

            <!-- Package Information -->
            <div class="package-info">
                <div class="package-title">📦 Package Details</div>
                <div class="detail-row">
                    <span class="detail-label">Package Name:</span>
                    <span class="detail-value">{{ $package->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Destination:</span>
                    <span class="detail-value">{{ $package->destination }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">{{ $package->duration_days }} Days</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Travelers:</span>
                    <span class="detail-value">{{ $booking->travelers_count }} People</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Departure:</span>
                    <span class="detail-value">{{ $package->departure_date->format('d F Y') }}</span>
                </div>
            </div>

            <!-- Action Required -->
            <div class="action-section">
                <div class="action-title">⚡ Action Required</div>
                <p style="margin-bottom: 15px;">
                    @if($type === 'new_booking')
                        Please review this new booking and send payment details to the partner.
                    @elseif($type === 'payment_proof')
                        Please verify the uploaded payment proof and update the booking status.
                    @elseif($type === 'status_update')
                        Booking status has been updated. Please monitor for any follow-up actions.
                    @else
                        This booking requires your attention. Please review and take appropriate action.
                    @endif
                </p>

                <a href="{{ $admin_panel_url }}" class="action-button">
                    View in Admin Panel →
                </a>
            </div>

            <!-- Important Notes -->
            <div class="highlight">
                <strong>📋 Admin Notes:</strong><br>
                • Email notifications are the primary communication channel<br>
                • All booking updates should be reflected in the admin panel<br>
                • Status changes will automatically trigger email notifications to partners<br>
                • Keep detailed notes for audit trail and customer service
            </div>

            <!-- Quick Actions -->
            <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #2d3748;">🚀 Quick Actions</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    <a href="{{ $admin_panel_url }}" style="background: #3b82f6; color: white; padding: 10px; text-decoration: none; border-radius: 6px; text-align: center;">
                        View Booking Details
                    </a>
                    <a href="{{ route('admin.b2b-bookings.index') }}" style="background: #10b981; color: white; padding: 10px; text-decoration: none; border-radius: 6px; text-align: center;">
                        All Bookings
                    </a>
                    <a href="{{ route('admin.b2b-bookings.index', ['status' => 'pending']) }}" style="background: #f59e0b; color: white; padding: 10px; text-decoration: none; border-radius: 6px; text-align: center;">
                        Pending Bookings
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Cahaya Anbiya Travel - Admin Panel</strong></p>
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>📞 +62 21 1234 5678 | 📧 admin@cahaya-anbiya.com</p>
            <p>🌐 https://cahaya-anbiya.com/admin</p>
        </div>
    </div>
</body>
</html>
