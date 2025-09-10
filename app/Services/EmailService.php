<?php

namespace App\Services;

use App\Models\B2BBooking;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send booking confirmation email
     */
    public function sendBookingConfirmation(B2BBooking $booking): array
    {
        try {
            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $companyName = $b2bVerification->company_name ?? $partner->name;
            // Send to partner's email, not B2B contact email
            $email = $partner->email;

            $data = [
                'booking' => $booking,
                'partner' => $partner,
                'company_name' => $companyName,
                'package' => $booking->package,
                'travelers' => $booking->traveler_details,
            ];

            Mail::send('emails.b2b.booking-confirmation', $data, function ($message) use ($email, $companyName, $booking) {
                $message->to($email, $companyName)
                        ->subject("Booking Confirmed - {$booking->booking_reference} - Cahaya Anbiya Travel");
            });

            Log::info('Booking confirmation email sent successfully', [
                'booking_id' => $booking->id,
                'email' => $email,
                'booking_reference' => $booking->booking_reference
            ]);

            return [
                'success' => true,
                'message' => 'Confirmation email sent successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to send booking confirmation email', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send confirmation email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send invoice email
     */
    public function sendInvoice(B2BBooking $booking): array
    {
        try {
            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $companyName = $b2bVerification->company_name ?? $partner->name;

            // Send to traveler's email (first traveler) for invoice notification
            $travelers = $booking->traveler_details;
            $email = !empty($travelers) && isset($travelers[0]['email'])
                ? $travelers[0]['email']
                : $partner->email;

            $data = [
                'booking' => $booking,
                'partner' => $partner,
                'company_name' => $companyName,
                'package' => $booking->package,
                'travelers' => $booking->traveler_details,
                'invoice_url' => $booking->invoice_url,
            ];

            Mail::send('emails.b2b.invoice', $data, function ($message) use ($email, $companyName, $booking) {
                $message->to($email, $companyName)
                        ->subject("Invoice - {$booking->invoice_number} - Cahaya Anbiya Travel");

                // Attach invoice PDF if available
                if ($booking->invoice_pdf_path && file_exists(storage_path('app/public/' . $booking->invoice_pdf_path))) {
                    $message->attach(storage_path('app/public/' . $booking->invoice_pdf_path), [
                        'as' => "Invoice_{$booking->invoice_number}.pdf",
                        'mime' => 'application/pdf',
                    ]);
                }
            });

            Log::info('Invoice email sent successfully', [
                'booking_id' => $booking->id,
                'email' => $email,
                'invoice_number' => $booking->invoice_number
            ]);

            return [
                'success' => true,
                'message' => 'Invoice email sent successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to send invoice email', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send invoice email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send payment reminder email
     */
    public function sendPaymentReminder(B2BBooking $booking): array
    {
        try {
            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $companyName = $b2bVerification->company_name ?? $partner->name;
            // Send to partner's email, not B2B contact email
            $email = $partner->email;

            $data = [
                'booking' => $booking,
                'partner' => $partner,
                'company_name' => $companyName,
                'package' => $booking->package,
                'due_date' => $booking->payment_due_date,
            ];

            Mail::send('emails.b2b.payment-reminder', $data, function ($message) use ($email, $companyName, $booking) {
                $message->to($email, $companyName)
                        ->subject("Payment Reminder - {$booking->booking_reference} - Cahaya Anbiya Travel");
            });

            Log::info('Payment reminder email sent successfully', [
                'booking_id' => $booking->id,
                'email' => $email,
                'booking_reference' => $booking->booking_reference
            ]);

            return [
                'success' => true,
                'message' => 'Payment reminder email sent successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to send payment reminder email', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send payment reminder email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send booking cancellation email
     */
    public function sendBookingCancellation(B2BBooking $booking, ?string $reason = null): array
    {
        try {
            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $companyName = $b2bVerification->company_name ?? $partner->name;
            // Send to partner's email, not B2B contact email
            $email = $partner->email;

            $data = [
                'booking' => $booking,
                'partner' => $partner,
                'company_name' => $companyName,
                'package' => $booking->package,
                'reason' => $reason,
            ];

            Mail::send('emails.b2b.booking-cancellation', $data, function ($message) use ($email, $companyName, $booking) {
                $message->to($email, $companyName)
                        ->subject("Booking Cancelled - {$booking->booking_reference} - Cahaya Anbiya Travel");
            });

            Log::info('Booking cancellation email sent successfully', [
                'booking_id' => $booking->id,
                'email' => $email,
                'booking_reference' => $booking->booking_reference
            ]);

            return [
                'success' => true,
                'message' => 'Cancellation email sent successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to send booking cancellation email', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send cancellation email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send payment details email to partner (PRIMARY NOTIFICATION)
     */
    public function sendPaymentDetails(B2BBooking $booking): array
    {
        try {
            $partner = $booking->partner;
            $b2bVerification = $partner->b2bVerification;
            $companyName = $b2bVerification->company_name ?? $partner->name;
            // Send to partner's email, not B2B contact email
            $email = $partner->email;

            $data = [
                'booking' => $booking,
                'partner' => $partner,
                'company_name' => $companyName,
                'package' => $booking->package,
                'payment_details' => [
                    'bank_name' => 'Bank Mandiri',
                    'account_name' => 'PT Cahaya Anbiya Travel',
                    'account_number' => '1234567890',
                    'swift_code' => 'BMRIIDJA',
                    'amount' => $booking->final_amount,
                    'reference' => $booking->booking_reference,
                ]
            ];

            Mail::send('emails.b2b.payment-details', $data, function ($message) use ($email, $companyName, $booking) {
                $message->to($email, $companyName)
                        ->subject("💳 Payment Details for Booking {$booking->booking_reference} - Cahaya Anbiya Travel");
            });

            Log::info('Payment details email sent successfully', [
                'booking_id' => $booking->id,
                'email' => $email,
                'booking_reference' => $booking->booking_reference
            ]);

            return [
                'success' => true,
                'message' => 'Payment details email sent successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to send payment details email', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send payment details email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send admin notification email (INTERNAL NOTIFICATION)
     */
    public function sendAdminNotification(B2BBooking $booking, string $type = 'new_booking'): array
    {
        try {
            $adminEmail = config('mail.admin_email', 'admin@cahaya-anbiya.com');
            $partner = $booking->partner;
            $package = $booking->package;
            $companyName = $partner->b2bVerification?->company_name ?? $partner->name;

            $data = [
                'booking' => $booking,
                'partner' => $partner,
                'package' => $package,
                'company_name' => $companyName,
                'type' => $type,
                'admin_panel_url' => route('admin.b2b-bookings.show', $booking->id),
            ];

            $subject = match($type) {
                'new_booking' => "🆕 New B2B Booking - {$booking->booking_reference}",
                'payment_proof' => "💰 Payment Proof Uploaded - {$booking->booking_reference}",
                'status_update' => "📋 Booking Status Updated - {$booking->booking_reference}",
                default => "📧 B2B Booking Update - {$booking->booking_reference}"
            };

            Mail::send('emails.admin.booking-notification', $data, function ($message) use ($adminEmail, $booking, $subject) {
                $message->to($adminEmail)
                        ->subject($subject . " - Cahaya Anbiya Travel");
            });

            Log::info('Admin notification email sent successfully', [
                'booking_id' => $booking->id,
                'type' => $type,
                'admin_email' => $adminEmail
            ]);

            return [
                'success' => true,
                'message' => 'Admin notification email sent successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to send admin notification email', [
                'booking_id' => $booking->id,
                'type' => $type,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send admin notification email: ' . $e->getMessage()
            ];
        }
    }
}
