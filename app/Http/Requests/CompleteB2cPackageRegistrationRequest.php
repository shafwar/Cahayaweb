<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class CompleteB2cPackageRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mode = (string) $this->input('account_mode', 'create');

        $rules = [
            'account_mode' => ['required', Rule::in(['create', 'login'])],
            'account_password' => [
                'required',
                'string',
                $mode === 'create' ? Password::defaults() : 'min:8',
            ],
        ];

        if ($mode === 'create') {
            $rules['account_password_confirmation'] = ['required', 'same:account_password'];
        }

        return $rules;
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
