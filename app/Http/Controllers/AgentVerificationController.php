<?php

namespace App\Http\Controllers;

use App\Models\AgentVerification;
use App\Models\B2BRegistrationDraft;
use App\Support\R2Helper;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AgentVerificationController extends Controller
{
    /**
     * Base path for B2B documents in R2/public.
     * Data (company info, contact, etc.) → database only.
     * Documents (files) → R2 or public; path stored in DB.
     * Path structure: documents/agent-verifications/{user_id}/{verification_id}/ so each B2B account's docs are separate.
     */
    private const B2B_DOCUMENT_PATH_PREFIX = 'documents/agent-verifications';

    /** @deprecated Use getB2BDocumentBasePath() for new uploads */
    private const B2B_DOCUMENT_PATH = 'documents/agent-verifications/';

    /**
     * Show agent registration form
     */
    public function create(Request $request)
    {
        $user = $request->user();

        // If user is logged in, check if they are admin
        if ($user) {
            // Check if user is admin - admins should not see registration form
            $isAdmin = false;
            if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                $isAdmin = true;
            }
            if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                $isAdmin = true;
            }

            // If admin, redirect directly to B2B index
            if ($isAdmin) {
                return redirect()->route('b2b.index');
            }

            // If user is logged in, check their verification status
            $verification = $user->agentVerification;

            if ($verification) {
                if ($verification->isApproved()) {
                    return redirect()->route('b2b.index');
                }
                if ($verification->isPending()) {
                    return redirect()->route('b2b.pending');
                }
            }
        }

        // Show registration form (can be accessed without login)
        // Only show rejection notice if user has a rejected verification
        $rejectedVerification = null;
        if ($user && $user->agentVerification && $user->agentVerification->isRejected()) {
            $rejectedVerification = [
                'company_name' => $user->agentVerification->company_name,
                'admin_notes' => $user->agentVerification->admin_notes,
                'rejected_at' => $user->agentVerification->reviewed_at ? $user->agentVerification->reviewed_at->diffForHumans() : null,
            ];
        }

        return Inertia::render('b2b/register-agent', [
            'isGuest' => !$user,
            'rejectedVerification' => $rejectedVerification,
        ]);
    }

    /**
     * Store agent verification application
     */
    public function store(Request $request)
    {
        // Check for file size issues before processing
        $fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
        $totalSize = 0;
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $totalSize += $request->file($field)->getSize();
            }
        }

        // Maximum total size: 15MB (3 files × 5MB each)
        $maxTotalSize = 15 * 1024 * 1024; // 15MB
        if ($totalSize > $maxTotalSize) {
            return back()->withErrors([
                'file_size' => 'Total file size exceeds the maximum allowed limit of 15MB. Please ensure each file is no larger than 5MB.',
            ])->withInput();
        }

        $user = $request->user();

        // If user is not logged in, store form data in session and redirect to register/login
        if (!$user) {
            // Store form data in session for after registration (exclude country code fields as they're combined with phone)
            $request->session()->put('b2b_registration_data', $request->except([
                '_token',
                'business_license_file',
                'tax_certificate_file',
                'company_profile_file',
                'company_phone_country_code',
                'contact_person_phone_country_code'
            ]));

            // Store files temporarily if uploaded
            $fileData = [];
            $fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $path = $file->storeAs(
                        'temp-agent-verifications',
                        Str::uuid()->toString() . '.' . $file->getClientOriginalExtension(),
                        'public'
                    );
                    $fileData[$field] = $path;
                }
            }

            Log::info('B2B guest submit', [
                'has_business_license' => $request->hasFile('business_license_file'),
                'has_tax_certificate' => $request->hasFile('tax_certificate_file'),
                'has_company_profile' => $request->hasFile('company_profile_file'),
                'content_length' => $request->header('Content-Length'),
                'content_type' => $request->header('Content-Type'),
                'files_received' => count($fileData),
            ]);

            if (!empty($fileData)) {
                $request->session()->put('b2b_registration_files', $fileData);
            }

            // Draft: save files to shared storage (R2) so continue works when session is lost (e.g. multi-instance)
            $redirectUrl = null;
            if (!empty($fileData)) {
                try {
                    $token = Str::random(64);
                    $uploadDiskName = $this->getAgentVerificationUploadDiskName();
                    $draftFilePaths = [];
                    foreach ($fileData as $field => $localPath) {
                        $contents = Storage::disk('public')->get($localPath);
                        if ($contents !== null) {
                            $ext = pathinfo($localPath, PATHINFO_EXTENSION);
                            $newPath = 'temp-b2b-drafts/' . $token . '/' . Str::uuid()->toString() . '.' . $ext;
                            Storage::disk($uploadDiskName)->put($newPath, $contents);
                            $draftFilePaths[$field] = $newPath;
                        }
                    }
                    if (!empty($draftFilePaths)) {
                        $formData = $request->except([
                            '_token', 'business_license_file', 'tax_certificate_file', 'company_profile_file',
                            'company_phone_country_code', 'contact_person_phone_country_code',
                        ]);
                        B2BRegistrationDraft::create([
                            'token' => $token,
                            'payload' => $formData,
                            'file_paths' => $draftFilePaths,
                            'expires_at' => now()->addHour(),
                        ]);
                        $redirectUrl = route('b2b.register.store.continue', ['b2b_token' => $token], true);
                        Log::info('B2B draft created', ['token_preview' => substr($token, 0, 8) . '...', 'redirect_url' => $redirectUrl]);
                    }
                } catch (\Throwable $e) {
                    Log::warning('B2B draft creation failed', ['message' => $e->getMessage()]);
                }
            }
            if ($redirectUrl === null) {
                $redirectUrl = route('b2b.register.store.continue', [], true);
            }
            if (app()->environment('production') || $request->secure() || $request->header('X-Forwarded-Proto') === 'https') {
                $redirectUrl = str_replace('http://', 'https://', $redirectUrl);
            }

            $registerUrl = route('register', ['mode' => 'b2b', 'redirect' => $redirectUrl], true);
            if (app()->environment('production') || $request->secure() || $request->header('X-Forwarded-Proto') === 'https') {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }

            return redirect($registerUrl)->with('info', 'Please create an account to complete your B2B agent registration.');
        }

        Log::info('B2B store (logged-in) start', ['user_id' => $user->id]);

        // Check if user already has a verification
        if ($user->agentVerification) {
            return back()->withErrors([
                'message' => 'You already have a verification application. Please wait for admin approval.'
            ]);
        }

        // Check if there's stored registration data from guest submission
        $storedData = $request->session()->get('b2b_registration_data');
        $storedFiles = $request->session()->get('b2b_registration_files');

        // Use stored data if available (from guest submission), otherwise validate from request
        if ($storedData) {
            // Merge stored data with any new file uploads
            $validated = array_merge($storedData, $request->only([
                'business_license_file', 'tax_certificate_file', 'company_profile_file'
            ]));

            // Validate stored data
            $validator = \Validator::make($validated, [
                'company_name' => ['required', 'string', 'max:255'],
                'company_email' => ['required', 'email', 'max:255'],
                'company_phone' => ['required', 'string', 'max:50'],
                'company_address' => ['required', 'string'],
                'company_city' => ['required', 'string', 'max:100'],
                'company_province' => ['required', 'string', 'max:100'],
                'company_postal_code' => ['required', 'string', 'max:20'],
                'company_country' => ['nullable', 'string', 'max:100'],
                'business_license_number' => ['nullable', 'string', 'max:100'],
                'tax_id_number' => ['nullable', 'string', 'max:100'],
                'business_type' => ['required', 'string', 'max:50'],
                'business_type_other' => ['required_if:business_type,Other', 'nullable', 'string', 'max:100'],
                'years_in_business' => ['nullable', 'integer', 'min:0', 'max:100'],
                'business_description' => ['nullable', 'string'],
                'contact_person_name' => ['required', 'string', 'max:255'],
                'contact_person_position' => ['required', 'string', 'max:100'],
                'contact_person_phone' => ['required', 'string', 'max:50'],
                'contact_person_email' => ['required', 'email', 'max:255'],
                'business_license_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
                'tax_certificate_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
                'company_profile_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $validated = $validator->validated();
        } else {
            $validated = $request->validate([
                // Company Information
                'company_name' => ['required', 'string', 'max:255'],
                'company_email' => ['required', 'email', 'max:255'],
                'company_phone' => ['required', 'string', 'max:50'],
                'company_address' => ['required', 'string'],
                'company_city' => ['required', 'string', 'max:100'],
                'company_province' => ['required', 'string', 'max:100'],
                'company_postal_code' => ['required', 'string', 'max:20'],
                'company_country' => ['nullable', 'string', 'max:100'],

                // Business Information
                'business_license_number' => ['nullable', 'string', 'max:100'],
                'tax_id_number' => ['nullable', 'string', 'max:100'],
                'business_type' => ['required', 'string', 'max:50'],
                'business_type_other' => ['required_if:business_type,Other', 'nullable', 'string', 'max:100'],
                'years_in_business' => ['nullable', 'integer', 'min:0', 'max:100'],
                'business_description' => ['nullable', 'string'],

                // Contact Person
                'contact_person_name' => ['required', 'string', 'max:255'],
                'contact_person_position' => ['required', 'string', 'max:100'],
                'contact_person_phone' => ['required', 'string', 'max:50'],
                'contact_person_email' => ['required', 'email', 'max:255'],

                // Documents
                'business_license_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
                'tax_certificate_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
                'company_profile_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            ]);
        }

        // Build scalar-only payload for create (no file objects); R2/storage must not block DB save
        $fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
        $validatedScalar = collect($validated)->except($fileFields)->all();
        $validatedScalar['status'] = 'pending';
        $validatedScalar['company_country'] = $validated['company_country'] ?? 'Indonesia';
        foreach ($fileFields as $field) {
            $validatedScalar[$field] = null;
        }

        try {
            // 1. Save to DB first so application always appears in admin (R2/storage must not block this)
            $existingVerification = $user->agentVerification;

            if ($existingVerification) {
                $existingVerification->update(array_merge($validatedScalar, [
                    'admin_notes' => null,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                ]));
                $verification = $existingVerification;
            } else {
                $verification = $user->agentVerification()->create($validatedScalar);
            }

            Log::info('B2B verification saved to DB', ['user_id' => $user->id, 'verification_id' => $verification->id]);

            // 2. Upload files to R2/public under per-account path: documents/agent-verifications/{user_id}/{verification_id}/
            $uploadDiskName = $this->getAgentVerificationUploadDiskName();
            $basePath = $this->getB2BDocumentBasePath((int) $user->id, (int) $verification->id);

            foreach ($fileFields as $field) {
                $path = null;
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $path = $this->storeFileWithFallback($file, $basePath, $uploadDiskName, $field);
                } elseif (isset($storedFiles[$field])) {
                    $tempPath = $storedFiles[$field];
                    $contents = Storage::disk('public')->get($tempPath);
                    if ($contents !== null) {
                        $fileName = basename($tempPath);
                        $path = $this->putFileWithFallback($contents, $basePath . '/' . $fileName, $uploadDiskName, $field);
                        if ($path !== null) {
                            Storage::disk('public')->delete($tempPath);
                        }
                    }
                }
                if ($path !== null) {
                    $verification->update([$field => $path]);
                }
            }

            // Clear stored session data
            $request->session()->forget(['b2b_registration_data', 'b2b_registration_files']);

            // Regenerate session token after successful submission to prevent 419 errors on next request
            $request->session()->regenerateToken();

            return redirect()->route('b2b.pending')->with('success', 'Your application has been submitted successfully. Please wait for admin approval.');
        } catch (\Throwable $e) {
            Log::error('B2B store (logged-in) failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('b2b.register')
                ->withErrors([
                    'message' => 'Unable to save your application. Please check your data and try again. If the problem persists, contact support.',
                ])
                ->withInput($request->except(['business_license_file', 'tax_certificate_file', 'company_profile_file', '_token']));
        }
    }

    /**
     * Store uploaded file: try R2 first (when configured), then public. Path stored in DB is used for admin download.
     */
    private function storeFileWithFallback($file, string $basePath, string $primaryDisk, string $fieldName): ?string
    {
        $filename = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
        try {
            $stored = $file->storeAs($basePath, $filename, $primaryDisk);
            if (is_string($stored)) {
                if ($primaryDisk === 'r2') {
                    Log::info('B2B document uploaded to R2', ['field' => $fieldName, 'path' => $stored]);
                }
                return $stored;
            }
            return null;
        } catch (\Throwable $e) {
            Log::warning('B2B file upload failed (primary disk), using public', [
                'field' => $fieldName,
                'disk' => $primaryDisk,
                'error' => $e->getMessage(),
            ]);
            try {
                $stored = $file->storeAs($basePath, $filename, 'public');
                return is_string($stored) ? $stored : null;
            } catch (\Throwable $e2) {
                Log::error('B2B file upload failed (public fallback)', ['field' => $fieldName, 'error' => $e2->getMessage()]);
                return null;
            }
        }
    }

    /**
     * Put file contents: try R2 first (when configured), then public. Path stored in DB is used for admin download.
     */
    private function putFileWithFallback(string $contents, string $path, string $primaryDisk, string $fieldName): ?string
    {
        $path = ltrim($path, '/');
        try {
            if (Storage::disk($primaryDisk)->put($path, $contents)) {
                if ($primaryDisk === 'r2') {
                    Log::info('B2B document uploaded to R2 (from temp)', ['field' => $fieldName, 'path' => $path]);
                }
                return $path;
            }
        } catch (\Throwable $e) {
            Log::warning('B2B put file failed (primary disk), using public', [
                'field' => $fieldName,
                'disk' => $primaryDisk,
                'error' => $e->getMessage(),
            ]);
        }
        try {
            if (Storage::disk('public')->put($path, $contents)) {
                return $path;
            }
        } catch (\Throwable $e2) {
            Log::error('B2B put file failed (public fallback)', ['field' => $fieldName, 'error' => $e2->getMessage()]);
        }
        return null;
    }

    /**
     * Continue registration after user creates account (for guest submissions)
     */
    public function storeContinue(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            $registerUrl = route('b2b.register', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            return redirect($registerUrl);
        }

        // Check if there's stored registration data (session) or draft (b2b_token) when session lost (e.g. multi-instance)
        $storedData = $request->session()->get('b2b_registration_data');
        $storedFiles = $request->session()->get('b2b_registration_files');

        if (!$storedData && $request->filled('b2b_token')) {
            Log::info('B2B continue: using draft (b2b_token)', ['user_id' => $user->id]);
            return $this->storeContinueFromDraft($request, $user);
        }

        if (!$storedData) {
            Log::warning('B2B continue: no session data and no b2b_token', ['user_id' => $user->id]);
            $registerUrl = route('b2b.register', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            return redirect($registerUrl)->with('error', 'No registration data found. Please fill the form again.');
        }

        // Check if user already has a verification
        if ($user->agentVerification) {
            $request->session()->forget(['b2b_registration_data', 'b2b_registration_files']);
            $pendingUrl = route('b2b.pending', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $pendingUrl = str_replace('http://', 'https://', $pendingUrl);
            }
            return redirect($pendingUrl)->with('info', 'You already have a verification application.');
        }

        // Validate stored data
        $validator = \Validator::make($storedData, [
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['required', 'email', 'max:255'],
            'company_phone' => ['required', 'string', 'max:50'],
            'company_address' => ['required', 'string'],
            'company_city' => ['required', 'string', 'max:100'],
            'company_province' => ['required', 'string', 'max:100'],
            'company_postal_code' => ['required', 'string', 'max:20'],
            'company_country' => ['nullable', 'string', 'max:100'],
            'business_license_number' => ['nullable', 'string', 'max:100'],
            'tax_id_number' => ['nullable', 'string', 'max:100'],
            'business_type' => ['required', 'string', 'max:50'],
            'business_type_other' => ['required_if:business_type,Other', 'nullable', 'string', 'max:100'],
            'years_in_business' => ['nullable', 'integer', 'min:0', 'max:100'],
            'business_description' => ['nullable', 'string'],
            'contact_person_name' => ['required', 'string', 'max:255'],
            'contact_person_position' => ['required', 'string', 'max:100'],
            'contact_person_phone' => ['required', 'string', 'max:50'],
            'contact_person_email' => ['required', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            $request->session()->forget(['b2b_registration_data', 'b2b_registration_files']);
            $registerUrl = route('b2b.register', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            return redirect($registerUrl)->withErrors($validator)->with('error', 'Invalid registration data. Please fill the form again.');
        }

        $validated = $validator->validated();
        $fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
        foreach ($fileFields as $field) {
            $validated[$field] = null;
        }

        try {
            // 1. Create verification first (data in DB only; no file paths yet)
            $verification = $user->agentVerification()->create([
                ...$validated,
                'status' => 'pending',
                'company_country' => $validated['company_country'] ?? 'Indonesia',
            ]);

            // 2. Upload files to per-account path: documents/agent-verifications/{user_id}/{verification_id}/
            $uploadDiskName = $this->getAgentVerificationUploadDiskName();
            $basePath = $this->getB2BDocumentBasePath((int) $user->id, (int) $verification->id);

            foreach ($fileFields as $field) {
                if (!isset($storedFiles[$field])) {
                    continue;
                }
                $tempPath = $storedFiles[$field];
                $contents = Storage::disk('public')->get($tempPath);
                if ($contents !== null) {
                    $fileName = basename($tempPath);
                    $path = $this->putFileWithFallback($contents, $basePath . '/' . $fileName, $uploadDiskName, $field);
                    if ($path !== null) {
                        $verification->update([$field => $path]);
                        Storage::disk('public')->delete($tempPath);
                    }
                }
            }

            Log::info('B2B verification created (session)', ['user_id' => $user->id, 'verification_id' => $verification->id]);
        } catch (\Throwable $e) {
            Log::error('B2B storeContinue (session) failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            $request->session()->forget(['b2b_registration_data', 'b2b_registration_files']);
            $registerUrl = route('b2b.register', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            return redirect($registerUrl)->with('error', 'Could not save your application. Please try again or contact support.');
        }

        $request->session()->forget(['b2b_registration_data', 'b2b_registration_files']);
        $request->session()->regenerateToken();

        $pendingUrl = route('b2b.pending', [], true);
        if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
            $pendingUrl = str_replace('http://', 'https://', $pendingUrl);
        }
        return redirect($pendingUrl)->with('success', 'Your application has been submitted successfully. Please wait for admin approval.');
    }

    /**
     * Create AgentVerification from draft (when session was lost, e.g. multi-instance).
     */
    private function storeContinueFromDraft(Request $request, $user): RedirectResponse
    {
        $token = $request->input('b2b_token');
        $draft = B2BRegistrationDraft::where('token', $token)->first();

        if (!$draft || $draft->isExpired()) {
            Log::warning('B2B draft not found or expired', ['token_preview' => $token ? substr($token, 0, 8) . '...' : null]);
            if ($draft) {
                $draft->delete();
            }
            $registerUrl = route('b2b.register', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            return redirect($registerUrl)->with('error', 'Registration link expired or invalid. Please fill the form again.');
        }

        $storedData = $draft->payload;
        $storedFiles = $draft->file_paths ?? [];

        $validator = \Validator::make($storedData, [
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['required', 'email', 'max:255'],
            'company_phone' => ['required', 'string', 'max:50'],
            'company_address' => ['required', 'string'],
            'company_city' => ['required', 'string', 'max:100'],
            'company_province' => ['required', 'string', 'max:100'],
            'company_postal_code' => ['required', 'string', 'max:20'],
            'company_country' => ['nullable', 'string', 'max:100'],
            'business_license_number' => ['nullable', 'string', 'max:100'],
            'tax_id_number' => ['nullable', 'string', 'max:100'],
            'business_type' => ['required', 'string', 'max:50'],
            'business_type_other' => ['required_if:business_type,Other', 'nullable', 'string', 'max:100'],
            'years_in_business' => ['nullable', 'integer', 'min:0', 'max:100'],
            'business_description' => ['nullable', 'string'],
            'contact_person_name' => ['required', 'string', 'max:255'],
            'contact_person_position' => ['required', 'string', 'max:100'],
            'contact_person_phone' => ['required', 'string', 'max:50'],
            'contact_person_email' => ['required', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            $draft->delete();
            $registerUrl = route('b2b.register', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            return redirect($registerUrl)->withErrors($validator)->with('error', 'Invalid registration data. Please fill the form again.');
        }

        $validated = $validator->validated();
        $fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
        foreach ($fileFields as $field) {
            $validated[$field] = null;
        }

        try {
            // 1. Create verification first (data in DB only; no file paths yet)
            $verification = $user->agentVerification()->create([
                ...$validated,
                'status' => 'pending',
                'company_country' => $validated['company_country'] ?? 'Indonesia',
            ]);

            // 2. Copy draft files to per-account path: documents/agent-verifications/{user_id}/{verification_id}/
            $uploadDiskName = $this->getAgentVerificationUploadDiskName();
            $basePath = $this->getB2BDocumentBasePath((int) $user->id, (int) $verification->id);

            foreach ($fileFields as $field) {
                if (!isset($storedFiles[$field])) {
                    continue;
                }
                $tempPath = $storedFiles[$field];
                try {
                    $contents = Storage::disk($uploadDiskName)->get($tempPath);
                    if ($contents !== null && strlen($contents) > 0) {
                        $ext = pathinfo($tempPath, PATHINFO_EXTENSION);
                        $fileName = Str::uuid()->toString() . '.' . $ext;
                        $path = $this->putFileWithFallback($contents, $basePath . '/' . $fileName, $uploadDiskName, $field);
                        if ($path !== null) {
                            $verification->update([$field => $path]);
                        }
                    }
                    if (Storage::disk($uploadDiskName)->exists($tempPath)) {
                        Storage::disk($uploadDiskName)->delete($tempPath);
                    }
                } catch (\Throwable $e) {
                    Log::warning('B2B draft file copy failed', ['field' => $field, 'path' => $tempPath, 'message' => $e->getMessage()]);
                }
            }

            try {
                $files = Storage::disk($uploadDiskName)->files('temp-b2b-drafts/' . $token);
                foreach ($files as $file) {
                    Storage::disk($uploadDiskName)->delete($file);
                }
            } catch (\Throwable $e) {
                // ignore cleanup errors
            }

            Log::info('B2B verification created (draft)', ['user_id' => $user->id, 'verification_id' => $verification->id]);
        } catch (\Throwable $e) {
            Log::error('B2B storeContinueFromDraft create failed', ['user_id' => $user->id, 'message' => $e->getMessage()]);
            $draft->delete();
            $registerUrl = route('b2b.register', [], true);
            if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            return redirect($registerUrl)->with('error', 'Could not complete registration. Please try again.');
        }

        $draft->delete();
        $request->session()->regenerateToken();

        $pendingUrl = route('b2b.pending', [], true);
        if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
            $pendingUrl = str_replace('http://', 'https://', $pendingUrl);
        }
        return redirect($pendingUrl)->with('success', 'Your application has been submitted successfully. Please wait for admin approval.');
    }

    /**
     * Show pending verification page
     */
    public function pending(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('b2b.register');
        }

        $verification = $user->agentVerification;

        if (!$verification) {
            return redirect()->route('b2b.register');
        }

        if ($verification->isApproved()) {
            return redirect()->route('b2b.index');
        }

        return Inertia::render('b2b/pending-verification', [
            'verification' => [
                'id' => $verification->id,
                'company_name' => $verification->company_name,
                'status' => $verification->status,
                'admin_notes' => $verification->admin_notes,
                'created_at' => $verification->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $verification->created_at->diffForHumans(),
            ]
        ]);
    }

    /**
     * Admin: List all agent verifications
     */
    public function index(Request $request)
    {
        $verifications = AgentVerification::with(['user', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/agent-verifications', [
            'verifications' => [
                'data' => $verifications->through(function ($verification) {
                    return [
                        'id' => $verification->id,
                        'user_id' => $verification->user_id,
                        'user_name' => $verification->user->name,
                        'user_email' => $verification->user->email,
                        'company_name' => $verification->company_name,
                        'company_email' => $verification->company_email,
                        'company_phone' => $verification->company_phone,
                        'contact_person_name' => $verification->contact_person_name,
                        'contact_person_email' => $verification->contact_person_email,
                        'status' => $verification->status,
                        'admin_notes' => $verification->admin_notes,
                        'reviewed_by' => $verification->reviewer ? $verification->reviewer->name : null,
                        'reviewed_at' => $verification->reviewed_at?->format('Y-m-d H:i:s'),
                        'created_at' => $verification->created_at->format('Y-m-d H:i:s'),
                        'created_at_human' => $verification->created_at->diffForHumans(),
                    ];
                })->items(),
                'current_page' => $verifications->currentPage(),
                'last_page' => $verifications->lastPage(),
                'per_page' => $verifications->perPage(),
                'total' => $verifications->total(),
            ],
            'pagination' => [
                'current_page' => $verifications->currentPage(),
                'last_page' => $verifications->lastPage(),
                'per_page' => $verifications->perPage(),
                'total' => $verifications->total(),
            ]
        ]);
    }

    /**
     * Admin: Show single verification details
     */
    public function show(Request $request, AgentVerification $verification)
    {
        $verification->load(['user', 'reviewer']);

        return Inertia::render('admin/agent-verification-detail', [
            'flash' => [
                'error' => $request->session()->get('error'),
                'success' => $request->session()->get('success'),
            ],
            'verification' => [
                'id' => $verification->id,
                'user_id' => $verification->user_id,
                'user_name' => $verification->user->name,
                'user_email' => $verification->user->email,
                'company_name' => $verification->company_name,
                'company_email' => $verification->company_email,
                'company_phone' => $verification->company_phone,
                'company_address' => $verification->company_address,
                'company_city' => $verification->company_city,
                'company_province' => $verification->company_province,
                'company_postal_code' => $verification->company_postal_code,
                'company_country' => $verification->company_country,
                'business_license_number' => $verification->business_license_number,
                'tax_id_number' => $verification->tax_id_number,
                'business_type' => $verification->business_type,
                'business_type_other' => $verification->business_type_other,
                'years_in_business' => $verification->years_in_business,
                'business_description' => $verification->business_description,
                'contact_person_name' => $verification->contact_person_name,
                'contact_person_position' => $verification->contact_person_position,
                'contact_person_phone' => $verification->contact_person_phone,
                'contact_person_email' => $verification->contact_person_email,
                'business_license_file' => $verification->business_license_file
                    ? route('admin.agent-verification.download', ['verification' => $verification->id, 'documentType' => 'business-license'])
                    : null,
                'tax_certificate_file' => $verification->tax_certificate_file
                    ? route('admin.agent-verification.download', ['verification' => $verification->id, 'documentType' => 'tax-certificate'])
                    : null,
                'company_profile_file' => $verification->company_profile_file
                    ? route('admin.agent-verification.download', ['verification' => $verification->id, 'documentType' => 'company-profile'])
                    : null,
                'status' => $verification->status,
                'admin_notes' => $verification->admin_notes,
                'reviewed_by' => $verification->reviewer ? $verification->reviewer->name : null,
                'reviewed_at' => $verification->reviewed_at?->format('Y-m-d H:i:s'),
                'created_at' => $verification->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $verification->created_at->diffForHumans(),
            ]
        ]);
    }

    /**
     * Admin: Approve agent verification
     */
    public function approve(Request $request, AgentVerification $verification)
    {
        $verification->update([
            'status' => 'approved',
            'admin_notes' => null, // Clear admin notes on approval
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Agent verification approved successfully.');
    }

    /**
     * Admin: Update agent verification (status and notes)
     */
    public function update(Request $request, AgentVerification $verification)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // If changing to rejected, admin_notes is required
        if ($validated['status'] === 'rejected' && empty($validated['admin_notes'])) {
            return back()->withErrors(['admin_notes' => 'Rejection reason is required when rejecting an application.']);
        }

        // Clear admin_notes if status is approved or pending
        $adminNotes = null;
        if ($validated['status'] === 'rejected') {
            $adminNotes = $validated['admin_notes'] ?? null;
        }

        $verification->update([
            'status' => $validated['status'],
            'admin_notes' => $adminNotes,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $statusMessage = match($validated['status']) {
            'approved' => 'Agent verification approved successfully.',
            'rejected' => 'Agent verification rejected successfully.',
            'pending' => 'Agent verification status updated to pending.',
        };

        return back()->with('success', $statusMessage);
    }

    /**
     * Admin: Reject agent verification
     */
    public function reject(Request $request, AgentVerification $verification)
    {
        $validated = $request->validate([
            'admin_notes' => ['required', 'string', 'min:10'],
        ], [
            'admin_notes.required' => 'Please provide a reason for rejection.',
            'admin_notes.min' => 'Rejection reason must be at least 10 characters.',
        ]);

        $verification->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Agent verification rejected.');
    }

    /**
     * Admin: Delete a single agent verification
     */
    public function destroy(AgentVerification $verification)
    {
        // Delete associated files
        if ($verification->business_license_file) {
            Storage::disk('public')->delete($verification->business_license_file);
        }
        if ($verification->tax_certificate_file) {
            Storage::disk('public')->delete($verification->tax_certificate_file);
        }
        if ($verification->company_profile_file) {
            Storage::disk('public')->delete($verification->company_profile_file);
        }

        $verification->delete();

        return back()->with('success', 'Agent verification deleted successfully.');
    }

    /**
     * Admin: Delete multiple agent verifications
     */
    public function destroyMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'integer', 'exists:agent_verifications,id'],
        ]);

        $verifications = AgentVerification::whereIn('id', $validated['ids'])->get();

        foreach ($verifications as $verification) {
            // Delete associated files
            if ($verification->business_license_file) {
                Storage::disk('public')->delete($verification->business_license_file);
            }
            if ($verification->tax_certificate_file) {
                Storage::disk('public')->delete($verification->tax_certificate_file);
            }
            if ($verification->company_profile_file) {
                Storage::disk('public')->delete($verification->company_profile_file);
            }

            $verification->delete();
        }

        $count = count($validated['ids']);
        return redirect()->route('admin.agent-verifications')->with('success', "{$count} agent verification(s) deleted successfully.");
    }

    /**
     * Admin: Delete all agent verifications
     */
    public function destroyAll(Request $request)
    {
        $verifications = AgentVerification::all();
        $count = $verifications->count();

        foreach ($verifications as $verification) {
            // Delete associated files
            if ($verification->business_license_file) {
                Storage::disk('public')->delete($verification->business_license_file);
            }
            if ($verification->tax_certificate_file) {
                Storage::disk('public')->delete($verification->tax_certificate_file);
            }
            if ($verification->company_profile_file) {
                Storage::disk('public')->delete($verification->company_profile_file);
            }

            $verification->delete();
        }

        return redirect()->route('admin.agent-verifications')->with('success', "All {$count} agent verification(s) deleted successfully.");
    }

    /**
     * Get file URL - handles both R2 and local storage
     *
     * @param string|null $path File path stored in database
     * @return string|null Full URL to the file or null if path is empty
     */
    /**
     * Download agent verification document (proxy through Laravel).
     * Tries public disk first (where uploads are stored), then R2. Never returns 500.
     */
    public function downloadDocument(Request $request, AgentVerification $verification, string $documentType)
    {
        $filePath = null;
        $baseFileName = null;
        $verificationId = $verification->id;

        try {
            $user = $request->user();
            if (!$user) {
                abort(403, 'Unauthorized');
            }

            $isAdmin = ($user->role ?? null) === 'admin' ||
                in_array($user->email, config('app.admin_emails', []), true);

            if (!$isAdmin) {
                abort(403, 'Unauthorized - Admin access required');
            }

            switch ($documentType) {
                case 'business-license':
                    $filePath = $verification->business_license_file;
                    $baseFileName = 'business-license-' . $verificationId;
                    break;
                case 'tax-certificate':
                    $filePath = $verification->tax_certificate_file;
                    $baseFileName = 'tax-certificate-' . $verificationId;
                    break;
                case 'company-profile':
                    $filePath = $verification->company_profile_file;
                    $baseFileName = 'company-profile-' . $verificationId;
                    break;
                default:
                    abort(404, 'Document type not found');
            }

            if (empty($filePath)) {
                \Log::warning('Agent verification document path is empty', [
                    'verification_id' => $verificationId,
                    'document_type' => $documentType,
                ]);
                abort(404, 'Document not found');
            }

            $filePath = ltrim((string) $filePath, '/');
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);
            $fileName = $baseFileName . '.' . ($extension ?: 'pdf');
            $mimeType = $this->getMimeType($extension);

            // Paths to try: must match what we store (documents/agent-verifications/... or public/...)
            $pathsToTry = [
                $filePath,
                ltrim(str_replace('public/', '', $filePath), '/'),
                'public/' . ltrim($filePath, '/'),
            ];
            $pathsToTry = array_values(array_unique(array_filter($pathsToTry)));

            $streamResponse = function ($disk, $path) use ($mimeType, $fileName) {
                return response()->stream(function () use ($disk, $path) {
                    $stream = $disk->readStream($path);
                    if ($stream) {
                        fpassthru($stream);
                        fclose($stream);
                    }
                }, 200, [
                    'Content-Type' => $mimeType,
                    'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                    'Cache-Control' => 'private, max-age=3600',
                ]);
            };

            // 1) Try R2 first when configured (B2B docs are stored in R2 when R2 is configured)
            if (R2Helper::isR2DiskConfigured()) {
                try {
                    $r2Disk = Storage::disk('r2');
                    foreach ($pathsToTry as $path) {
                        try {
                            if ($r2Disk->exists($path)) {
                                \Log::info('Admin download: serving from R2', [
                                    'path' => $path,
                                    'verification_id' => $verificationId,
                                ]);
                                return $streamResponse($r2Disk, $path);
                            }
                        } catch (\Throwable $e) {
                            \Log::debug('R2 check failed for path', ['path' => $path, 'error' => $e->getMessage()]);
                        }
                    }
                } catch (\Throwable $e) {
                    \Log::warning('R2 disk unavailable for download', [
                        'error' => $e->getMessage(),
                        'verification_id' => $verificationId,
                    ]);
                }
            }

            // 2) Fallback: try public disk (when R2 was not used or file was fallback-uploaded to public)
            $publicDisk = Storage::disk('public');
            foreach ($pathsToTry as $path) {
                try {
                    if ($publicDisk->exists($path)) {
                        \Log::info('Admin download: serving from public disk', [
                            'path' => $path,
                            'verification_id' => $verificationId,
                        ]);
                        return $streamResponse($publicDisk, $path);
                    }
                } catch (\Throwable $e) {
                    \Log::debug('Public disk check failed for path', ['path' => $path, 'error' => $e->getMessage()]);
                }
            }

            \Log::error('Document not found', [
                'verification_id' => $verificationId,
                'document_type' => $documentType,
                'file_path' => $filePath,
                'tried_paths' => $pathsToTry,
            ]);

            abort(404, 'File not found');
        } catch (\Illuminate\Http\Exceptions\HttpResponseException $e) {
            throw $e;
        } catch (\Throwable $e) {
            \Log::error('Download error', [
                'verification_id' => $verificationId,
                'document_type' => $documentType ?? null,
                'file_path' => $filePath ?? null,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            // Never return 500 to user: redirect back with message
            return redirect()
                ->route('admin.agent-verification.show', $verificationId)
                ->with('error', 'Dokumen tidak dapat diunduh. Silakan coba lagi atau hubungi dukungan.');
        }
    }

    /**
     * Base path for one B2B account's documents in R2/public.
     * Enables separation: documents/agent-verifications/{user_id}/{verification_id}/ = one person's docs.
     */
    private function getB2BDocumentBasePath(int $userId, int $verificationId): string
    {
        return self::B2B_DOCUMENT_PATH_PREFIX . '/' . $userId . '/' . $verificationId;
    }

    /**
     * Disk name for agent-verification document uploads.
     * Uses R2 when configured; files land in bucket under public/documents/agent-verifications/{user_id}/{verification_id}/.
     */
    private function getAgentVerificationUploadDiskName(): string
    {
        return R2Helper::isR2DiskConfigured() ? 'r2' : 'public';
    }

    /**
     * Get MIME type based on file extension
     */
    private function getMimeType(?string $extension): string
    {
        $extension = strtolower($extension ?? '');

        $mimeTypes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'txt' => 'text/plain',
            'csv' => 'text/csv',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }
}
