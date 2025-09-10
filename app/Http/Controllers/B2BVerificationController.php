<?php

namespace App\Http\Controllers;

use App\Models\B2BVerification;
use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\B2BApprovalNotification;
use App\Notifications\B2BRejectionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class B2BVerificationController extends Controller
{
    public function showVerificationRequired(): Response
    {
        $user = Auth::user();

        if (!$user->isB2B()) {
            return redirect()->route('home');
        }

        $verification = $user->b2bVerification;

        return Inertia::render('B2B/VerificationRequired', [
            'verification' => $verification,
        ]);
    }

    public function showVerificationForm(): Response
    {
        $user = Auth::user();

        if (!$user->isB2B()) {
            return redirect()->route('home');
        }

        if ($user->b2bVerification) {
            return redirect()->route('b2b.verification.required');
        }

        return Inertia::render('B2B/VerificationForm');
    }

    public function submitVerification(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string|max:500',
            'business_license_number' => 'required|string|max:255',
            'tax_id_number' => 'nullable|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:255',
            'license_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $user = Auth::user();

        if ($user->b2bVerification) {
            return back()->withErrors(['error' => 'Verification already submitted.']);
        }

        // Handle file upload
        $file = $request->file('license_file');
        $fileName = time() . '_' . $user->id . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('licenses', $fileName, 'public');

        // Create verification record
        B2BVerification::create([
            'user_id' => $user->id,
            'company_name' => $request->company_name,
            'company_address' => $request->company_address,
            'business_license_number' => $request->business_license_number,
            'tax_id_number' => $request->tax_id_number,
            'contact_person' => $request->contact_person,
            'contact_phone' => $request->contact_phone,
            'contact_email' => $request->contact_email,
            'license_file_path' => $filePath,
            'status' => 'pending',
        ]);

        return redirect()->route('b2b.verification.required')
            ->with('success', 'Verification submitted successfully. We will review your application and contact you soon.');
    }

    public function showVerificationStatus(): Response
    {
        $user = Auth::user();

        if (!$user->isB2B()) {
            return redirect()->route('home');
        }

        $verification = $user->b2bVerification;

        if (!$verification) {
            return redirect()->route('b2b.verification.form');
        }

        return Inertia::render('B2B/VerificationStatus', [
            'verification' => $verification,
        ]);
    }

    /**
     * Approve B2B verification (Admin only)
     */
    public function approve(Request $request, B2BVerification $verification)
    {
        // Check if user is admin
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        // Update verification status
        $verification->update([
            'status' => 'approved',
            'admin_notes' => $request->reason,
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        // Log audit trail
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'b2b_verification_approved',
            'target_type' => 'B2BVerification',
            'target_id' => $verification->id,
            'details' => [
                'verification_id' => $verification->id,
                'user_id' => $verification->user_id,
                'company_name' => $verification->company_name,
                'reason' => $request->reason,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Send approval notification
        $verification->user->notify(new B2BApprovalNotification(Auth::user(), $request->reason));

        return back()->with('success', 'B2B verification approved successfully.');
    }

    /**
     * Reject B2B verification (Admin only)
     */
    public function reject(Request $request, B2BVerification $verification)
    {
        // Check if user is admin
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // Update verification status
        $verification->update([
            'status' => 'rejected',
            'admin_notes' => $request->reason,
            'rejected_at' => now(),
            'rejected_by' => Auth::id(),
        ]);

        // Log audit trail
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'b2b_verification_rejected',
            'target_type' => 'B2BVerification',
            'target_id' => $verification->id,
            'details' => [
                'verification_id' => $verification->id,
                'user_id' => $verification->user_id,
                'company_name' => $verification->company_name,
                'reason' => $request->reason,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Send rejection notification
        $verification->user->notify(new B2BRejectionNotification(Auth::user(), $request->reason));

        return back()->with('success', 'B2B verification rejected successfully.');
    }

    /**
     * Pending B2B verification (Admin only)
     */
    public function pending(Request $request, B2BVerification $verification)
    {
        // Check if user is admin
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        // Update verification status
        $verification->update([
            'status' => 'pending',
            'admin_notes' => $request->reason,
            'pending_at' => now(),
            'pending_by' => Auth::id(),
        ]);

        // Log audit trail
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'b2b_verification_pending',
            'target_type' => 'B2BVerification',
            'target_id' => $verification->id,
            'details' => [
                'verification_id' => $verification->id,
                'user_id' => $verification->user_id,
                'company_name' => $verification->company_name,
                'reason' => $request->reason,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', 'B2B verification status set to pending.');
    }

    /**
     * Update B2B verification application (for rejected users)
     */
    public function updateApplication(Request $request)
    {
        $user = Auth::user();

        if (!$user->isB2B()) {
            return redirect()->route('home');
        }

        $verification = $user->b2bVerification;

        if (!$verification || $verification->status !== 'rejected') {
            return redirect()->route('b2b.dashboard')
                ->with('error', 'No rejected application found to update.');
        }

        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string|max:500',
            'business_license_number' => 'required|string|max:255',
            'tax_id_number' => 'nullable|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:255',
            'license_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // Handle file upload
        $file = $request->file('license_file');
        $fileName = time() . '_' . $user->id . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('licenses', $fileName, 'public');

        // Update verification record
        $verification->update([
            'company_name' => $request->company_name,
            'company_address' => $request->company_address,
            'business_license_number' => $request->business_license_number,
            'tax_id_number' => $request->tax_id_number,
            'contact_person' => $request->contact_person,
            'contact_phone' => $request->contact_phone,
            'contact_email' => $request->contact_email,
            'license_file_path' => $filePath,
            'status' => 'pending',
            'admin_notes' => null, // Clear previous admin notes
            'rejected_at' => null,
            'rejected_by' => null,
            'pending_at' => now(),
            'pending_by' => null, // User initiated, not admin
        ]);

        // Log audit trail
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'b2b_verification_updated',
            'target_type' => 'B2BVerification',
            'target_id' => $verification->id,
            'details' => [
                'verification_id' => $verification->id,
                'user_id' => $verification->user_id,
                'company_name' => $request->company_name,
                'reason' => $request->reason,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('b2b.dashboard')
            ->with('success', 'Verification submitted successfully. We will review your application and contact you soon.');
    }

    /**
     * Show update application form for rejected users
     */
    public function showUpdateForm(): Response
    {
        $user = Auth::user();

        if (!$user->isB2B()) {
            return redirect()->route('home');
        }

        $verification = $user->b2bVerification;

        if (!$verification || $verification->status !== 'rejected') {
            return redirect()->route('b2b.dashboard')
                ->with('error', 'No rejected application found to update.');
        }

        return Inertia::render('B2B/UpdateApplication', [
            'verification' => $verification,
        ]);
    }
}
