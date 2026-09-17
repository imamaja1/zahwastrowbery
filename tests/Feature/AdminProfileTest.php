<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::create([
        'name' => 'Admin Zahwa',
        'email' => 'admin@buahsegar.id',
        'password' => Hash::make('password123'),
        'role' => 'admin',
        'phone' => '081234567890',
    ]);

    $this->customer = User::create([
        'name' => 'Pelanggan Zahwa',
        'email' => 'customer@test.com',
        'password' => Hash::make('password123'),
        'role' => 'customer',
        'phone' => '08987654321',
    ]);
});

test('guest cannot access admin profile page', function () {
    $response = $this->get(route('admin.profile.index'));
    $response->assertRedirect(route('login'));
});

test('customer cannot access admin profile page', function () {
    $response = $this->actingAs($this->customer)->get(route('admin.profile.index'));
    $response->assertRedirect(route('login'));
});

test('admin can view admin profile page', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.profile.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Profile')
        ->has('profile', fn ($page) => $page
            ->where('name', 'Admin Zahwa')
            ->where('email', 'admin@buahsegar.id')
            ->where('phone', '081234567890')
            ->where('role', 'admin')
            ->etc()
        )
    );
});

test('admin can update admin profile info', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.profile.update'), [
        'name' => 'Super Admin Zahwa',
        'email' => 'superadmin@buahsegar.id',
        'phone' => '081299998888',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->admin->refresh();
    $this->assertEquals('Super Admin Zahwa', $this->admin->name);
    $this->assertEquals('superadmin@buahsegar.id', $this->admin->email);
    $this->assertEquals('081299998888', $this->admin->phone);
});

test('admin can upload avatar image', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('admin-avatar.jpg');

    $response = $this->actingAs($this->admin)->post(route('admin.profile.update'), [
        'name' => $this->admin->name,
        'email' => $this->admin->email,
        'avatar' => $file,
    ]);

    $response->assertRedirect();
    $this->admin->refresh();

    $this->assertNotNull($this->admin->avatar);
    Storage::disk('public')->assertExists($this->admin->avatar);
});

test('admin can update password', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.profile.update'), [
        'name' => $this->admin->name,
        'email' => $this->admin->email,
        'current_password' => 'password123',
        'password' => 'newadminpass123',
        'password_confirmation' => 'newadminpass123',
    ]);

    $response->assertRedirect();
    $this->admin->refresh();
    $this->assertTrue(Hash::check('newadminpass123', $this->admin->password));
});
