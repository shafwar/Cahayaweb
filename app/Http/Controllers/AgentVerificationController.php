<?php

namespace App\Http\Controllers;

use App\Models\AgentVerification;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AgentVerificationController extends Controller
{
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
            if (!empty($fileData)) {
                $request->session()->put('b2b_registration_files', $fileData);
            }

            // Ensure HTTPS for redirect URL - use absolute URL and force HTTPS
            $redirectUrl = route('b2b.register.store.continue', [], true);
            // Always force HTTPS for redirect URL in production
            if (app()->environment('production') || $request->secure() || $request->header('X-Forwarded-Proto') === 'https') {
                $redirectUrl = str_replace('http://', 'https://', $redirectUrl);
            }
            
            // Ensure register route also uses HTTPS
            $registerUrl = route('register', ['mode' => 'b2b', 'redirect' => $redirectUrl], true);
            if (app()->environment('production') || $request->secure() || $request->header('X-Forwarded-Proto') === 'https') {
                $registerUrl = str_replace('http://', 'https://', $registerUrl);
            }
            
            return redirect($registerUrl)->with('info', 'Please create an account to complete your B2B agent registration.');
        }

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

        // Handle file uploads - check both request files and stored files
        $fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // New file uploaded
                $file = $request->file($field);
                $path = $file->storeAs(
                    'agent-verifications',
                    Str::uuid()->toString() . '.' . $file->getClientOriginalExtension(),
                    'public'
                );
                $validated[str_replace('_file', '_file', $field)] = $path;
            } elseif (isset($storedFiles[$field])) {
                // Use stored file from temp location
                $tempPath = $storedFiles[$field];
                $newPath = 'agent-verifications/' . basename($tempPath);
                Storage::disk('public')->move($tempPath, $newPath);
                $validated[str_replace('_file', '_file', $field)] = $newPath;
            }
            unset($validated[$field]);
        }

        // Check if user already has a verification (for re-submission after rejection)
        $existingVerification = $user->agentVerification;

        if ($existingVerification) {
            // Update existing verification (for re-submission after rejection)
            $existingVerification->update([
                ...$validated,
                'status' => 'pending',
                'admin_notes' => null, // Clear previous rejection notes
                'reviewed_by' => null,
                'reviewed_at' => null,
                'company_country' => $validated['company_country'] ?? 'Indonesia',
            ]);
            $verification = $existingVerification;
        } else {
            // Create new verification
            $verification = $user->agentVerification()->create([
                ...$validated,
                'status' => 'pending',
                'company_country' => $validated['company_country'] ?? 'Indonesia',
            ]);
        }

        // Clear stored session data
        $request->session()->forget(['b2b_registration_data', 'b2b_registration_files']);

        // Regenerate session token after successful submission to prevent 419 errors on next request
        $request->session()->regenerateToken();

        return redirect()->route('b2b.pending')->with('success', 'Your application has been submitted successfully. Please wait for admin approval.');
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

        // Check if there's stored registration data
        $storedData = $request->session()->get('b2b_registration_data');
        $storedFiles = $request->session()->get('b2b_registration_files');

        if (!$storedData) {
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

        // Handle stored files - move from temp to permanent location
        $fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
        foreach ($fileFields as $field) {
            if (isset($storedFiles[$field])) {
                $tempPath = $storedFiles[$field];
                $newPath = 'agent-verifications/' . basename($tempPath);
                Storage::disk('public')->move($tempPath, $newPath);
                $validated[str_replace('_file', '_file', $field)] = $newPath;
            }
        }

        // Create verification
        $verification = $user->agentVerification()->create([
            ...$validated,
            'status' => 'pending',
            'company_country' => $validated['company_country'] ?? 'Indonesia',
        ]);

        // Clear stored session data
        $request->session()->forget(['b2b_registration_data', 'b2b_registration_files']);

        // Regenerate session token after successful submission
        $request->session()->regenerateToken();

        // Force HTTPS to prevent Mixed Content errors
        $pendingUrl = route('b2b.pending', [], true);
        if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
            $pendingUrl = str_replace('http://', 'https://', $pendingUrl);
        }

        // Use plain redirect to ensure it works correctly
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
                'business_license_file' => $verification->business_license_file ? asset('storage/' . $verification->business_license_file) : null,
                'tax_certificate_file' => $verification->tax_certificate_file ? asset('storage/' . $verification->tax_certificate_file) : null,
                'company_profile_file' => $verification->company_profile_file ? asset('storage/' . $verification->company_profile_file) : null,
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
}
