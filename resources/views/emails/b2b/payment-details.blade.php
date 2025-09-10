<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Details - {{ $booking->booking_reference }}</title>
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
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
        .payment-badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
            border: 2px solid #93c5fd;
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
        .payment-section {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #fbbf24;
            margin-bottom: 30px;
        }
        .payment-title {
            font-size: 20px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 15px;
        }
        .bank-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .bank-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .bank-row:last-child {
            border-bottom: none;
        }
        .bank-label {
            font-weight: 600;
            color: #374151;
        }
        .bank-value {
            font-weight: 700;
            color: #1f2937;
        }
        .amount-highlight {
            background: #dcfce7;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #16a34a;
            text-align: center;
            margin: 20px 0;
        }
        .instructions {
            background: #fef2f2;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #fca5a5;
            margin-bottom: 30px;
        }
        .instructions-title {
            font-size: 18px;
            font-weight: 600;
            color: #dc2626;
            margin-bottom: 15px;
        }
        .step-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 4px solid #ef4444;
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
            background: #fef3c7;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>💳 Payment Details</h1>
            <p>Cahaya Anbiya Travel - Premium Hajj & Umrah Services</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Payment Badge -->
            <div class="payment-badge">
                <h2 style="margin: 0; font-size: 24px;">💰 Payment Instructions</h2>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Please complete your payment using the details below</p>
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
                    <span class="detail-label">Package:</span>
                    <span class="detail-value">{{ $package->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Partner:</span>
                    <span class="detail-value">{{ $company_name }}</span>
                </div>
            </div>

            <!-- Payment Section -->
            <div class="payment-section">
                <div class="payment-title">🏦 Bank Transfer Details</div>

                <div class="bank-details">
                    <div class="bank-row">
                        <span class="bank-label">Bank Name:</span>
                        <span class="bank-value">{{ $payment_details['bank_name'] }}</span>
                    </div>
                    <div class="bank-row">
                        <span class="bank-label">Account Name:</span>
                        <span class="bank-value">{{ $payment_details['account_name'] }}</span>
                    </div>
                    <div class="bank-row">
                        <span class="bank-label">Account Number:</span>
                        <span class="bank-value">{{ $payment_details['account_number'] }}</span>
                    </div>
                    <div class="bank-row">
                        <span class="bank-label">SWIFT Code:</span>
                        <span class="bank-value">{{ $payment_details['swift_code'] }}</span>
                    </div>
                </div>

                <div class="amount-highlight">
                    <div style="font-size: 24px; font-weight: 700; color: #16a34a;">
                        Total Amount: Rp {{ number_format($payment_details['amount'], 0, ',', '.') }}
                    </div>
                </div>
            </div>

            <!-- Payment Instructions -->
            <div class="instructions">
                <div class="instructions-title">📋 Payment Instructions</div>

                <div class="step-item">
                    <strong>1. Transfer Amount</strong><br>
                    <small>Transfer the exact amount: <strong>Rp {{ number_format($payment_details['amount'], 0, ',', '.') }}</strong></small>
                </div>

                <div class="step-item">
                    <strong>2. Include Reference</strong><br>
                    <small>In the transfer notes, include: <strong>"{{ $payment_details['reference'] }}"</strong></small>
                </div>

                <div class="step-item">
                    <strong>3. Upload Proof</strong><br>
                    <small>After transferring, upload your payment proof in the booking portal or send via email</small>
                </div>

                <div class="step-item">
                    <strong>4. Confirmation</strong><br>
                    <small>We will verify your payment and send confirmation within 24 hours</small>
                </div>
            </div>

            <!-- Important Notes -->
            <div class="highlight">
                <strong>⚠️ Important Notes:</strong><br>
                • Please transfer the exact amount as shown above<br>
                • Include the booking reference in your transfer notes<br>
                • Keep your transfer receipt as proof of payment<br>
                • Contact us immediately if you encounter any issues<br>
                • Payment must be completed within 7 days of invoice date
            </div>

            <!-- Contact Information -->
            <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #2d3748;">📞 Need Help?</h3>
                <p style="margin: 5px 0;">If you have any questions about payment:</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> payments@cahaya-anbiya.com</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> +62 21 1234 5678</p>
                <p style="margin: 5px 0;"><strong>WhatsApp:</strong> +62 812 3456 7890</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Thank you for choosing Cahaya Anbiya Travel</strong></p>
            <p>We look forward to serving you on your spiritual journey</p>
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
