<?php

namespace App\Http\Controllers;

use App\Models\B2cTravelPackage;
use App\Services\B2cPackageRegistrationRegistrar;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * JSON entry point for B2C package registration (same rules as web form).
 * From browsers, send header Accept: application/json and X-XSRF-TOKEN (cookie + header) with CSRF.
 */
class B2cRegistrationApiController extends Controller
{
    public function store(Request $request, B2cPackageRegistrationRegistrar $registrar): JsonResponse
    {
        $validated = $request->validate([
            'package_code' => ['required', 'string', 'max:64', Rule::exists('b2c_travel_packages', 'package_code')],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:64'],
            'passport_number' => ['required', 'string', 'max:64'],
            'address' => ['required', 'string', 'max:2000'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'pax' => ['required', 'integer', 'min:1', 'max:50'],
            'terms_accepted' => ['accepted'],
        ]);

        $package = B2cTravelPackage::query()->where('package_code', $validated['package_code'])->firstOrFail();
        unset($validated['package_code']);

        try {
            $registrar->register($package, $validated);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Registration could not be completed.',
                'errors' => $e->errors(),
            ], 422);
        }

        return response()->json([
            'message' => 'Registration submitted successfully.',
        ], 201);
    }
}
