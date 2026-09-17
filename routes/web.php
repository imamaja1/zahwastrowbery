<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\SaleController as AdminSaleController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\StockController as AdminStockController;
use App\Http\Controllers\Admin\VariantController as AdminVariantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Customer\CartCheckoutController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\ProductController;
use App\Http\Controllers\Customer\ProfileController;
use Illuminate\Support\Facades\Route;

// Public / Customer Catalog
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');

// Cart & Checkout
Route::get('/checkout', [CartCheckoutController::class, 'index'])->name('cart.checkout');
Route::post('/checkout', [CartCheckoutController::class, 'store'])->name('cart.checkout.store');

// Orders
Route::get('/orders/{invoice_number}', [OrderController::class, 'show'])->name('orders.show');
Route::post('/orders/{invoice_number}/proof', [OrderController::class, 'uploadProof'])->name('orders.upload-proof');

Route::middleware('auth')->group(function () {
    Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Authentication
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::get('/login/demo/{role}', [AuthController::class, 'demoLogin'])->name('login.demo');
Route::get('/auth/google', [AuthController::class, 'googleRedirect'])->name('auth.google');
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback'])->name('auth.google.callback');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Admin Backoffice
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/sales', [AdminSaleController::class, 'index'])->name('sales.index');
    Route::post('/sales/{id}/verify', [AdminSaleController::class, 'verify'])->name('sales.verify');

    // 1. Manajemen Produk
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::put('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::post('/products/{id}/toggle', [AdminProductController::class, 'toggle'])->name('products.toggle');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    // 2. Manajemen Varian
    Route::get('/variants', [AdminVariantController::class, 'index'])->name('variants.index');
    Route::post('/variants', [AdminVariantController::class, 'store'])->name('variants.store');
    Route::put('/variants/{id}', [AdminVariantController::class, 'update'])->name('variants.update');
    Route::post('/variants/{id}/toggle', [AdminVariantController::class, 'toggle'])->name('variants.toggle');
    Route::delete('/variants/{id}', [AdminVariantController::class, 'destroy'])->name('variants.destroy');

    // 3. Manajemen Stok
    Route::get('/stocks', [AdminStockController::class, 'index'])->name('stocks.index');
    Route::post('/stocks/adjust', [AdminStockController::class, 'adjust'])->name('stocks.adjust');

    // 4. Konfigurasi Sistem (Pembayaran, Google Login, SMTP, Telegram, WhatsApp)
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/toggle', [AdminSettingController::class, 'toggle'])->name('settings.toggle');
    Route::post('/settings/test-smtp', [AdminSettingController::class, 'testSmtp'])->name('settings.test-smtp');
    Route::post('/settings/test-telegram', [AdminSettingController::class, 'testTelegram'])->name('settings.test-telegram');
    Route::post('/settings/test-whatsapp', [AdminSettingController::class, 'testWhatsapp'])->name('settings.test-whatsapp');
    Route::get('/settings/whatsapp/status', [AdminSettingController::class, 'checkWhatsappStatus'])->name('settings.whatsapp-status');
    Route::get('/settings/whatsapp/qr', [AdminSettingController::class, 'getWhatsappQr'])->name('settings.whatsapp-qr');
    Route::post('/settings/whatsapp/logout', [AdminSettingController::class, 'logoutWhatsapp'])->name('settings.whatsapp-logout');
    Route::post('/settings/whatsapp/register', [AdminSettingController::class, 'registerWhatsappNumber'])->name('settings.whatsapp-register');

    // 5. Profil Admin
    Route::get('/profile', [AdminProfileController::class, 'index'])->name('profile.index');
    Route::post('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
});
