<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Customer/Profile', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'role' => $user->role,
                'avatar' => $user->avatar_url,
                'has_google' => ! empty($user->google_id),
                'created_at' => $user->created_at ? $user->created_at->translatedFormat('d F Y') : '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'remove_avatar' => ['nullable', 'boolean'],
            'current_password' => ['nullable', 'required_with:password', 'current_password'],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.unique' => 'Email sudah digunakan oleh akun lain.',
            'current_password.current_password' => 'Kata sandi saat ini tidak cocok.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak sesuai.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
            'avatar.image' => 'File yang dipilih harus berupa gambar (JPG, PNG, WEBP).',
            'avatar.mimes' => 'Format file foto harus berupa JPG, JPEG, PNG, atau WEBP.',
            'avatar.max' => 'Ukuran foto terlalu besar! Maksimal ukuran file adalah 2MB.',
        ]);

        $userData = [];

        if ($request->has('name')) {
            $userData['name'] = $validated['name'];
        }

        if ($request->has('email')) {
            $userData['email'] = $validated['email'];
        }

        if ($request->has('phone')) {
            $userData['phone'] = $validated['phone'] ?? null;
        }

        $message = 'Profil berhasil disimpan!';

        if ($request->boolean('remove_avatar')) {
            if ($user->avatar && ! str_starts_with($user->avatar, 'http')) {
                Storage::disk('public')->delete($user->avatar);
            }
            $userData['avatar'] = null;
            $message = 'Foto profil berhasil dihapus.';
        } elseif ($request->hasFile('avatar')) {
            if ($user->avatar && ! str_starts_with($user->avatar, 'http')) {
                Storage::disk('public')->delete($user->avatar);
            }
            $userData['avatar'] = $request->file('avatar')->store('avatars', 'public');
            $message = 'Foto profil berhasil diperbarui!';
        } elseif (! empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
            $message = 'Kata sandi berhasil diperbarui!';
        }

        if (! empty($userData)) {
            $user->update($userData);
        }

        return back()->with('success', $message);
    }
}
