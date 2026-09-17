<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function showLogin(): RedirectResponse
    {
        if (Auth::check()) {
            if (Auth::user()->isAdmin()) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('home');
        }

        return redirect()->route('home', ['login' => '1']);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $identifier = $credentials['identifier'];

        // Find user by email or phone
        $user = User::where('email', $identifier)
            ->orWhere('phone', $identifier)
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'identifier' => 'Email/No. WhatsApp atau kata sandi tidak cocok.',
            ])->withInput();
        }

        Auth::login($user, $request->boolean('remember', true));
        $request->session()->regenerate();

        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(url()->previous() ?: route('home'));
    }

    public function demoLogin(Request $request, string $role): RedirectResponse
    {
        if (app()->isProduction()) {
            abort(404);
        }

        $email = $role === 'admin' ? 'admin@buahsegar.id' : 'pelanggan@buahsegar.id';
        $user = User::where('email', $email)->first();

        if (! $user) {
            $user = User::create([
                'name' => $role === 'admin' ? 'Admin Zahwa' : 'Pelanggan Zahwa',
                'email' => $email,
                'role' => $role === 'admin' ? 'admin' : 'customer',
                'password' => Hash::make('password'),
            ]);
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->intended(url()->previous() ?: route('home'));
    }

    public function googleRedirect(): RedirectResponse
    {
        if (Setting::get('google_auth_is_active', '1') !== '1') {
            return redirect()->route('home')->withErrors([
                'identifier' => 'Fitur login menggunakan Google sedang dinonaktifkan oleh administrator.',
            ]);
        }

        $clientId = Setting::get('google_client_id') ?: config('services.google.client_id');
        $clientSecret = Setting::get('google_client_secret') ?: config('services.google.client_secret');
        $redirect = Setting::get('google_redirect_uri') ?: config('services.google.redirect');

        if ($clientId && $clientSecret) {
            config([
                'services.google.client_id' => $clientId,
                'services.google.client_secret' => $clientSecret,
                'services.google.redirect' => $redirect,
            ]);
        }

        if (empty(config('services.google.client_id')) || empty(config('services.google.client_secret'))) {
            return redirect()->route('home')->withErrors([
                'identifier' => 'Kredensial Google OAuth belum dikonfigurasi oleh administrator di menu Pengaturan.',
            ]);
        }

        /** @phpstan-ignore-next-line */
        return Socialite::driver('google')->redirect();
    }

    public function googleCallback(): RedirectResponse
    {
        if (Setting::get('google_auth_is_active', '1') !== '1') {
            return redirect()->route('home')->withErrors([
                'identifier' => 'Fitur login menggunakan Google sedang dinonaktifkan oleh administrator.',
            ]);
        }

        $clientId = Setting::get('google_client_id') ?: config('services.google.client_id');
        $clientSecret = Setting::get('google_client_secret') ?: config('services.google.client_secret');
        $redirect = Setting::get('google_redirect_uri') ?: config('services.google.redirect');

        if ($clientId && $clientSecret) {
            config([
                'services.google.client_id' => $clientId,
                'services.google.client_secret' => $clientSecret,
                'services.google.redirect' => $redirect,
            ]);
        }

        try {
            /** @phpstan-ignore-next-line */
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                $user = User::create([
                    'name' => $googleUser->getName() ?? 'Pengguna Google',
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => 'customer',
                    'password' => Hash::make(Str::random(24)),
                ]);
            }

            Auth::login($user, true);
            request()->session()->regenerate();

            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('home');
        } catch (\Throwable $e) {
            return redirect()->route('home')->withErrors([
                'identifier' => 'Gagal masuk dengan Google: '.$e->getMessage(),
            ]);
        }
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Anda telah berhasil keluar.');
    }
}
