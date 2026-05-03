<?php

namespace App\Http\Controllers;

use App\Models\B2cTravelPackage;
use App\Services\InboundLeadNotifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Cacheable B2C marketing / public Inertia pages (no route closures).
 */
class B2cPageController extends Controller
{
    /** Splash then client redirect to B2C home; no standalone “choose mode” page. */
    public function root(): Response
    {
        return Inertia::render('landing/select-mode', ['autoRedirectToB2c' => true]);
    }

    public function home(): Response
    {
        return Inertia::render('b2c/home');
    }

    public function about(): Response
    {
        return Inertia::render('b2c/about');
    }

    public function destinations(): Response
    {
        return Inertia::render('b2c/destinations');
    }

    public function packageShow(string $slug): Response
    {
        return Inertia::render('b2c/packages/show', ['slug' => $slug]);
    }

    public function highlights(): Response
    {
        return Inertia::render('b2c/highlights');
    }

    public function blogIndex(): Response
    {
        return Inertia::render('b2c/blog/index');
    }

    public function blogShow(string $id): Response
    {
        return Inertia::render('b2c/blog/[id]', ['id' => $id]);
    }

    public function contact(Request $request): Response
    {
        return Inertia::render('b2c/contact', [
            'flash' => $request->session()->pull('contact_flash'),
        ]);
    }

    public function contactSubmit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'message' => ['required', 'string', 'max:5000'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'phone.required' => 'Telepon wajib diisi.',
            'message.required' => 'Pesan wajib diisi.',
        ]);

        if (InboundLeadNotifier::adminRecipientEmails() === []) {
            return redirect()->route('b2c.contact')->withInput()->with('contact_flash', [
                'type' => 'error',
                'message' => 'Pesan belum dapat dikirim ke tim email: pengaturan ADMIN_NOTIFY_EMAILS / APP_ADMIN_EMAILS di server masih kosong. Silakan hubungi kami via WhatsApp atau coba lagi setelah administrator mengatur inbox.',
            ]);
        }

        InboundLeadNotifier::notifyAdminsContact(
            $validated['name'],
            $validated['email'],
            $validated['phone'],
            $validated['message'],
        );

        return redirect()->route('b2c.contact')->with('contact_flash', [
            'type' => 'success',
            'message' => 'Terima kasih. Pesan Anda telah terkirim ke tim kami. Kami akan menghubungi Anda segera.',
        ]);
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('b2c/privacy-policy');
    }

    public function termsOfService(): Response
    {
        return Inertia::render('b2c/terms-of-service');
    }

    public function search(): Response
    {
        return Inertia::render('b2c/search', [
            'travelPackages' => B2cTravelPackage::publicCatalogCards(),
        ]);
    }
}
