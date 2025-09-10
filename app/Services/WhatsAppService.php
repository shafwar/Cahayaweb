<?php

namespace App\Services;

use App\Models\B2BBooking;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    private string $apiUrl;
    private ?string $accessToken;
    private ?string $phoneNumberId;
    private string $adminPhoneNumber;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url', 'https://graph.facebook.com/v18.0');
        $this->accessToken = config('services.whatsapp.access_token', '');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id', '');
        $this->adminPhoneNumber = config('services.whatsapp.admin_phone_number', '+6281234567890');
    }

    /**
     * Send invoice to partner via WhatsApp
     */
    public function sendInvoice(B2BBooking $booking): array
    {
        try {
            // Check if WhatsApp is configured
            if (empty($this->accessToken) || empty($this->phoneNumberId)) {
                Log::warning('WhatsApp not configured, skipping notification', [
                    'booking_id' => $booking->id,
                    'access_token_configured' => !empty($this->accessToken),
                    'phone_number_id_configured' => !empty($this->phoneNumberId),
                ]);

                return [
                    'success' => false,
                    'message' => 'WhatsApp not configured',
                    'error' => 'Missing access token or phone number ID'
                ];
            }

            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $partnerPhone = $b2bVerification->contact_phone ?? $partner->phone ?? null;

            if (!$partnerPhone) {
                return [
                    'success' => false,
                    'message' => 'Partner phone number not found'
                ];
            }

            // Format phone number (remove + and add country code if needed)
            $formattedPhone = $this->formatPhoneNumber($partnerPhone);

            $message = $this->buildInvoiceMessage($booking);

            $response = $this->sendMessage($formattedPhone, $message, [
                'type' => 'document',
                'document' => [
                    'link' => $booking->invoice_url,
                    'filename' => "Invoice_{$booking->invoice_number}.pdf"
                ]
            ]);

            if ($response['success']) {
                Log::info('Invoice sent successfully', [
                    'booking_id' => $booking->id,
                    'partner_phone' => $formattedPhone,
                    'invoice_number' => $booking->invoice_number
                ]);

                return [
                    'success' => true,
                    'message' => 'Invoice sent successfully via WhatsApp',
                    'message_id' => $response['message_id'] ?? null
                ];
            } else {
                Log::error('Failed to send invoice', [
                    'booking_id' => $booking->id,
                    'error' => $response['error'] ?? 'Unknown error'
                ]);

                return [
                    'success' => false,
                    'message' => 'Failed to send invoice: ' . ($response['error'] ?? 'Unknown error')
                ];
            }

        } catch (\Exception $e) {
            Log::error('WhatsApp invoice sending failed', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send invoice: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send payment details to partner
     */
    public function sendPaymentDetails(B2BBooking $booking): array
    {
        try {
            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $partnerPhone = $b2bVerification->contact_phone ?? $partner->phone ?? null;

            if (!$partnerPhone) {
                return [
                    'success' => false,
                    'message' => 'Partner phone number not found'
                ];
            }

            $formattedPhone = $this->formatPhoneNumber($partnerPhone);
            $message = $this->buildPaymentDetailsMessage($booking);

            $response = $this->sendMessage($formattedPhone, $message);

            if ($response['success']) {
                $booking->addWhatsAppMessage('payment_details', $message, true);
                return [
                    'success' => true,
                    'message' => 'Payment details sent successfully'
                ];
            } else {
                $booking->addWhatsAppMessage('payment_details', $message, false);
                return [
                    'success' => false,
                    'message' => 'Failed to send payment details'
                ];
            }

        } catch (\Exception $e) {
            Log::error('WhatsApp payment details sending failed', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send payment details: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send booking confirmation
     */
    public function sendConfirmation(B2BBooking $booking): array
    {
        try {
            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $partnerPhone = $b2bVerification->contact_phone ?? $partner->phone ?? null;

            if (!$partnerPhone) {
                return [
                    'success' => false,
                    'message' => 'Partner phone number not found'
                ];
            }

            $formattedPhone = $this->formatPhoneNumber($partnerPhone);
            $message = $this->buildConfirmationMessage($booking);

            $response = $this->sendMessage($formattedPhone, $message, [
                'type' => 'document',
                'document' => [
                    'link' => $booking->invoice_url, // In production, this would be itinerary/e-ticket
                    'filename' => "Booking_Confirmation_{$booking->booking_reference}.pdf"
                ]
            ]);

            if ($response['success']) {
                $booking->addWhatsAppMessage('confirmation', $message, true);
                return [
                    'success' => true,
                    'message' => 'Confirmation sent successfully'
                ];
            } else {
                $booking->addWhatsAppMessage('confirmation', $message, false);
                return [
                    'success' => false,
                    'message' => 'Failed to send confirmation'
                ];
            }

        } catch (\Exception $e) {
            Log::error('WhatsApp confirmation sending failed', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send confirmation: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send rejection notification to partner
     */
    public function sendRejection(B2BBooking $booking): array
    {
        try {
            // Check if WhatsApp is configured
            if (!$this->accessToken || !$this->phoneNumberId) {
                Log::warning('WhatsApp not configured, skipping rejection notification');
                return [
                    'success' => false,
                    'message' => 'WhatsApp not configured'
                ];
            }

            $partner = $booking->partner;
            $phoneNumber = $partner->phone ?? $partner->whatsapp_number;

            if (!$phoneNumber) {
                Log::warning('Partner phone number not available for rejection notification', [
                    'booking_id' => $booking->id,
                    'partner_id' => $partner->id
                ]);
                return [
                    'success' => false,
                    'message' => 'Partner phone number not available'
                ];
            }

            $message = $this->buildRejectionMessage($booking);
            return $this->sendMessage($phoneNumber, $message);

        } catch (\Exception $e) {
            Log::error('Failed to send rejection notification', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send rejection: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Notify admin about payment received
     */
    public function notifyAdminPaymentReceived(B2BBooking $booking): array
    {
        try {
            $message = $this->buildAdminPaymentNotification($booking);
            $response = $this->sendMessage($this->adminPhoneNumber, $message);

            if ($response['success']) {
                Log::info('Admin notified about payment received', [
                    'booking_id' => $booking->id,
                    'booking_reference' => $booking->booking_reference
                ]);
            }

            return $response;

        } catch (\Exception $e) {
            Log::error('Failed to notify admin about payment', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to notify admin: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Notify admin about booking cancellation
     */
    public function notifyAdminBookingCancelled(B2BBooking $booking): array
    {
        try {
            $message = $this->buildAdminCancellationNotification($booking);
            return $this->sendMessage($this->adminPhoneNumber, $message);

        } catch (\Exception $e) {
            Log::error('Failed to notify admin about cancellation', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to notify admin: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send WhatsApp message
     */
    private function sendMessage(string $to, string $message, ?array $media = null): array
    {
        try {
            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => $media ? $media['type'] : 'text',
            ];

            if ($media) {
                $payload[$media['type']] = $media[$media['type']];
            } else {
                $payload['text'] = ['body' => $message];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}/{$this->phoneNumberId}/messages", $payload);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'message_id' => $data['messages'][0]['id'] ?? null,
                    'response' => $data
                ];
            } else {
                return [
                    'success' => false,
                    'error' => $response->body(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Format phone number for WhatsApp API
     */
    private function formatPhoneNumber(string $phone): string
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // Add country code if not present
        if (!str_starts_with($phone, '62')) {
            if (str_starts_with($phone, '0')) {
                $phone = '62' . substr($phone, 1);
            } else {
                $phone = '62' . $phone;
            }
        }

        return $phone;
    }

    /**
     * Build invoice message
     */
    private function buildInvoiceMessage(B2BBooking $booking): string
    {
        $partner = $booking->partner;
        $b2bVerification = $partner->b2bVerification;
        $companyName = $b2bVerification->company_name ?? $partner->name;

        return "🕌 *Cahaya Anbiya Travel* 🕌

Assalamu'alaikum Warahmatullahi Wabarakatuh,

Dear {$companyName},

Your booking has been confirmed! Please find your invoice attached.

📋 *Booking Details:*
• Booking Reference: {$booking->booking_reference}
• Invoice Number: {$booking->invoice_number}
• Package: {$booking->package->name}
• Travelers: {$booking->travelers_count} person(s)
• Total Amount: Rp " . number_format($booking->final_amount, 0, ',', '.') . "

⏰ *Payment Due:* " . now()->addDays(3)->format('d F Y') . "

💳 *Payment Instructions:*
Please transfer the amount to:
Bank: Bank Mandiri
Account: PT Cahaya Anbiya Travel
Account Number: 1234567890

*Important:* Include booking reference '{$booking->booking_reference}' in your transfer notes.

📱 For any questions, please contact us at +62 21 1234 5678

Barakallahu feekum,
Cahaya Anbiya Travel Team";
    }

    /**
     * Build payment details message
     */
    private function buildPaymentDetailsMessage(B2BBooking $booking): string
    {
        return "💳 *Payment Details for {$booking->booking_reference}*

Dear Partner,

Here are the payment details for your booking:

💰 *Amount to Pay:* Rp " . number_format($booking->final_amount, 0, ',', '.') . "
📅 *Due Date:* " . now()->addDays(3)->format('d F Y') . "

🏦 *Bank Transfer:*
Bank: Bank Mandiri
Account Name: PT Cahaya Anbiya Travel
Account Number: 1234567890
SWIFT Code: BMRIIDJA

📝 *Transfer Notes:* {$booking->booking_reference}

After making the transfer, please upload your payment proof in the B2B portal or send it via WhatsApp.

Thank you for choosing Cahaya Anbiya Travel!";
    }

    /**
     * Build confirmation message
     */
    private function buildConfirmationMessage(B2BBooking $booking): string
    {
        return "🎉 *Booking Confirmed!* 🎉

Assalamu'alaikum Warahmatullahi Wabarakatuh,

Dear Partner,

Great news! Your booking has been confirmed and payment verified.

📋 *Booking Details:*
• Booking Reference: {$booking->booking_reference}
• Package: {$booking->package->name}
• Departure: " . $booking->package->departure_date->format('d F Y') . "
• Return: " . $booking->package->return_date->format('d F Y') . "
• Travelers: {$booking->travelers_count} person(s)

📄 Your detailed itinerary and e-tickets are attached.

📱 For any questions or assistance, please contact us at +62 21 1234 5678

May Allah bless your journey and accept your pilgrimage. Ameen.

Barakallahu feekum,
Cahaya Anbiya Travel Team";
    }

    /**
     * Build rejection message
     */
    private function buildRejectionMessage(B2BBooking $booking): string
    {
        $partner = $booking->partner;
        $b2bVerification = $partner->b2bVerification;
        $companyName = $b2bVerification->company_name ?? $partner->name;

        return "Assalamu'alaikum Warahmatullahi Wabarakatuh,

Dear {$companyName},

We regret to inform you that your booking has been rejected.

📋 *Booking Details:*
• Booking Reference: {$booking->booking_reference}
• Invoice Number: {$booking->invoice_number}
• Package: {$booking->package->name}
• Travelers: {$booking->travelers_count} person(s)
• Amount: Rp " . number_format($booking->final_amount, 0, ',', '.') . "

❌ *Reason for Rejection:*
Your booking could not be processed at this time. Please contact our team for more information.

📱 For assistance or to make a new booking, please contact us at +62 21 1234 5678

We apologize for any inconvenience caused.

Barakallahu feekum,
Cahaya Anbiya Travel Team";
    }

    /**
     * Build admin payment notification
     */
    private function buildAdminPaymentNotification(B2BBooking $booking): string
    {
        $partner = $booking->partner;
        $b2bVerification = $partner->b2bVerification;
        $companyName = $b2bVerification->company_name ?? $partner->name;

        return "🔔 *Payment Received Notification*

Admin, a new payment proof has been uploaded:

📋 *Booking Details:*
• Booking Reference: {$booking->booking_reference}
• Partner: {$companyName}
• Amount: Rp " . number_format($booking->final_amount, 0, ',', '.') . "
• Uploaded: " . now()->format('d F Y H:i') . "

Please verify the payment and update the booking status in the admin panel.

🔗 Admin Panel: " . url('/admin/bookings/' . $booking->id);
    }

    /**
     * Build admin cancellation notification
     */
    private function buildAdminCancellationNotification(B2BBooking $booking): string
    {
        $partner = $booking->partner;
        $b2bVerification = $partner->b2bVerification;
        $companyName = $b2bVerification->company_name ?? $partner->name;

        return "⚠️ *Booking Cancelled*

Admin, a booking has been cancelled:

📋 *Booking Details:*
• Booking Reference: {$booking->booking_reference}
• Partner: {$companyName}
• Package: {$booking->package->name}
• Amount: Rp " . number_format($booking->final_amount, 0, ',', '.') . "
• Cancelled: " . now()->format('d F Y H:i') . "

Please review and process any necessary refunds.

🔗 Admin Panel: " . url('/admin/bookings/' . $booking->id);
    }
}
