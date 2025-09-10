<?php

namespace App\Services;

use App\Models\B2BBooking;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InvoiceService
{
    /**
     * Generate invoice for B2B booking
     */
    public function generateInvoice(B2BBooking $booking): array
    {
        $invoiceData = $this->prepareInvoiceData($booking);
        $pdfPath = $this->generateInvoicePDF($invoiceData);
        $url = $this->generateInvoiceUrl($pdfPath);

        return [
            'pdf_path' => $pdfPath,
            'url' => $url,
            'data' => $invoiceData,
        ];
    }

    /**
     * Prepare invoice data
     */
    private function prepareInvoiceData(B2BBooking $booking): array
    {
        $partner = $booking->partner;
        $package = $booking->package;
        $b2bVerification = $partner->b2bVerification;

        return [
            'invoice_number' => $booking->invoice_number,
            'booking_reference' => $booking->booking_reference,
            'issue_date' => now()->format('d F Y'),
            'due_date' => now()->addDays(3)->format('d F Y'),

            // Company details
            'company' => [
                'name' => 'Cahaya Anbiya Travel',
                'address' => 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
                'phone' => '+62 21 1234 5678',
                'email' => 'info@cahaya-anbiya.com',
                'website' => 'https://cahaya-anbiya.com',
                'tax_id' => '01.234.567.8-901.000',
            ],

            // Partner details
            'partner' => [
                'name' => $b2bVerification->company_name ?? $partner->name,
                'contact_person' => $b2bVerification->contact_person ?? $partner->name,
                'email' => $b2bVerification->contact_email ?? $partner->email,
                'phone' => $b2bVerification->contact_phone ?? '',
                'address' => $b2bVerification->company_address ?? '',
            ],

            // Package details
            'package' => [
                'name' => $package->name,
                'destination' => $package->destination,
                'duration' => $package->duration_days . ' Days',
                'departure_date' => $package->departure_date->format('d F Y'),
                'return_date' => $package->return_date->format('d F Y'),
            ],

            // Travelers
            'travelers' => $booking->traveler_details,
            'travelers_count' => $booking->travelers_count,

            // Pricing
            'pricing' => [
                'base_price' => $package->getPriceForUser($partner),
                'total_amount' => $booking->total_amount,
                'b2b_discount' => $booking->b2b_discount,
                'final_amount' => $booking->final_amount,
                'currency' => $booking->currency,
            ],

            // Special requests
            'special_requests' => $booking->special_requests,

            // Payment instructions
            'payment_instructions' => [
                'bank_name' => 'Bank Mandiri',
                'account_name' => 'PT Cahaya Anbiya Travel',
                'account_number' => '1234567890',
                'swift_code' => 'BMRIIDJA',
                'notes' => 'Please include booking reference in transfer notes',
            ],
        ];
    }

    /**
     * Generate invoice PDF (simplified version - in production, use a proper PDF library)
     */
    private function generateInvoicePDF(array $data): string
    {
        $filename = 'invoices/' . $data['invoice_number'] . '.pdf';

        // For now, we'll create a simple HTML file that can be converted to PDF
        // In production, use libraries like dompdf, tcpdf, or wkhtmltopdf
        $html = $this->generateInvoiceHTML($data);

        // Store HTML file (in production, convert to PDF)
        Storage::put('public/' . $filename, $html);

        return $filename;
    }

    /**
     * Generate invoice HTML template
     */
    private function generateInvoiceHTML(array $data): string
    {
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Invoice ' . $data['invoice_number'] . '</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #d4af37; padding-bottom: 20px; }
                .company-name { font-size: 24px; font-weight: bold; color: #d4af37; margin-bottom: 10px; }
                .invoice-title { font-size: 28px; font-weight: bold; margin: 20px 0; }
                .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .invoice-info, .partner-info { width: 45%; }
                .section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; color: #d4af37; }
                .package-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .travelers-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .travelers-table th, .travelers-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .travelers-table th { background-color: #d4af37; color: white; }
                .pricing-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .pricing-table th, .pricing-table td { border: 1px solid #ddd; padding: 10px; text-align: right; }
                .pricing-table th { background-color: #f5f5f5; }
                .total-row { font-weight: bold; background-color: #d4af37; color: white; }
                .payment-instructions { background: #e8f4f8; padding: 15px; border-radius: 5px; margin-top: 20px; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company-name">Cahaya Anbiya Travel</div>
                <div>' . $data['company']['address'] . '</div>
                <div>Phone: ' . $data['company']['phone'] . ' | Email: ' . $data['company']['email'] . '</div>
            </div>

            <div class="invoice-title">INVOICE</div>

            <div class="invoice-details">
                <div class="invoice-info">
                    <strong>Invoice Number:</strong> ' . $data['invoice_number'] . '<br>
                    <strong>Booking Reference:</strong> ' . $data['booking_reference'] . '<br>
                    <strong>Issue Date:</strong> ' . $data['issue_date'] . '<br>
                    <strong>Due Date:</strong> ' . $data['due_date'] . '
                </div>
                <div class="partner-info">
                    <strong>Bill To:</strong><br>
                    ' . $data['partner']['name'] . '<br>
                    ' . $data['partner']['contact_person'] . '<br>
                    ' . $data['partner']['email'] . '<br>
                    ' . $data['partner']['phone'] . '
                </div>
            </div>

            <div class="section-title">Package Details</div>
            <div class="package-details">
                <strong>' . $data['package']['name'] . '</strong><br>
                Destination: ' . $data['package']['destination'] . '<br>
                Duration: ' . $data['package']['duration'] . '<br>
                Departure: ' . $data['package']['departure_date'] . '<br>
                Return: ' . $data['package']['return_date'] . '
            </div>

            <div class="section-title">Travelers (' . $data['travelers_count'] . ')</div>
            <table class="travelers-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Passport Number</th>
                        <th>Date of Birth</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>';

        foreach ($data['travelers'] as $traveler) {
            $html .= '
                    <tr>
                        <td>' . htmlspecialchars($traveler['name']) . '</td>
                        <td>' . htmlspecialchars($traveler['passport_number']) . '</td>
                        <td>' . date('d F Y', strtotime($traveler['date_of_birth'])) . '</td>
                        <td>' . htmlspecialchars($traveler['phone']) . '</td>
                    </tr>';
        }

        $html .= '
                </tbody>
            </table>

            <div class="section-title">Pricing</div>
            <table class="pricing-table">
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
                <tr>
                    <td>Package Price (' . $data['travelers_count'] . ' travelers × Rp ' . number_format($data['pricing']['base_price'], 0, ',', '.') . ')</td>
                    <td>Rp ' . number_format($data['pricing']['total_amount'], 0, ',', '.') . '</td>
                </tr>
                <tr>
                    <td>B2B Discount</td>
                    <td>- Rp ' . number_format($data['pricing']['b2b_discount'], 0, ',', '.') . '</td>
                </tr>
                <tr class="total-row">
                    <td><strong>TOTAL AMOUNT</strong></td>
                    <td><strong>Rp ' . number_format($data['pricing']['final_amount'], 0, ',', '.') . '</strong></td>
                </tr>
            </table>';

        if (!empty($data['special_requests'])) {
            $html .= '
            <div class="section-title">Special Requests</div>
            <ul>';
            foreach ($data['special_requests'] as $request) {
                $html .= '<li>' . htmlspecialchars($request) . '</li>';
            }
            $html .= '</ul>';
        }

        $html .= '
            <div class="section-title">Payment Instructions</div>
            <div class="payment-instructions">
                <strong>Bank Transfer Details:</strong><br>
                Bank: ' . $data['payment_instructions']['bank_name'] . '<br>
                Account Name: ' . $data['payment_instructions']['account_name'] . '<br>
                Account Number: ' . $data['payment_instructions']['account_number'] . '<br>
                SWIFT Code: ' . $data['payment_instructions']['swift_code'] . '<br><br>
                <strong>Important:</strong> Please include booking reference "' . $data['booking_reference'] . '" in your transfer notes.
            </div>

            <div class="footer">
                <p>Thank you for choosing Cahaya Anbiya Travel for your spiritual journey.</p>
                <p>For any questions, please contact us at ' . $data['company']['phone'] . ' or ' . $data['company']['email'] . '</p>
            </div>
        </body>
        </html>';

        return $html;
    }

    /**
     * Generate public URL for invoice
     */
    private function generateInvoiceUrl(string $pdfPath): string
    {
        return url('storage/' . $pdfPath);
    }

    /**
     * Get invoice data for API response
     */
    public function getInvoiceData(B2BBooking $booking): array
    {
        return $this->prepareInvoiceData($booking);
    }
}
