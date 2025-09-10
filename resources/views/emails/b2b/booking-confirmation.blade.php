<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed - {{ $booking->booking_reference }}</title>
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
            background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
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
        .confirmation-badge {
            background: #c6f6d5;
            color: #22543d;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
            border: 2px solid #9ae6b4;
        }
        .booking-details {
            background: #f0fff4;
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
            background: #e6fffa;
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
            border-bottom: 2px solid #38a169;
            padding-bottom: 5px;
        }
        .traveler-item {
            background: #f7fafc;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 4px solid #38a169;
        }
        .next-steps {
            background: #fff5f5;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #fed7d7;
            margin-bottom: 30px;
        }
        .steps-title {
            font-size: 18px;
            font-weight: 600;
            color: #c53030;
            margin-bottom: 15px;
        }
        .step-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 4px solid #f56565;
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
            background: #e6fffa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #38a169;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Cahaya Anbiya Travel - Premium Hajj & Umrah Services</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Confirmation Badge -->
            <div class="confirmation-badge">
                <h2 style="margin: 0; font-size: 24px;">✅ Your booking has been confirmed!</h2>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Payment verified and booking is now active</p>
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
                    <span class="detail-label">Confirmed Date:</span>
                    <span class="detail-value">{{ now()->format('d F Y H:i') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Partner:</span>
                    <span class="detail-value">{{ $company_name }}</span>
                </div>
            </div>

            <!-- Package Information -->
            <div class="package-info">
                <div class="package-title">📦 Confirmed Package</div>
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
                    <span class="detail-label">Departure Date:</span>
                    <span class="detail-value">{{ $package->departure_date->format('d F Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Return Date:</span>
                    <span class="detail-value">{{ $package->return_date->format('d F Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value" style="color: #38a169; font-weight: 700;">Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</span>
                </div>
            </div>

            <!-- Travelers -->
            <div class="travelers-section">
                <div class="section-title">👥 Confirmed Travelers ({{ $booking->travelers_count }})</div>
                @foreach($travelers as $traveler)
                <div class="traveler-item">
                    <strong>{{ $traveler['name'] }}</strong><br>
                    <small>Passport: {{ $traveler['passport_number'] }} | DOB: {{ date('d F Y', strtotime($traveler['date_of_birth'])) }}</small>
                </div>
                @endforeach
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <div class="steps-title">📋 What's Next?</div>
                <div class="step-item">
                    <strong>1. Document Preparation</strong><br>
                    <small>We will contact you within 24 hours to discuss document requirements and preparation timeline.</small>
                </div>
                <div class="step-item">
                    <strong>2. Detailed Itinerary</strong><br>
                    <small>Your complete itinerary with daily schedules will be sent 2 weeks before departure.</small>
                </div>
                <div class="step-item">
                    <strong>3. Pre-Departure Briefing</strong><br>
                    <small>Attend our mandatory briefing session 1 week before departure for important information.</small>
                </div>
                <div class="step-item">
                    <strong>4. Travel Documents</strong><br>
                    <small>All travel documents and e-tickets will be delivered 3 days before departure.</small>
                </div>
            </div>

            <!-- Important Notes -->
            <div class="highlight">
                <strong>📌 Important Notes:</strong><br>
                • Please ensure all travelers have valid passports with at least 6 months validity<br>
                • Keep this confirmation email safe as it contains your booking reference<br>
                • Contact us immediately if any traveler details need to be changed<br>
                • All travelers must attend the pre-departure briefing session
            </div>

            <!-- Special Requests -->
            @if(!empty($booking->special_requests))
            <div class="travelers-section">
                <div class="section-title">📝 Your Special Requests</div>
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
            <p><strong>🎉 Congratulations on your confirmed booking!</strong></p>
            <p>May Allah bless your journey and accept your pilgrimage. Ameen.</p>
            <p>For any questions or assistance:</p>
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
