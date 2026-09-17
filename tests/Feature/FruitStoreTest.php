<?php

use App\Models\Category;
use App\Models\PackagingType;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Sale;
use App\Models\Setting;
use App\Models\Size;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->cat = Category::create(['name' => 'Buah Lokal', 'slug' => 'buah-lokal', 'is_active' => true]);
    $this->unit = Unit::create(['name' => 'Kilogram', 'symbol' => 'Kg', 'is_active' => true]);
    $this->packaging = PackagingType::create(['name' => 'Mika', 'is_active' => true]);
    $this->size = Size::create(['name' => 'Medium', 'is_active' => true]);

    $this->product = Product::create([
        'category_id' => $this->cat->id,
        'name' => 'Stroberi Ciwidey Segar',
        'slug' => 'stroberi-ciwidey-segar',
        'description' => 'Stroberi manis asam petik segar',
        'is_active' => true,
    ]);

    $this->variant = ProductVariant::create([
        'product_id' => $this->product->id,
        'packaging_type_id' => $this->packaging->id,
        'size_id' => $this->size->id,
        'unit_id' => $this->unit->id,
        'sku' => 'STR-MIK-MED',
        'price' => 25000,
        'stock' => 10.0,
        'is_active' => true,
    ]);

    $this->customer = User::create([
        'name' => 'Muhammad Budi',
        'email' => 'customer@test.com',
        'password' => bcrypt('password'),
        'role' => 'customer',
    ]);

    $this->admin = User::create([
        'name' => 'Admin Buah',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
});

test('guest can view home page and products catalog', function () {
    $response = $this->get(route('home'));
    $response->assertStatus(200);
});

test('guest can view product detail with variants', function () {
    $response = $this->get(route('products.show', $this->product->slug));
    $response->assertStatus(200);
});

test('customer can create order and stock is deducted', function () {
    $initialStock = $this->variant->stock;

    $response = $this->actingAs($this->customer)->post(route('cart.checkout.store'), [
        'customer_name' => 'Muhammad Budi',
        'customer_phone' => '081234567890',
        'customer_address' => 'Jl. Kebun Stroberi No. 1',
        'payment_method' => 'QRIS',
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 2.0,
            ],
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('sales', [
        'customer_name' => 'Muhammad Budi',
        'payment_method' => 'QRIS',
    ]);

    $this->assertEquals($initialStock - 2.0, $this->variant->fresh()->stock);
});

test('subsequent checkouts generate unique invoices without collision', function () {
    // Pre-create invoice 1 and 3
    $datePrefix = date('Ymd');
    Sale::create([
        'user_id' => $this->customer->id,
        'invoice_number' => "INV-{$datePrefix}-0001",
        'customer_name' => 'Customer 1',
        'customer_phone' => '0811111111',
        'total_amount' => 25000,
        'payment_method' => 'QRIS',
        'payment_status' => Sale::STATUS_PENDING,
    ]);

    Sale::create([
        'user_id' => $this->customer->id,
        'invoice_number' => "INV-{$datePrefix}-0003",
        'customer_name' => 'Customer 3',
        'customer_phone' => '0833333333',
        'total_amount' => 25000,
        'payment_method' => 'QRIS',
        'payment_status' => Sale::STATUS_PENDING,
    ]);

    // Next checkout must not collide with 0001 or 0003
    $response = $this->actingAs($this->customer)->post(route('cart.checkout.store'), [
        'customer_name' => 'Muhammad Budi',
        'customer_phone' => '081234567890',
        'customer_address' => 'Jl. Kebun Stroberi No. 1',
        'payment_method' => 'QRIS',
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 1.0,
            ],
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('sales', [
        'invoice_number' => "INV-{$datePrefix}-0004",
    ]);
});

test('admin can access dashboard and verify sales', function () {
    $sale = Sale::create([
        'user_id' => $this->customer->id,
        'invoice_number' => 'INV-20260916-9999',
        'customer_name' => $this->customer->name,
        'customer_phone' => '081234567890',
        'total_amount' => 50000,
        'payment_method' => 'TRANSFER',
        'payment_status' => Sale::STATUS_WAITING_VERIFICATION,
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));
    $response->assertStatus(200);

    $verifyResponse = $this->actingAs($this->admin)->post(route('admin.sales.verify', $sale->id), [
        'action' => 'approve',
    ]);

    $verifyResponse->assertRedirect();
    $this->assertEquals(Sale::STATUS_PAID, $sale->fresh()->payment_status);
});

test('non-admin cannot access admin backoffice', function () {
    $response = $this->actingAs($this->customer)->get(route('admin.dashboard'));
    $response->assertRedirect(route('login'));
});

test('admin can manage products CRUD', function () {
    // 1. Create Product
    $createResponse = $this->actingAs($this->admin)->post(route('admin.products.store'), [
        'category_id' => $this->cat->id,
        'name' => 'Blueberry Premium',
        'description' => 'Blueberry segar manis import',
        'image' => 'https://example.com/blueberry.jpg',
        'is_active' => true,
    ]);
    $createResponse->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['name' => 'Blueberry Premium']);

    $createdProduct = Product::where('name', 'Blueberry Premium')->first();

    // 2. Update Product
    $updateResponse = $this->actingAs($this->admin)->put(route('admin.products.update', $createdProduct->id), [
        'category_id' => $this->cat->id,
        'name' => 'Blueberry Super Premium',
        'description' => 'Blueberry kualitas super',
        'is_active' => true,
    ]);
    $updateResponse->assertRedirect();
    $this->assertDatabaseHas('products', ['name' => 'Blueberry Super Premium']);

    // 3. Toggle Product
    $toggleResponse = $this->actingAs($this->admin)->post(route('admin.products.toggle', $createdProduct->id));
    $toggleResponse->assertRedirect();
    $this->assertFalse($createdProduct->fresh()->is_active);

    // 4. Delete Product
    $deleteResponse = $this->actingAs($this->admin)->delete(route('admin.products.destroy', $createdProduct->id));
    $deleteResponse->assertRedirect();
    $this->assertDatabaseMissing('products', ['id' => $createdProduct->id]);
});

test('admin can upload product image to storage disk', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('kiwi-fresh.jpg');

    $response = $this->actingAs($this->admin)->post(route('admin.products.store'), [
        'category_id' => $this->cat->id,
        'name' => 'Kiwi Gold New Zealand',
        'description' => 'Kiwi segar manis tinggi vitamin C',
        'image_file' => $file,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.products.index'));

    $product = Product::where('name', 'Kiwi Gold New Zealand')->first();
    $this->assertNotNull($product);
    $this->assertStringStartsWith('products/', $product->image);
    Storage::disk('public')->assertExists($product->image);
    $this->assertStringContainsString('/storage/products/', $product->image_url);
});

test('admin can manage variants CRUD', function () {
    // 1. Create Variant
    $createResponse = $this->actingAs($this->admin)->post(route('admin.variants.store'), [
        'product_id' => $this->product->id,
        'packaging_type_id' => $this->packaging->id,
        'size_id' => $this->size->id,
        'unit_id' => $this->unit->id,
        'sku' => 'STR-BOX-L',
        'price' => 35000,
        'stock' => 15,
        'is_active' => true,
    ]);
    $createResponse->assertRedirect();
    $this->assertDatabaseHas('product_variants', ['sku' => 'STR-BOX-L']);

    $newVariant = ProductVariant::where('sku', 'STR-BOX-L')->first();

    // Check that initial stock mutation was logged
    $this->assertDatabaseHas('stock_mutations', [
        'product_variant_id' => $newVariant->id,
        'type' => 'IN',
        'quantity' => 15,
    ]);

    // 2. Update Variant
    $updateResponse = $this->actingAs($this->admin)->put(route('admin.variants.update', $newVariant->id), [
        'product_id' => $this->product->id,
        'packaging_type_id' => $this->packaging->id,
        'size_id' => $this->size->id,
        'unit_id' => $this->unit->id,
        'sku' => 'STR-BOX-XL',
        'price' => 40000,
        'is_active' => true,
    ]);
    $updateResponse->assertRedirect();
    $this->assertDatabaseHas('product_variants', ['sku' => 'STR-BOX-XL', 'price' => 40000]);

    // 3. Toggle Variant
    $this->actingAs($this->admin)->post(route('admin.variants.toggle', $newVariant->id));
    $this->assertFalse($newVariant->fresh()->is_active);

    // 4. Delete Variant
    $this->actingAs($this->admin)->delete(route('admin.variants.destroy', $newVariant->id));
    $this->assertDatabaseMissing('product_variants', ['id' => $newVariant->id]);
});

test('admin can adjust stock with audit mutations', function () {
    // 1. Adjustment IN (Panen / Masuk)
    $responseIn = $this->actingAs($this->admin)->post(route('admin.stocks.adjust'), [
        'variant_id' => $this->variant->id,
        'type' => 'IN',
        'quantity' => 5,
        'notes' => 'Panen Segar Blok B',
    ]);
    $responseIn->assertRedirect();
    $this->assertEquals(15.0, (float) $this->variant->fresh()->stock);

    $this->assertDatabaseHas('stock_mutations', [
        'product_variant_id' => $this->variant->id,
        'type' => 'IN',
        'quantity' => 5,
        'stock_before' => 10,
        'stock_after' => 15,
    ]);

    // 2. Adjustment OUT (Rusak / Afkir)
    $responseOut = $this->actingAs($this->admin)->post(route('admin.stocks.adjust'), [
        'variant_id' => $this->variant->id,
        'type' => 'OUT',
        'quantity' => 2,
        'notes' => 'Buah lembek',
    ]);
    $responseOut->assertRedirect();
    $this->assertEquals(13.0, (float) $this->variant->fresh()->stock);

    // 3. Adjustment Opname (Set Fisik)
    $responseAdj = $this->actingAs($this->admin)->post(route('admin.stocks.adjust'), [
        'variant_id' => $this->variant->id,
        'type' => 'ADJUSTMENT',
        'quantity' => 20,
        'notes' => 'Hasil opname gudang',
    ]);
    $responseAdj->assertRedirect();
    $this->assertEquals(20.0, (float) $this->variant->fresh()->stock);
});

test('admin can manage smtp, telegram and whatsapp configurations', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.settings.index'));
    $response->assertOk();

    // 1. Save SMTP settings
    $saveResponse = $this->actingAs($this->admin)->post(route('admin.settings.update'), [
        'group' => 'smtp',
        'smtp' => [
            'smtp_host' => 'smtp.gmail.com',
            'smtp_port' => '587',
            'smtp_username' => 'toko@gmail.com',
            'smtp_password' => 'secretapppass123',
            'smtp_is_active' => true,
        ],
    ]);
    $saveResponse->assertRedirect();
    $this->assertDatabaseHas('settings', ['key' => 'smtp_username', 'value' => 'toko@gmail.com']);

    // 2. Save Telegram settings
    $saveTelegram = $this->actingAs($this->admin)->post(route('admin.settings.update'), [
        'group' => 'telegram',
        'telegram' => [
            'telegram_bot_token' => '123456:BOT_TEST_TOKEN',
            'telegram_chat_id' => '-10012345678',
            'telegram_is_active' => true,
        ],
    ]);
    $saveTelegram->assertRedirect();
    $this->assertDatabaseHas('settings', ['key' => 'telegram_bot_token', 'value' => '123456:BOT_TEST_TOKEN']);

    // 3. Save WhatsApp settings
    $saveWa = $this->actingAs($this->admin)->post(route('admin.settings.update'), [
        'group' => 'whatsapp',
        'whatsapp' => [
            'whatsapp_provider' => 'fonnte',
            'whatsapp_api_key' => 'fonnte_api_key_test',
            'whatsapp_sender_number' => '081299999999',
            'whatsapp_is_active' => true,
        ],
    ]);
    $saveWa->assertRedirect();
    $this->assertDatabaseHas('settings', ['key' => 'whatsapp_api_key', 'value' => 'fonnte_api_key_test']);
});

test('authenticated user can logout and is redirected to home', function () {
    $response = $this->actingAs($this->customer)->post(route('logout'));
    $response->assertRedirect(route('home'));
    $this->assertGuest();
});

test('guest cannot checkout without logging in', function () {
    $response = $this->post(route('cart.checkout.store'), [
        'customer_name' => 'Tamu Zahwa',
        'customer_phone' => '081234567890',
        'customer_address' => 'Jl. Kebun Stroberi No. 1',
        'payment_method' => 'QRIS',
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 1.0,
            ],
        ],
    ]);

    $response->assertSessionHasErrors(['auth']);
    $this->assertDatabaseMissing('sales', [
        'customer_name' => 'Tamu Zahwa',
    ]);
});

test('admin can update payment and google settings and toggle them', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.settings.update'), [
        'group' => 'payment',
        'payment' => [
            'payment_qris_is_active' => true,
            'payment_qris_name' => 'QRIS Toko Buah Zahwa',
            'payment_transfer_is_active' => false,
            'payment_transfer_bank_name' => 'BCA',
            'payment_transfer_account_number' => '9988776655',
            'payment_transfer_account_holder' => 'Zahwa Owner',
            'payment_cod_is_active' => true,
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('settings', ['key' => 'payment_qris_name', 'value' => 'QRIS Toko Buah Zahwa']);
    $this->assertDatabaseHas('settings', ['key' => 'payment_transfer_is_active', 'value' => '0']);

    // Google settings update
    $googleResp = $this->actingAs($this->admin)->post(route('admin.settings.update'), [
        'group' => 'google',
        'google' => [
            'google_auth_is_active' => true,
            'google_client_id' => 'test-client-id.apps.googleusercontent.com',
            'google_client_secret' => 'test-client-secret-123',
            'google_redirect_uri' => 'http://localhost:8000/auth/google/callback',
        ],
    ]);

    $googleResp->assertRedirect();
    $this->assertDatabaseHas('settings', ['key' => 'google_client_id', 'value' => 'test-client-id.apps.googleusercontent.com']);

    // Quick toggle
    $toggleResp = $this->actingAs($this->admin)->post(route('admin.settings.toggle'), [
        'key' => 'google_auth_is_active',
        'group' => 'google',
    ]);
    $toggleResp->assertRedirect();
    $this->assertDatabaseHas('settings', ['key' => 'google_auth_is_active', 'value' => '0']);
});

test('customer cannot checkout with a disabled payment method', function () {
    Setting::set('payment_qris_is_active', '0', 'payment');

    $response = $this->actingAs($this->customer)->post(route('cart.checkout.store'), [
        'customer_name' => 'Muhammad Budi',
        'customer_phone' => '081234567890',
        'customer_address' => 'Jl. Buah Segar No. 10',
        'payment_method' => 'QRIS',
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 1.0,
            ],
        ],
    ]);

    $response->assertSessionHasErrors(['payment_method']);
    $this->assertDatabaseMissing('sales', [
        'customer_name' => 'Muhammad Budi',
        'payment_method' => 'QRIS',
    ]);
});

test('google login redirect is blocked if google auth is deactivated', function () {
    Setting::set('google_auth_is_active', '0', 'google');

    $response = $this->get(route('auth.google'));
    $response->assertRedirect(route('home'));
    $response->assertSessionHasErrors(['identifier']);
});
