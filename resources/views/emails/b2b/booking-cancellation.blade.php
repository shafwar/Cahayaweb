<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancelled - {{ $booking->booking_reference }}</title>
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
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
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
        .cancellation-badge {
            background: #fed7d7;
            color: #742a2a;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
            border: 2px solid #feb2b2;
        }
        .booking-details {
            background: #fff5f5;
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
        .package-info {
            background: #fef5e7;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .package-title {
            font-size: 20px;
            font-weight: 700;
            color: #c05621;
            margin-bottom: 15px;
        }
        .refund-info {
            background: #e6fffa;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #81e6d9;
            margin-bottom: 30px;
        }
        .refund-title {
            font-size: 18px;
            font-weight: 600;
            color: #234e52;
            margin-bottom: 15px;
        }
        .refund-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 4px solid #38b2ac;
        }
        .contact-info {
            background: #f0f4f8;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .contact-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
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
            background: #fff3cd;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>❌ Booking Cancelled</h1>
            <p>Cahaya Anbiya Travel - Premium Hajj & Umrah Services</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Cancellation Badge -->
            <div class="cancellation-badge">
                <h2 style="margin: 0; font-size: 24px;">⚠️ Your booking has been cancelled</h2>
                <p style="margin: 10px 0 0 0; font-size: 16px;">We're sorry to inform you about this cancellation</p>
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
                    <span class="detail-label">Cancellation Date:</span>
                    <span class="detail-value">{{ now()->format('d F Y H:i') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Partner:</span>
                    <span class="detail-value">{{ $company_name }}</span>
                </div>
            </div>

            <!-- Package Information -->
            <div class="package-info">
                <div class="package-title">📦 Cancelled Package</div>
                <div class="detail-row">
                    <span class="detail-label">Package Name:</span>
                    <span class="detail-value">{{ $package->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Destination:</span>
                    <span class="detail-value">{{ $package->destination }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Departure Date:</span>
                    <span class="detail-value">{{ $package->departure_date->format('d F Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</span>
                </div>
            </div>

            <!-- Cancellation Reason -->
            @if($reason)
            <div class="highlight">
                <strong>📝 Cancellation Reason:</strong><br>
                {{ $reason }}
            </div>
            @endif

            <!-- Refund Information -->
            <div class="refund-info">
                <div class="refund-title">💰 Refund Information</div>
                <div class="refund-item">
                    <strong>Refund Process</strong><br>
                    <small>If you have made any payments, our team will process the refund within 5-7 business days.</small>
                </div>
                <div class="refund-item">
                    <strong>Refund Method</strong><br>
                    <small>Refunds will be processed to the original payment method used for the booking.</small>
                </div>
                <div class="refund-item">
                    <strong>Refund Timeline</strong><br>
                    <small>You will receive a confirmation email once the refund has been processed.</small>
                </div>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <div class="contact-title">📞 Need Assistance?</div>
                <p>If you have any questions about this cancellation or would like to discuss alternative options, please don't hesitate to contact us:</p>
                <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
                    <strong>Customer Service:</strong><br>
                    📞 +62 21 1234 5678<br>
                    📧 info@cahaya-anbiya.com<br>
                    🌐 https://cahaya-anbiya.com
                </div>
            </div>

            <!-- Alternative Options -->
            <div class="highlight">
                <strong>🔄 Alternative Options:</strong><br>
                • We can help you reschedule for a different departure date<br>
                • Explore other available packages that might suit your needs<br>
                • Get assistance with future booking planning<br>
                • Receive priority notification for new package releases
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>We apologize for any inconvenience caused</strong></p>
            <p>Thank you for your understanding and continued trust in Cahaya Anbiya Travel</p>
            <p>For immediate assistance:</p>
            <p>📞 +62 21 1234 5678 | 📧 info@cahaya-anbiya.com</p>
            <p>🌐 https://cahaya-anbiya.com</p>
            <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
                Barakallahu feekum,<br>
                Cahaya Anbiya Travel Team
            </p>
        </div>
    </div>
</body>
</html>
