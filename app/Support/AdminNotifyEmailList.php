<?php

namespace App\Support;

/**
 * Parses comma/semicolon-separated admin notification addresses from env/config strings.
 */
final class AdminNotifyEmailList
{
    /**
     * @return list<string>
     */
    public static function parse(?string $raw): array
    {
        if ($raw === null) {
            return [];
        }
        $raw = trim($raw);
        if ($raw === '') {
            return [];
        }

        $parts = preg_split('/\s*[,;]+\s*/', $raw) ?: [];

        $out = [];
        foreach ($parts as $email) {
            $email = trim((string) $email);
            if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $out[strtolower($email)] = $email;
            }
        }

        return array_values($out);
    }
}
