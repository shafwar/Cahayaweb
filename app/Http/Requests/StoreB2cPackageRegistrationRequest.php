<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreB2cPackageRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:64'],
            'passport_number' => ['required', 'string', 'max:64'],
            'address' => ['required', 'string', 'max:2000'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'pax' => ['required', 'integer', 'min:1', 'max:50'],
            'terms_accepted' => ['accepted'],
        ];
    }
}
