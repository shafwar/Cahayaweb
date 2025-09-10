<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister(): Response
    {
        $userTypes = UserType::whereIn('name', ['b2b', 'b2c'])->get();

        return Inertia::render('Auth/Register', [
            'userTypes' => $userTypes,
        ]);
    }

    public function showB2BLogin(): Response
    {
        return Inertia::render('b2b/login');
    }

    public function showB2BRegister(): Response
    {
        return Inertia::render('b2b/register');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();
            $user->updateLastLogin();

            $request->session()->regenerate();

            // Redirect based on user type
            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'));
            } elseif ($user->isB2B()) {
                return redirect()->intended(route('b2b.dashboard'));
            } else {
                return redirect()->intended(route('user.dashboard'));
            }
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'user_type' => 'required|in:b2b,b2c',
            // B2B specific validation
            'company_name' => 'required_if:user_type,b2b|string|max:255',
            'company_address' => 'nullable|string',
            'business_license_number' => 'required_if:user_type,b2b|string|max:255',
            'tax_id_number' => 'nullable|string|max:255',
            'contact_person' => 'required_if:user_type,b2b|string|max:255',
            'contact_phone' => 'required_if:user_type,b2b|string|max:255',
            'contact_email' => 'required_if:user_type,b2b|email|max:255',
            'license_file' => 'required_if:user_type,b2b|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        $userType = UserType::where('name', $request->user_type)->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type_id' => $userType->id,
            'is_verified' => $request->user_type === 'b2c', // B2C users are auto-verified
        ]);

        // Handle B2B verification data
        if ($request->user_type === 'b2b') {
            $licenseFilePath = null;
            if ($request->hasFile('license_file')) {
                $licenseFilePath = $request->file('license_file')->store('licenses', 'public');
            }

            $user->b2bVerification()->create([
                'company_name' => $request->company_name,
                'company_address' => $request->company_address,
                'business_license_number' => $request->business_license_number,
                'tax_id_number' => $request->tax_id_number,
                'contact_person' => $request->contact_person,
                'contact_phone' => $request->contact_phone,
                'contact_email' => $request->contact_email,
                'license_file_path' => $licenseFilePath,
                'status' => 'pending',
                'admin_notes' => 'New B2B registration - pending review',
            ]);
        }

        Auth::login($user);

        // Redirect based on user type
        if ($user->isB2B()) {
            return redirect()->route('b2b.dashboard')
                ->with('success', 'B2B account created successfully! Your account is pending verification. You will receive an email once approved.');
        } else {
            return redirect()->route('b2c.home')
                ->with('success', 'Account created successfully!');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
