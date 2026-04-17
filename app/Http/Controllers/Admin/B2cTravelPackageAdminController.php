<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\B2cTravelPackage;
use App\Support\ImageCompressor;
use App\Support\R2Helper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class B2cTravelPackageAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $packages = B2cTravelPackage::query()
            ->withCount('registrations')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(function (B2cTravelPackage $p) {
                return [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'package_code' => $p->package_code,
                    'name' => $p->name,
                    'departure_period' => $p->departure_period,
                    'price_display' => $p->price_display,
                    'pax_capacity' => $p->pax_capacity,
                    'pax_booked' => $p->pax_booked,
                    'registration_deadline' => $p->registration_deadline->toIso8601String(),
                    'status' => $p->status,
                    'registration_open' => $p->isOpenForRegistration(),
                    'registrations_count' => $p->registrations_count,
                    'sort_order' => $p->sort_order,
                    'updated_at' => $p->updated_at?->toIso8601String(),
                ];
            });

        return Inertia::render('admin/b2c-packages/index', [
            'packages' => $packages,
            'flash' => $request->session()->pull('flash'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/b2c-packages/create');
    }

    /**
     * Upload a package hero/card image to R2 (or public disk), with server-side compression.
     * Does not touch CMS sections — only returns path + URL for the B2C package form.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        try {
            if (! $request->hasFile('image')) {
                return response()->json([
                    'message' => 'File tidak diterima. Pastikan format JPEG/PNG/WebP dan ukuran sesuai panduan.',
                    'errors' => ['image' => ['The image file could not be received.']],
                ], 422);
            }

            $poster = config('cms_media_guide.b2c_package_poster', []);
            $maxMb = (int) ($poster['max_file_size_mb'] ?? 12);
            $maxW = (int) ($poster['max_dimension_width'] ?? 1600);
            $maxH = (int) ($poster['max_dimension_height'] ?? 3200);
            $validated = $request->validate([
                'image' => ['required', 'file', 'mimes:jpeg,png,jpg,webp', 'max:'.($maxMb * 1024)],
            ]);

            $file = $validated['image'];
            $compressedPath = ImageCompressor::compress($file, $maxW, $maxH);
            $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                $ext = 'jpg';
            }
            $filename = Str::uuid()->toString().'.'.$ext;
            $storedPath = 'images/b2c-packages/'.$filename;

            $contents = $file->get();
            if ($compressedPath && is_readable($compressedPath)) {
                try {
                    $contents = file_get_contents($compressedPath);
                } catch (\Throwable) {
                    // keep original
                } finally {
                    @unlink($compressedPath);
                }
            }

            $disk = R2Helper::diskForCms();
            $diskName = R2Helper::isR2DiskConfigured() ? 'r2' : 'public';

            try {
                $putOk = $disk->put($storedPath, $contents);
            } catch (\Throwable $putEx) {
                Log::error('B2cTravelPackageAdminController::uploadImage put failed', [
                    'error' => $putEx->getMessage(),
                    'disk' => $diskName,
                ]);

                return response()->json([
                    'message' => 'Penyimpanan gagal: '.$putEx->getMessage(),
                    'errors' => ['image' => ['Storage failed']],
                ], 500);
            }

            if (! $putOk) {
                return response()->json([
                    'message' => 'Gagal menyimpan file ke storage.',
                    'errors' => ['image' => ['disk->put() returned false']],
                ], 500);
            }

            $url = R2Helper::url($storedPath) ?? $disk->url($storedPath);

            return response()->json([
                'status' => 'ok',
                'success' => true,
                'path' => $storedPath,
                'url' => $url,
                'message' => 'Image uploaded',
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('B2cTravelPackageAdminController::uploadImage failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upload gagal: '.$e->getMessage(),
                'errors' => ['server' => [$e->getMessage()]],
            ], 500);
        }
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePackage($request);

        $slug = B2cTravelPackage::generateUniqueSlug($validated['name'], $validated['package_code']);

        B2cTravelPackage::query()->create([
            'slug' => $slug,
            'package_code' => $validated['package_code'],
            'name' => $validated['name'],
            'departure_period' => $validated['departure_period'],
            'description' => $validated['description'],
            'location' => $validated['location'] ?? null,
            'duration_label' => $validated['duration_label'] ?? null,
            'package_type' => $validated['package_type'] ?? 'Religious',
            'price_display' => $validated['price_display'],
            'pax_capacity' => (int) $validated['pax_capacity'],
            'pax_booked' => (int) ($validated['pax_booked'] ?? 0),
            'registration_deadline' => $validated['registration_deadline'],
            'terms_and_conditions' => $validated['terms_and_conditions'],
            'status' => $validated['status'],
            'image_path' => $this->normalizedImagePath($validated['image_path'] ?? null),
            'highlights_json' => $this->parseLines($request->input('highlights_text')),
            'features_json' => $this->parseLines($request->input('features_text')),
            'dates_json' => $this->parseDates($request->input('dates_text')),
            'hotels_json' => $this->parseHotels($request->input('hotels_text')),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->route('admin.b2c-packages.index')
            ->with('flash', ['type' => 'success', 'message' => 'Package created.']);
    }

    public function edit(B2cTravelPackage $b2cTravelPackage): Response
    {
        $p = $b2cTravelPackage;

        return Inertia::render('admin/b2c-packages/edit', [
            'package' => [
                'id' => $p->id,
                'slug' => $p->slug,
                'package_code' => $p->package_code,
                'name' => $p->name,
                'departure_period' => $p->departure_period,
                'description' => $p->description,
                'location' => $p->location,
                'duration_label' => $p->duration_label,
                'package_type' => $p->package_type,
                'price_display' => $p->price_display,
                'pax_capacity' => $p->pax_capacity,
                'pax_booked' => $p->pax_booked,
                'registration_deadline' => $p->registration_deadline->format('Y-m-d\TH:i'),
                'terms_and_conditions' => $p->terms_and_conditions,
                'status' => $p->status,
                'image_path' => $p->image_path,
                'highlights_text' => implode("\n", $p->highlights_json ?? []),
                'features_text' => implode("\n", $p->features_json ?? []),
                'dates_text' => $this->datesToText($p->dates_json ?? []),
                'hotels_text' => $this->hotelsToText($p->hotels_json ?? []),
                'sort_order' => $p->sort_order,
            ],
        ]);
    }

    public function update(Request $request, B2cTravelPackage $b2cTravelPackage): RedirectResponse
    {
        $validated = $this->validatePackage($request, $b2cTravelPackage->id);

        if ((int) $validated['pax_capacity'] < (int) $b2cTravelPackage->pax_booked) {
            return back()->withErrors([
                'pax_capacity' => 'Capacity cannot be less than current bookings ('.$b2cTravelPackage->pax_booked.' pax).',
            ])->withInput();
        }

        $bookedInput = (int) ($validated['pax_booked'] ?? $b2cTravelPackage->pax_booked);
        if ($bookedInput > (int) $validated['pax_capacity']) {
            return back()->withErrors([
                'pax_booked' => 'Booked pax cannot exceed capacity.',
            ])->withInput();
        }

        $slug = $b2cTravelPackage->slug;
        if ($validated['name'] !== $b2cTravelPackage->name || $validated['package_code'] !== $b2cTravelPackage->package_code) {
            $slug = B2cTravelPackage::generateUniqueSlug($validated['name'], $validated['package_code']);
        }

        $b2cTravelPackage->update([
            'slug' => $slug,
            'package_code' => $validated['package_code'],
            'name' => $validated['name'],
            'departure_period' => $validated['departure_period'],
            'description' => $validated['description'],
            'location' => $validated['location'] ?? null,
            'duration_label' => $validated['duration_label'] ?? null,
            'package_type' => $validated['package_type'] ?? 'Religious',
            'price_display' => $validated['price_display'],
            'pax_capacity' => (int) $validated['pax_capacity'],
            'pax_booked' => min($bookedInput, (int) $validated['pax_capacity']),
            'registration_deadline' => $validated['registration_deadline'],
            'terms_and_conditions' => $validated['terms_and_conditions'],
            'status' => $validated['status'],
            'image_path' => $this->normalizedImagePath($validated['image_path'] ?? null),
            'highlights_json' => $this->parseLines($request->input('highlights_text')),
            'features_json' => $this->parseLines($request->input('features_text')),
            'dates_json' => $this->parseDates($request->input('dates_text')),
            'hotels_json' => $this->parseHotels($request->input('hotels_text')),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->route('admin.b2c-packages.index')
            ->with('flash', ['type' => 'success', 'message' => 'Package updated.']);
    }

    public function destroy(B2cTravelPackage $b2cTravelPackage): RedirectResponse
    {
        if ($b2cTravelPackage->registrations()->exists()) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Cannot delete a package that has registrations. Remove or archive registrations first.',
            ]);
        }

        $b2cTravelPackage->delete();

        return redirect()->route('admin.b2c-packages.index')
            ->with('flash', ['type' => 'success', 'message' => 'Package deleted.']);
    }

    public function registrations(B2cTravelPackage $b2cTravelPackage): Response
    {
        $regs = $b2cTravelPackage->registrations()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'full_name' => $r->full_name,
                'email' => $r->email,
                'phone' => $r->phone,
                'passport_number' => $r->passport_number,
                'address' => $r->address,
                'date_of_birth' => $r->date_of_birth?->format('Y-m-d'),
                'gender' => $r->gender,
                'departure_period_snapshot' => $r->departure_period_snapshot,
                'pax' => $r->pax,
                'terms_accepted_at' => $r->terms_accepted_at?->toIso8601String(),
                'created_at' => $r->created_at?->toIso8601String(),
                'user_id' => $r->user_id,
            ]);

        return Inertia::render('admin/b2c-packages/registrations', [
            'package' => [
                'id' => $b2cTravelPackage->id,
                'name' => $b2cTravelPackage->name,
                'slug' => $b2cTravelPackage->slug,
                'package_code' => $b2cTravelPackage->package_code,
                'pax_capacity' => $b2cTravelPackage->pax_capacity,
                'pax_booked' => $b2cTravelPackage->pax_booked,
                'registration_open' => $b2cTravelPackage->isOpenForRegistration(),
            ],
            'registrations' => $regs,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePackage(Request $request, ?int $ignoreId = null): array
    {
        $uniqueCode = Rule::unique('b2c_travel_packages', 'package_code');
        if ($ignoreId) {
            $uniqueCode = $uniqueCode->ignore($ignoreId);
        }

        $validated = $request->validate([
            'package_code' => ['required', 'string', 'max:64', $uniqueCode],
            'name' => ['required', 'string', 'max:255'],
            'departure_period' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'duration_label' => ['nullable', 'string', 'max:100'],
            'package_type' => ['nullable', 'string', 'max:100'],
            'price_display' => ['required', 'string', 'max:100'],
            'pax_capacity' => ['required', 'integer', 'min:1', 'max:9999'],
            'pax_booked' => ['nullable', 'integer', 'min:0', 'lte:pax_capacity'],
            'registration_deadline' => ['required', 'date'],
            'terms_and_conditions' => ['required', 'string'],
            'status' => ['required', Rule::in(['open', 'closed'])],
            'image_path' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:99999'],
        ]);

        $img = $validated['image_path'] ?? null;
        if ($img !== null && $img !== '' && ! $this->isSafePackageImagePath($img)) {
            throw ValidationException::withMessages([
                'image_path' => ['Use a full https image URL, a path under images/, or upload via Media.'],
            ]);
        }

        return $validated;
    }

    /**
     * Allow https URLs or relative paths under images/ (R2 object keys), reject traversal and odd schemes.
     */
    private function isSafePackageImagePath(string $value): bool
    {
        if (str_contains($value, '..') || str_contains($value, "\0")) {
            return false;
        }
        if (preg_match('#^https?://#i', $value)) {
            return (bool) filter_var($value, FILTER_VALIDATE_URL);
        }

        return (bool) preg_match('#^\/?images/[a-zA-Z0-9._\-/]+$#', $value);
    }

    private function normalizedImagePath(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $t = trim($value);
        if ($t === '') {
            return null;
        }
        // R2 object keys are stored without a leading slash (same as CMS uploads).
        if (str_starts_with($t, '/images/')) {
            $t = ltrim($t, '/');
        }

        return $t;
    }

    /**
     * @return list<string>
     */
    private function parseLines(?string $text): array
    {
        if ($text === null || trim($text) === '') {
            return [];
        }

        return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $text) ?: [])));
    }

    /**
     * @return list<array{date: string, status: string}>
     */
    private function parseDates(?string $text): array
    {
        $lines = $this->parseLines($text);
        $out = [];
        foreach ($lines as $line) {
            $parts = array_map('trim', explode('|', $line, 2));
            $date = $parts[0] ?? '';
            $status = $parts[1] ?? 'Available';
            if ($date !== '') {
                $out[] = ['date' => $date, 'status' => $status];
            }
        }

        return $out;
    }

    /**
     * @return list<array{name: string, location: string, stars: int}>
     */
    private function parseHotels(?string $text): array
    {
        $lines = $this->parseLines($text);
        $out = [];
        foreach ($lines as $line) {
            $parts = array_map('trim', explode('|', $line));
            $name = $parts[0] ?? '';
            if ($name === '') {
                continue;
            }
            $location = $parts[1] ?? '';
            $stars = isset($parts[2]) ? (int) $parts[2] : 4;
            $out[] = ['name' => $name, 'location' => $location, 'stars' => max(1, min(5, $stars))];
        }

        return $out;
    }

    /**
     * @param  list<array{date: string, status: string}>  $dates
     */
    private function datesToText(array $dates): string
    {
        $lines = [];
        foreach ($dates as $d) {
            if (! is_array($d)) {
                continue;
            }
            $date = $d['date'] ?? '';
            if ($date === '') {
                continue;
            }
            $lines[] = $date.'|'.($d['status'] ?? 'Available');
        }

        return implode("\n", $lines);
    }

    /**
     * @param  list<array{name: string, location?: string, stars?: int}>  $hotels
     */
    private function hotelsToText(array $hotels): string
    {
        $lines = [];
        foreach ($hotels as $h) {
            if (! is_array($h)) {
                continue;
            }
            $name = $h['name'] ?? '';
            if ($name === '') {
                continue;
            }
            $loc = $h['location'] ?? '';
            $stars = (int) ($h['stars'] ?? 4);
            $lines[] = $name.'|'.$loc.'|'.$stars;
        }

        return implode("\n", $lines);
    }
}
