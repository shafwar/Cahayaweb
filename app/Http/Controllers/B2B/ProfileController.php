<?php

namespace App\Http\Controllers\B2B;

use App\Http\Controllers\Controller;
use App\Models\B2BVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $user->load('b2bVerification');

        return Inertia::render('b2b/profile', [
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return back()->with('success', 'Profile updated successfully!');
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password updated successfully!');
    }

    public function updateCompany(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_email' => 'required|string|email|max:255',
            'contact_phone' => 'required|string|max:20',
            'business_license' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        // Update or create B2B verification record
        $b2bVerification = $user->b2bVerification;

        if ($b2bVerification) {
            $b2bVerification->update([
                'company_name' => $request->company_name,
                'contact_person' => $request->contact_person,
                'contact_email' => $request->contact_email,
                'contact_phone' => $request->contact_phone,
                'business_license' => $request->business_license,
                'tax_id' => $request->tax_id,
                'address' => $request->address,
            ]);
        } else {
            B2BVerification::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'contact_person' => $request->contact_person,
                'contact_email' => $request->contact_email,
                'contact_phone' => $request->contact_phone,
                'business_license' => $request->business_license,
                'tax_id' => $request->tax_id,
                'address' => $request->address,
                'status' => 'pending',
            ]);
        }

        return back()->with('success', 'Company information updated successfully!');
    }
}
