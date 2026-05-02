<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class StoreB2cPackageRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mode = (string) $this->input('account_mode', 'create');

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
            'account_mode' => ['required', Rule::in(['create', 'login'])],
            'account_password' => [
                Rule::requiredIf($mode === 'create' || $mode === 'login'),
                'string',
                $mode === 'create' ? Password::defaults() : 'min:8',
            ],
            'account_password_confirmation' => [Rule::requiredIf($mode === 'create'), 'same:account_password'],
        ];
    }

    public function messages(): array
    {
        return [
            'account_password.required' => 'Password akun wajib diisi.',
            'account_password_confirmation.required' => 'Konfirmasi password wajib diisi untuk akun baru.',
            'account_password_confirmation.same' => 'Konfirmasi password harus sama dengan password.',
        ];
    }
}
