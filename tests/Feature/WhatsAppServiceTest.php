<?php

use App\Models\Setting;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::create([
        'name' => 'Admin Toko',
        'email' => 'admin@zahwastrowbery.com',
        'password' => Hash::make('password123'),
        'role' => 'admin',
        'phone' => '081234567890',
    ]);

    Setting::set('whatsapp_base_url', 'https://otomasi.punyaku.online', 'whatsapp');
    Setting::set('whatsapp_api_key', 'ak_test12345678', 'whatsapp');
    Setting::set('whatsapp_is_active', '1', 'whatsapp');
    Setting::set('whatsapp_sender_number', '6281234567890', 'whatsapp');
    Setting::set('whatsapp_admin_number', '6281234567890', 'whatsapp');
});

test('whatsapp service normalizes phone numbers correctly', function () {
    $service = new WhatsAppService;

    expect($service->normalizePhoneNumber('081234567890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber('+6281234567890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber('81234567890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber('6281234567890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber('0812-3456-7890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber(null))->toBeNull();
});

test('whatsapp service sends message successfully', function () {
    Http::fake([
        'https://otomasi.punyaku.online/api/v1/whatsapp/send' => Http::response([
            'id' => 21,
            'status' => 'sent',
        ], 200),
    ]);

    $service = new WhatsAppService;
    $result = $service->sendMessage('081234567890', 'Halo uji coba!');

    expect($result['success'])->toBeTrue()
        ->and($result['status'])->toBe('sent')
        ->and($result['id'])->toBe(21);

    Http::assertSent(function ($request) {
        return $request->hasHeader('x-api-key', 'ak_test12345678')
            && $request['to'] === '6281234567890'
            && $request['message'] === 'Halo uji coba!';
    });
});

test('whatsapp service handles device status check', function () {
    Http::fake([
        'https://otomasi.punyaku.online/api/v1/whatsapp/me' => Http::response([
            'id' => 2,
            'phoneNumber' => '6281234567890',
            'state' => 'ready',
            'isReady' => true,
            'lastError' => null,
        ], 200),
    ]);

    $service = new WhatsAppService;
    $status = $service->getDeviceStatus();

    expect($status['success'])->toBeTrue()
        ->and($status['isReady'])->toBeTrue()
        ->and($status['state'])->toBe('ready')
        ->and($status['phoneNumber'])->toBe('6281234567890');
});

test('admin can trigger test whatsapp message via setting route', function () {
    Http::fake([
        'https://otomasi.punyaku.online/api/v1/whatsapp/send' => Http::response([
            'id' => 99,
            'status' => 'sent',
        ], 200),
    ]);

    $response = $this->actingAs($this->admin)->post(route('admin.settings.test-whatsapp'), [
        'test_phone' => '081298765432',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
});

test('admin can query whatsapp device status via JSON endpoint', function () {
    Http::fake([
        'https://otomasi.punyaku.online/api/v1/whatsapp/me' => Http::response([
            'id' => 2,
            'phoneNumber' => '6281234567890',
            'state' => 'ready',
            'isReady' => true,
            'lastError' => null,
        ], 200),
    ]);

    $response = $this->actingAs($this->admin)->getJson(route('admin.settings.whatsapp-status'));

    $response->assertOk();
    $response->assertJson([
        'success' => true,
        'state' => 'ready',
        'isReady' => true,
    ]);
});

test('admin can request whatsapp logout via route', function () {
    Http::fake([
        'https://otomasi.punyaku.online/api/v1/whatsapp/me/logout' => Http::response([
            'success' => true,
        ], 200),
    ]);

    $response = $this->actingAs($this->admin)->postJson(route('admin.settings.whatsapp-logout'));

    $response->assertOk();
    $response->assertJson([
        'success' => true,
    ]);
});

test('admin can register whatsapp phone number via route', function () {
    Http::fake([
        'https://otomasi.punyaku.online/api/v1/whatsapp/accounts' => Http::response([
            'id' => 12,
            'phoneNumber' => '6281234567890',
        ], 200),
    ]);

    $response = $this->actingAs($this->admin)->postJson(route('admin.settings.whatsapp-register'), [
        'phone_number' => '081234567890',
    ]);

    $response->assertOk();
    $response->assertJson([
        'success' => true,
    ]);
});
