<?php

namespace App\Console\Commands;

use App\Services\InboundLeadNotifier;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MailTestAdminAlertCommand extends Command
{
    protected $signature = 'mail:test-admin-alert {to? : Alamat tujuan uji; default = inbox admin pertama}';

    protected $description = 'Tampilkan konfigurasi mail admin + kirim satu email uji lewat mailer aktif.';

    public function handle(): int
    {
        $this->line('Mailer: <fg=cyan>'.config('mail.default').'</>');
        $this->line('MAIL_FROM: <fg=cyan>'.(string) config('mail.from.address').'</> ('.(string) config('mail.from.name').')');

        $recipients = InboundLeadNotifier::adminRecipientEmails();
        if ($recipients === []) {
            $this->error('Belum ada penerima admin. Set ADMIN_NOTIFY_EMAILS, APP_ADMIN_EMAILS, atau MAIL_OPS_NOTIFY_EMAIL di .env / Railway.');

            return self::FAILURE;
        }

        $this->line('Penerima admin (gabungan): '.implode(', ', $recipients));

        foreach (InboundLeadNotifier::diagnosticIssues() as $issue) {
            $this->warn($issue);
        }

        $toArg = $this->argument('to');
        $to = $toArg !== null && trim((string) $toArg) !== '' ? trim((string) $toArg) : $recipients[0];
        if (! filter_var($to, FILTER_VALIDATE_EMAIL)) {
            $this->error('Alamat email tujuan tidak valid.');

            return self::FAILURE;
        }

        if (app()->environment('production') && ! InboundLeadNotifier::outboundMailSendsToNetwork()) {
            $this->error('Production dengan MAIL_MAILER=log atau array — email tidak dikirim ke jaringan. Set MAIL_MAILER=resend (dan RESEND_KEY) atau SMTP.');

            return self::FAILURE;
        }

        try {
            Mail::raw(
                "Tes routing email admin Cahayaweb.\nWaktu: ".now()->toIso8601String()."\nMailer: ".config('mail.default'),
                function ($message) use ($to): void {
                    $message->to($to)->subject('[Cahayaweb] Tes inbox admin');
                }
            );
        } catch (\Throwable $e) {
            $this->error('Gagal mengirim: '.$e->getMessage());

            return self::FAILURE;
        }

        $this->info('Email uji terkirim ke: '.$to);

        return self::SUCCESS;
    }
}
