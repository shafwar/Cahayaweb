<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{ $booking->invoice_number }}</title>
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
            background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
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
        .invoice-details {
            background: #f8f9fa;
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
            background: #e8f4f8;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .package-title {
            font-size: 20px;
            font-weight: 700;
            color: #2c5282;
            margin-bottom: 15px;
        }
        .travelers-section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 5px;
        }
        .traveler-item {
            background: #f7fafc;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 4px solid #d4af37;
        }
        .pricing-section {
            background: #f0fff4;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
        }
        .total-row {
            border-top: 2px solid #d4af37;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 18px;
            font-weight: 700;
        }
        .payment-info {
            background: #fff5f5;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #fed7d7;
        }
        .payment-title {
            font-size: 18px;
            font-weight: 600;
            color: #c53030;
            margin-bottom: 15px;
        }
        .bank-details {
            background: white;
            padding: 15px;
            border-radius: 6px;
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
            <h1>🕌 Cahaya Anbiya Travel</h1>
            <p>Premium Hajj & Umrah Services</p>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 style="text-align: center; color: #2d3748; margin-bottom: 30px;">📋 Booking Invoice</h2>

            <!-- Invoice Details -->
            <div class="invoice-details">
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span>
                    <span class="detail-value">{{ $booking->invoice_number }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Reference:</span>
                    <span class="detail-value">{{ $booking->booking_reference }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Issue Date:</span>
                    <span class="detail-value">{{ now()->format('d F Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Partner:</span>
                    <span class="detail-value">{{ $company_name }}</span>
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
                    <span class="detail-label">Departure:</span>
                    <span class="detail-value">{{ $package->departure_date->format('d F Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Return:</span>
                    <span class="detail-value">{{ $package->return_date->format('d F Y') }}</span>
                </div>
            </div>

            <!-- Travelers -->
            <div class="travelers-section">
                <div class="section-title">👥 Travelers ({{ $booking->travelers_count }})</div>
                @foreach($travelers as $traveler)
                <div class="traveler-item">
                    <strong>{{ $traveler['name'] }}</strong><br>
                    <small>Passport: {{ $traveler['passport_number'] }} | DOB: {{ date('d F Y', strtotime($traveler['date_of_birth'])) }}</small>
                </div>
                @endforeach
            </div>

            <!-- Pricing -->
            <div class="pricing-section">
                <div class="section-title">💰 Pricing Details</div>
                <div class="price-row">
                    <span>Base Price ({{ $booking->travelers_count }} travelers):</span>
                    <span>Rp {{ number_format($booking->total_amount, 0, ',', '.') }}</span>
                </div>
                <div class="price-row">
                    <span>B2B Discount:</span>
                    <span style="color: #38a169;">- Rp {{ number_format($booking->b2b_discount, 0, ',', '.') }}</span>
                </div>
                <div class="price-row total-row">
                    <span>Total Amount:</span>
                    <span style="color: #d4af37;">Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</span>
                </div>
            </div>

            <!-- Payment Information -->
            <div class="payment-info">
                <div class="payment-title">💳 Payment Instructions</div>
                <div class="bank-details">
                    <strong>Bank Transfer Details:</strong><br>
                    Bank: Bank Mandiri<br>
                    Account Name: PT Cahaya Anbiya Travel<br>
                    Account Number: 1234567890<br>
                    SWIFT Code: BMRIIDJA
                </div>
                <div class="highlight">
                    <strong>⚠️ Important:</strong> Please include booking reference <strong>"{{ $booking->booking_reference }}"</strong> in your transfer notes.
                </div>
            </div>

            <!-- Special Requests -->
            @if(!empty($booking->special_requests))
            <div class="travelers-section">
                <div class="section-title">📝 Special Requests</div>
                @foreach($booking->special_requests as $request)
                <div class="traveler-item">
                    {{ $request }}
                </div>
                @endforeach
            </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Thank you for choosing Cahaya Anbiya Travel</strong></p>
            <p>For any questions, please contact us at:</p>
            <p>📞 +62 21 1234 5678 | 📧 info@cahaya-anbiya.com</p>
            <p>🌐 https://cahaya-anbiya.com</p>
        </div>
    </div>
</body>
</html>
