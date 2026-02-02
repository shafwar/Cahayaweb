# B2B Flow, R2 Integration, dan Duplicate Email Handling - Full Implementation

**Commit:** `4a72c6f`  
**Tanggal:** 2 Februari 2026  
**Branch:** `main`

---

## Ringkasan Masalah

### Masalah 1: B2B Registration Redirect Issue
- User mengisi form B2B registration (termasuk upload dokumen)
- Setelah submit, user **tidak** redirect ke "Verification Pending"
- Malah redirect kembali ke halaman register
- Data tidak muncul di Admin Panel → Agent Verifications

### Masalah 2: R2 Storage Issue
- R2 menjadi "pain point" yang menyebabkan submit gagal
- Tidak ada fallback jika R2 gagal
- Dokumen tidak terorganisir per akun B2B
- Sulit mengidentifikasi "dokumen ini milik siapa"

### Masalah 3: Duplicate Email Handling
- User mencoba register dengan email yang sudah ada
- Sistem tidak memberikan feedback yang jelas
- Tidak ada logging untuk debug

---

## Root Cause Analysis

### 1. B2B Redirect Issue

**File:** `app/Http/Controllers/AgentVerificationController.php`

**Penyebab:**
1. **Global exception handler** di `bootstrap/app.php` menangkap semua exception untuk `POST /b2b/register` dan redirect ke register page dengan pesan generic.
2. **Bug `unset()`**: Setelah upload file berhasil, ada `unset($validated[$field])` yang **unconditionally** menghapus file path dari array sebelum disimpan ke database.
3. **Order of operations**: File upload dilakukan **sebelum** create DB record. Jika R2 gagal, seluruh submit gagal.

**Kode bermasalah (sebelum fix):**

```php
// Di dalam loop file upload
if ($file = $request->file($field) ?? ...) {
    // ... upload file ...
    $validated[$field] = $storedPath;
}
// BUG: unset dilakukan TANPA kondisi, menghapus path yang sudah di-set
unset($validated[$field]); // ← MASALAH: file path hilang sebelum save ke DB
```

### 2. R2 Storage Issue

**File:** `app/Support/R2Helper.php`

**Penyebab:**
- `isR2DiskConfigured()` tidak memeriksa `R2_ENDPOINT`
- Cloudflare R2 membutuhkan custom S3-compatible endpoint
- Tanpa endpoint, R2 dikira "configured" tapi gagal saat digunakan

**Kode bermasalah (sebelum fix):**

```php
public static function isR2DiskConfigured(): bool
{
    $config = config('filesystems.disks.r2');
    // MASALAH: tidak cek endpoint
    return !empty($config['key'])
        && !empty($config['secret'])
        && !empty($config['bucket'])
        && !empty($config['url']);
    // R2_ENDPOINT tidak dicek → R2 dikira ready padahal tidak
}
```

### 3. Duplicate Email Issue

**File:** `app/Http/Controllers/Auth/RegisteredUserController.php`

**Penyebab:**
- Validation exception untuk `unique` constraint sudah benar
- Tapi tidak ada logging untuk debug
- Jika DB-level unique constraint gagal (race condition), tidak ada handling khusus

---

## Implementasi Solusi

### Langkah 1: Fix B2B Registration Flow - "Create First, Upload Later"

**Prinsip:** Data profil B2B **selalu** disimpan ke database dulu, baru upload file. Ini memastikan:
- User selalu redirect ke "Verification Pending"
- Data selalu muncul di Admin Panel
- R2 gagal tidak menggagalkan seluruh submit

**Perubahan di `AgentVerificationController.php`:**

#### 1.1 Tambah constants dan helper untuk path per-akun

```php
// Constants untuk path R2
private const B2B_DOCUMENT_PATH_PREFIX = 'documents/agent-verifications';
private const B2B_DOCUMENT_PATH = 'documents/agent-verifications/'; // Deprecated

/**
 * Generate base path untuk dokumen B2B per user dan per verification
 * Path: documents/agent-verifications/{user_id}/{verification_id}/
 */
private function getB2BDocumentBasePath(int $userId, int $verificationId): string
{
    return self::B2B_DOCUMENT_PATH_PREFIX . '/' . $userId . '/' . $verificationId;
}
```

#### 1.2 Refactor `store()` method

**Sebelum:**
```php
// Upload files dulu
foreach ($fileFields as $field) {
    $file = $request->file($field);
    $storedPath = $file->storeAs(...);
    $validated[$field] = $storedPath;
    unset($validated[$field]); // BUG
}
// Create DB record
$verification = $user->agentVerification()->create($validated);
```

**Sesudah:**
```php
// 1. Pisahkan data scalar dari file fields
$fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
$validatedScalar = collect($validated)->except($fileFields)->all();
$validatedScalar['status'] = 'pending';
foreach ($fileFields as $field) {
    $validatedScalar[$field] = null; // Initialize dengan null
}

try {
    // 2. SIMPAN KE DATABASE DULU (tanpa file paths)
    $verification = $user->agentVerification()->updateOrCreate(
        ['user_id' => $user->id],
        $validatedScalar
    );
    
    Log::info('B2B verification saved to DB', [
        'user_id' => $user->id, 
        'verification_id' => $verification->id
    ]);

    // 3. Upload files SETELAH DB record ada (best-effort)
    $basePath = $this->getB2BDocumentBasePath((int) $user->id, (int) $verification->id);
    $uploadDiskName = $this->getAgentVerificationUploadDiskName();

    foreach ($fileFields as $field) {
        $file = $request->file($field) ?? /* dari session */;
        if ($file) {
            $storedPath = $this->storeFileWithFallback($file, $basePath, $uploadDiskName, $field);
            if ($storedPath) {
                $verification->update([$field => $storedPath]);
            }
        }
    }

    // 4. Cleanup session dan redirect ke Verification Pending
    $request->session()->forget(['b2b_registration_data', 'b2b_stored_files']);
    return redirect()->route('b2b.pending')->with('success', '...');

} catch (\Throwable $e) {
    Log::error('B2B store failed', [...]);
    return redirect()->route('b2b.register')
        ->withErrors(['message' => 'Unable to save...'])
        ->withInput($request->except([...file fields...]));
}
```

#### 1.3 Tambah helper methods untuk resilient file upload

```php
/**
 * Upload file dengan fallback: try R2 dulu, lalu public disk
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
        Log::warning('B2B file upload failed on primary disk, trying fallback', [
            'primary_disk' => $primaryDisk,
            'field' => $fieldName,
            'error' => $e->getMessage(),
        ]);
        
        // Fallback ke public disk
        if ($primaryDisk !== 'public') {
            try {
                $stored = $file->storeAs($basePath, $filename, 'public');
                if (is_string($stored)) {
                    Log::info('B2B document uploaded to public (fallback)', ['field' => $fieldName, 'path' => $stored]);
                    return $stored;
                }
            } catch (\Throwable $fallbackEx) {
                Log::error('B2B file upload fallback also failed', [...]);
            }
        }
        return null;
    }
}

/**
 * Put file content dengan fallback (untuk copy dari session/draft)
 */
private function putFileWithFallback(string $contents, string $path, string $primaryDisk, string $fieldName): ?string
{
    // Similar logic: try R2, fallback public
    // ... implementation ...
}
```

#### 1.4 Refactor `storeContinue()` dan `storeContinueFromDraft()`

Kedua method ini juga di-refactor mengikuti pola yang sama:
1. Create `AgentVerification` dengan data scalar + null file paths
2. Loop melalui stored files, upload ke path per-akun
3. Update verification record dengan file paths

### Langkah 2: Fix R2 Configuration Check

**File:** `app/Support/R2Helper.php`

```php
public static function isR2DiskConfigured(): bool
{
    $config = config('filesystems.disks.r2');
    if (!$config || ($config['driver'] ?? '') !== 's3') {
        return false;
    }
    
    // PENTING: Cloudflare R2 WAJIB punya endpoint
    return !empty($config['key'])
        && !empty($config['secret'])
        && !empty($config['bucket'])
        && !empty($config['url'])
        && !empty($config['endpoint']); // ← TAMBAHAN BARU
}
```

**Dampak:**
- R2 hanya dipakai jika SEMUA env variables ada, termasuk `R2_ENDPOINT`
- Jika `R2_ENDPOINT` tidak di-set, sistem otomatis pakai disk `public`
- Tidak ada lagi error karena R2 "setengah configured"

### Langkah 3: Fix Download Order (R2 First)

**File:** `AgentVerificationController.php` - method `downloadDocument()`

**Sebelum:**
```php
// Try public disk first
$publicDisk = Storage::disk('public');
if ($publicDisk->exists($filePath)) {
    return response()->streamDownload(...);
}

// Try R2 disk
if (R2Helper::isR2DiskConfigured()) {
    $r2Disk = Storage::disk('r2');
    if ($r2Disk->exists($filePath)) {
        return response()->streamDownload(...);
    }
}
```

**Sesudah:**
```php
// 1. Try R2 FIRST when configured (B2B docs stored in R2 when available)
if (R2Helper::isR2DiskConfigured()) {
    $r2Disk = Storage::disk('r2');
    foreach ($pathsToTry as $path) {
        if ($r2Disk->exists($path)) {
            Log::info('Admin download: serving from R2', ['path' => $path]);
            return response()->streamDownload(...);
        }
    }
}

// 2. Fallback: try public disk
$publicDisk = Storage::disk('public');
foreach ($pathsToTry as $path) {
    if ($publicDisk->exists($path)) {
        Log::info('Admin download: serving from public disk', ['path' => $path]);
        return response()->streamDownload(...);
    }
}
```

### Langkah 4: Fix Duplicate Email Handling

**File:** `app/Http/Controllers/Auth/RegisteredUserController.php`

```php
} catch (\Illuminate\Validation\ValidationException $e) {
    // Log validation failures, especially for duplicate email
    $errors = $e->errors();
    if (isset($errors['email'])) {
        Log::info('Registration validation failed (email)', [
            'email' => $request->input('email'),
            'mode' => $request->input('mode') ?: $request->query('mode'),
            'error' => $errors['email'][0] ?? 'unknown',
        ]);
    }
    // Re-throw so Inertia displays errors on form
    throw $e;
    
} catch (\Throwable $e) {
    // Check if error is DB duplicate (unique constraint at DB level)
    $isDuplicate = str_contains(strtolower($e->getMessage()), 'duplicate') ||
                   str_contains(strtolower($e->getMessage()), 'unique');
    
    Log::error('Registration failed', [
        'email' => $request->input('email'),
        'mode' => $request->input('mode') ?: $request->query('mode'),
        'message' => $e->getMessage(),
        'is_duplicate' => $isDuplicate,
    ]);
    
    // If DB-level duplicate, give clear message
    if ($isDuplicate) {
        return back()->withErrors([
            'email' => 'This email address is already registered. Please log in instead or use a different email address.',
        ])->withInput($request->only('name', 'email'));
    }
    
    return back()->withErrors([
        'email' => 'An error occurred during registration. Please try again or contact support.',
    ])->withInput($request->only('name', 'email'));
}
```

### Langkah 5: Update Frontend Error Display

**File:** `resources/js/pages/b2b/register-agent.tsx`

Memastikan global error message dari server ditampilkan:

```tsx
const pageProps = usePage().props as {
    auth: { user: { id: number; name: string; email: string } | null };
    errors?: Record<string, string>; // Errors dari server redirect
};

// Di dalam JSX:
{(pageProps.errors?.message || (errors as any)?.message) && (
    <motion.div className="... error alert styling ...">
        <p>{pageProps.errors?.message || (errors as any)?.message}</p>
        <p>Please check your data and try again. If the problem persists, contact support.</p>
    </motion.div>
)}
```

### Langkah 6: Update Documentation

**File:** `R2_B2B_DOCUMENTS_SETUP.md`

Dokumentasi lengkap tentang:
- Pemisahan data (DB) vs dokumen (R2)
- Struktur path R2 per akun
- Alur sistem dari upload sampai download
- Environment variables yang wajib

**File:** `RAILWAY_VARIABLES_CHECKLIST.md`

Tambah catatan bahwa `R2_ENDPOINT` **wajib** untuk R2 dianggap configured.

---

## Struktur Path R2 Final

```
public/documents/agent-verifications/
├── {user_id}/                          # Folder per user
│   ├── {verification_id}/              # Folder per aplikasi B2B
│   │   ├── {uuid}.pdf                  # business_license_file
│   │   ├── {uuid}.pdf                  # tax_certificate_file
│   │   └── {uuid}.pdf                  # company_profile_file
│   └── {another_verification_id}/      # Jika user submit ulang
│       └── ...
└── {another_user_id}/
    └── ...
```

**Keuntungan:**
- **Per user**: Semua dokumen dari satu user ada di satu folder
- **Per verification**: Satu aplikasi B2B = satu subfolder
- **Traceable**: Admin bisa lihat "dokumen milik siapa" dari path
- **Scalable**: Tidak ada collision antar user

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     B2B REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User fills B2B form (profil + 3 dokumen PDF)
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│  AgentVerificationController::store()                            │
│                                                                  │
│  1. Validate semua input                                         │
│  2. Pisahkan: data scalar vs file fields                         │
│  3. ┌─────────────────────────────────────────────────────────┐  │
│     │ DB TRANSACTION: Create AgentVerification               │  │
│     │ - Semua data profil (company_name, address, dll)       │  │
│     │ - file paths = NULL (belum diisi)                      │  │
│     │ - status = 'pending'                                    │  │
│     └─────────────────────────────────────────────────────────┘  │
│                         │                                        │
│                         ▼                                        │
│     Log: "B2B verification saved to DB"                          │
│                         │                                        │
│  4. ┌─────────────────────────────────────────────────────────┐  │
│     │ FILE UPLOAD (best-effort, tidak blocking)              │  │
│     │                                                         │  │
│     │ For each file (business_license, tax_cert, profile):   │  │
│     │   ├─ Try R2 disk (jika R2_ENDPOINT configured)         │  │
│     │   │   └─ Success → Log "uploaded to R2"                │  │
│     │   │   └─ Fail → Try public disk                        │  │
│     │   ├─ Try public disk (fallback)                        │  │
│     │   │   └─ Success → Log "uploaded to public"            │  │
│     │   │   └─ Fail → path tetap NULL                        │  │
│     │   └─ Update verification record dengan path            │  │
│     └─────────────────────────────────────────────────────────┘  │
│                         │                                        │
│  5. Clear session (b2b_registration_data, b2b_stored_files)      │
│  6. Redirect ke route('b2b.pending')                             │
└─────────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│  "Verification Pending" Page                                     │
│  - User melihat status aplikasi                                  │
│  - Menunggu admin approval                                       │
└─────────────────────────────────────────────────────────────────┘

                ║
        MEANWHILE...
                ║
                ▼

┌─────────────────────────────────────────────────────────────────┐
│  Admin Panel → Agent Verifications                               │
│                                                                  │
│  - Lihat list semua aplikasi B2B dari database                   │
│  - Klik "Download Document"                                      │
│    │                                                             │
│    ▼                                                             │
│  AgentVerificationController::downloadDocument()                 │
│    ├─ Try R2 disk first (jika configured)                        │
│    │   └─ File ada? Stream download dari R2                      │
│    ├─ Fallback: Try public disk                                  │
│    │   └─ File ada? Stream download dari public                  │
│    └─ 404 jika file tidak ditemukan di kedua disk                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables (Railway)

### Wajib untuk R2 digunakan:

```env
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET=cahayaweb
R2_URL=https://pub-xxx.r2.dev
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com  # ← WAJIB
R2_REGION=auto
```

**Catatan:**
- Jika `R2_ENDPOINT` tidak di-set, sistem otomatis pakai disk `public`
- Tidak perlu set `FILESYSTEM_DISK=r2`; B2B upload otomatis pilih R2 jika configured

---

## Testing Checklist

### 1. B2B Registration (New User)
- [ ] Isi form B2B lengkap dengan 3 dokumen PDF
- [ ] Submit form
- [ ] **Expected:** Redirect ke "Verification Pending"
- [ ] **Check DB:** `agent_verifications` ada record baru dengan file paths
- [ ] **Check Logs:** "B2B verification saved to DB", "B2B document uploaded to R2"

### 2. B2B Registration (Existing User - Already Has Verification)
- [ ] Login dengan akun yang sudah punya verification
- [ ] Coba akses `/b2b/register`
- [ ] **Expected:** Redirect ke "Verification Pending" (tidak bisa submit lagi)

### 3. Duplicate Email Registration
- [ ] Coba register dengan email yang sudah ada
- [ ] **Expected:** Form menampilkan error "This email address is already registered..."
- [ ] **Expected:** Banner amber dengan link "log in here"
- [ ] **Check Logs:** "Registration validation failed (email)"

### 4. Admin Download Document
- [ ] Login sebagai admin
- [ ] Buka Agent Verifications
- [ ] Klik "Download Document" pada salah satu aplikasi
- [ ] **Expected:** File ter-download
- [ ] **Check Logs:** "Admin download: serving from R2" atau "serving from public disk"

### 5. R2 Fallback (Simulasi R2 Down)
- [ ] Temporarily remove `R2_ENDPOINT` dari env
- [ ] Submit B2B registration baru
- [ ] **Expected:** Submit tetap sukses, file di disk `public`
- [ ] **Check Logs:** "trying fallback", "uploaded to public (fallback)"

---

## Files Changed

| File | Perubahan |
|------|-----------|
| `app/Http/Controllers/AgentVerificationController.php` | Refactor store/storeContinue/storeContinueFromDraft dengan pola "create first, upload later"; tambah helper methods; fix download order |
| `app/Http/Controllers/Auth/RegisteredUserController.php` | Tambah logging untuk duplicate email; handle DB-level unique constraint |
| `app/Support/R2Helper.php` | `isR2DiskConfigured()` sekarang require `R2_ENDPOINT` |
| `resources/js/pages/b2b/register-agent.tsx` | Display global error messages dari server redirect |
| `bootstrap/app.php` | Perbaiki error message dan input preservation untuk POST b2b/register |
| `R2_B2B_DOCUMENTS_SETUP.md` | Dokumentasi lengkap data vs dokumen, path per-akun |
| `RAILWAY_VARIABLES_CHECKLIST.md` | Tambah catatan R2_ENDPOINT wajib |

---

## Kesimpulan

Implementasi ini memastikan:

1. **Reliability:** Data B2B selalu tersimpan ke database, tidak bergantung pada R2 success
2. **Traceability:** Dokumen di R2 terorganisir per user/verification, mudah diidentifikasi
3. **Resilience:** R2 gagal → fallback public; submit tidak pernah gagal karena storage
4. **User Experience:** Error messages jelas; redirect selalu ke halaman yang benar
5. **Admin Experience:** Download document works dari R2 atau public; data selalu muncul di panel

**Commit:** `4a72c6f`
