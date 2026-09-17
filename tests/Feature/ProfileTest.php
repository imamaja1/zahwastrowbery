<?php

use App\Models\Category;
use App\Models\PackagingType;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Size;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->customer = User::create([
        'name' => 'Siti Nurhaliza',
        'email' => 'siti@test.com',
        'password' => Hash::make('password123'),
        'role' => 'customer',
        'phone' => '081234567890',
    ]);

    $this->cat = Category::create(['name' => 'Buah Lokal', 'slug' => 'buah-lokal', 'is_active' => true]);
    $this->unit = Unit::create(['name' => 'Kilogram', 'symbol' => 'Kg', 'is_active' => true]);
    $this->packaging = PackagingType::create(['name' => 'Mika', 'is_active' => true]);
    $this->size = Size::create(['name' => 'Medium', 'is_active' => true]);

    $this->product = Product::create([
        'category_id' => $this->cat->id,
        'name' => 'Stroberi Segar',
        'slug' => 'stroberi-segar',
        'is_active' => true,
    ]);

    $this->variant = ProductVariant::create([
        'product_id' => $this->product->id,
        'packaging_type_id' => $this->packaging->id,
        'size_id' => $this->size->id,
        'unit_id' => $this->unit->id,
        'sku' => 'STR-TEST-1',
        'price' => 30000,
        'stock' => 10,
        'is_active' => true,
    ]);
});

test('guest cannot access profile page and is redirected to login', function () {
    $response = $this->get(route('profile.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated user can view their profile', function () {
    $response = $this->actingAs($this->customer)->get(route('profile.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Customer/Profile')
        ->has('profile', fn ($page) => $page
            ->where('name', 'Siti Nurhaliza')
            ->where('email', 'siti@test.com')
            ->where('phone', '081234567890')
            ->etc()
        )
    );
});

test('authenticated user can update profile contact info', function () {
    $response = $this->actingAs($this->customer)->post(route('profile.update'), [
        'name' => 'Siti Nurhaliza Baru',
        'email' => 'siti.baru@test.com',
        'phone' => '089876543210',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->customer->refresh();
    $this->assertEquals('Siti Nurhaliza Baru', $this->customer->name);
    $this->assertEquals('siti.baru@test.com', $this->customer->email);
    $this->assertEquals('089876543210', $this->customer->phone);
});

test('authenticated user can upload avatar image', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('profile.jpg');

    $response = $this->actingAs($this->customer)->post(route('profile.update'), [
        'name' => $this->customer->name,
        'email' => $this->customer->email,
        'phone' => $this->customer->phone,
        'avatar' => $file,
    ]);

    $response->assertRedirect();
    $this->customer->refresh();

    $this->assertNotNull($this->customer->avatar);
    Storage::disk('public')->assertExists($this->customer->avatar);
});

test('avatar upload rejects file larger than 2MB', function () {
    Storage::fake('public');

    // 3MB file (3072 KB) > 2048 KB
    $file = UploadedFile::fake()->create('huge-profile.jpg', 3072, 'image/jpeg');

    $response = $this->actingAs($this->customer)->post(route('profile.update'), [
        'name' => $this->customer->name,
        'email' => $this->customer->email,
        'avatar' => $file,
    ]);

    $response->assertSessionHasErrors(['avatar']);
});

test('authenticated user can update password', function () {
    $response = $this->actingAs($this->customer)->post(route('profile.update'), [
        'name' => $this->customer->name,
        'email' => $this->customer->email,
        'current_password' => 'password123',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertRedirect();
    $this->customer->refresh();
    $this->assertTrue(Hash::check('newpassword123', $this->customer->password));
});
