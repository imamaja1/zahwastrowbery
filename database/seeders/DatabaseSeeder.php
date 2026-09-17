<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PackagingType;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Size;
use App\Models\StockMutation;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users (Hanya Admin)
        $admin = User::firstOrCreate(
            ['email' => 'admin@zahwastrowbery.com'],
            [
                'name' => 'Admin Zahwa Buah',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '081234567890',
            ]
        );

        /*
        // 2. Categories
        $catLokal = Category::firstOrCreate(['slug' => 'buah-lokal'], ['name' => 'Buah Lokal', 'description' => 'Hasil panen petani nusantara segar']);
        $catImport = Category::firstOrCreate(['slug' => 'buah-import'], ['name' => 'Buah Import', 'description' => 'Kualitas pilihan kualitas internasional']);
        $catTropis = Category::firstOrCreate(['slug' => 'buah-tropis'], ['name' => 'Buah Tropis', 'description' => 'Buah eksotis segar kaya vitamin']);
        $catPotong = Category::firstOrCreate(['slug' => 'buah-potong'], ['name' => 'Buah Potong & Siap Santap', 'description' => 'Higienis, dingin, siap santap']);

        // 3. Packaging Types
        $packMika = PackagingType::firstOrCreate(['name' => 'Mika'], ['description' => 'Kemasan mika higienis']);
        $packKotak = PackagingType::firstOrCreate(['name' => 'Kotak'], ['description' => 'Kotak kardus premium / parcel']);
        $packPlastik = PackagingType::firstOrCreate(['name' => 'Plastik'], ['description' => 'Plastik food grade']);
        $packKeranjang = PackagingType::firstOrCreate(['name' => 'Keranjang'], ['description' => 'Keranjang anyam tradisional']);
        $packNone = PackagingType::firstOrCreate(['name' => 'Tanpa Kemasan'], ['description' => 'Timbang lepas']);

        // 4. Sizes
        $sizeSmall = Size::firstOrCreate(['name' => 'Small'], ['description' => 'Ukuran kecil']);
        $sizeMedium = Size::firstOrCreate(['name' => 'Medium'], ['description' => 'Ukuran sedang']);
        $sizeBig = Size::firstOrCreate(['name' => 'Big'], ['description' => 'Ukuran besar']);
        $sizeJumbo = Size::firstOrCreate(['name' => 'Jumbo'], ['description' => 'Ukuran ekstra besar / jumbo']);

        // 5. Units
        $unitKg = Unit::firstOrCreate(['name' => 'Kilogram', 'symbol' => 'Kg'], ['description' => 'Satuan berat kilogram']);
        $unitGram = Unit::firstOrCreate(['name' => 'Gram', 'symbol' => 'g'], ['description' => 'Satuan gram']);
        $unitPcs = Unit::firstOrCreate(['name' => 'Pieces / Butir', 'symbol' => 'Pcs'], ['description' => 'Satuan butir / mika']);
        $unitBox = Unit::firstOrCreate(['name' => 'Kotak / Box', 'symbol' => 'Box'], ['description' => 'Satuan per kotak']);
        $unitPack = Unit::firstOrCreate(['name' => 'Pack', 'symbol' => 'Pack'], ['description' => 'Satuan per kemasan siap santap']);

        // 6. Products & Variants
        $pStraw = Product::firstOrCreate(
            ['slug' => 'stroberi-zahwa-fresh'],
            [
                'category_id' => $catLokal->id,
                'name' => 'Stroberi Zahwa Ciwidey Super',
                'description' => 'Stroberi manis asam segar kualitas pilihan langsung dari kebun Ciwidey dengan teknik pendinginan cold-chain 0-4°C.',
                'image' => 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        $this->createVariant($pStraw, $packMika, $sizeSmall, $unitPcs, 'STR-MIK-SML', 18000, 45);
        $this->createVariant($pStraw, $packMika, $sizeMedium, $unitPcs, 'STR-MIK-MED', 28000, 35);
        $this->createVariant($pStraw, $packMika, $sizeBig, $unitPcs, 'STR-MIK-BIG', 45000, 20);
        $this->createVariant($pStraw, $packKotak, null, $unitBox, 'STR-KTK-BOX', 85000, 15);
        $this->createVariant($pStraw, $packNone, null, $unitKg, 'STR-KG-001', 75000, 60);

        $pApel = Product::firstOrCreate(
            ['slug' => 'apel-fuji-premium'],
            [
                'category_id' => $catImport->id,
                'name' => 'Apel Fuji Wang Shan Premium',
                'description' => 'Apel renyah, berair, dan manis alami. Sangat cocok dinikmati sehari-hari maupun untuk hidangan keluarga.',
                'image' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        $this->createVariant($pApel, $packMika, $sizeSmall, $unitPcs, 'APL-MIK-SML', 12000, 50);
        $this->createVariant($pApel, $packMika, $sizeMedium, $unitPcs, 'APL-MIK-MED', 18000, 40);
        $this->createVariant($pApel, $packMika, $sizeBig, $unitPcs, 'APL-MIK-BIG', 25000, 30);
        $this->createVariant($pApel, $packKotak, null, $unitBox, 'APL-KTK-BOX', 95000, 10);
        $this->createVariant($pApel, $packNone, null, $unitKg, 'APL-KG-001', 45000, 80);

        $pMangga = Product::firstOrCreate(
            ['slug' => 'mangga-harum-manis-super'],
            [
                'category_id' => $catTropis->id,
                'name' => 'Mangga Harum Manis Probolinggo',
                'description' => 'Daging tebal lembut tanpa serat berlebih dengan rasa manis legit khas Probolinggo.',
                'image' => 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        $this->createVariant($pMangga, $packMika, $sizeMedium, $unitPcs, 'MNG-MIK-MED', 15000, 30);
        $this->createVariant($pMangga, $packKotak, null, $unitBox, 'MNG-KTK-BOX', 70000, 14);
        $this->createVariant($pMangga, $packNone, null, $unitKg, 'MNG-KG-001', 35000, 90);

        $pJeruk = Product::firstOrCreate(
            ['slug' => 'jeruk-medan-manis'],
            [
                'category_id' => $catLokal->id,
                'name' => 'Jeruk Medan Brastagi Manis Segar',
                'description' => 'Kandungan air melimpah, bulir segar manis asam menyegarkan tenggorokan.',
                'image' => 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        $this->createVariant($pJeruk, $packMika, $sizeMedium, $unitPcs, 'JRK-MIK-MED', 14000, 25);
        $this->createVariant($pJeruk, $packNone, null, $unitKg, 'JRK-KG-001', 28000, 110);

        $pAnggur = Product::firstOrCreate(
            ['slug' => 'anggur-red-globe'],
            [
                'category_id' => $catImport->id,
                'name' => 'Anggur Red Globe Manis Renyah',
                'description' => 'Butiran buah merah besar, tekstur renyah dan kadar gula tinggi alami.',
                'image' => 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        $this->createVariant($pAnggur, $packMika, $sizeMedium, $unitPcs, 'AGR-MIK-MED', 35000, 20);
        $this->createVariant($pAnggur, $packNone, null, $unitKg, 'AGR-KG-001', 68000, 50);

        // 7. Seed Sample Sales & Transactions
        $varStrawMed = ProductVariant::where('sku', 'STR-MIK-MED')->first();
        $varApelKg = ProductVariant::where('sku', 'APL-KG-001')->first();
        $varManggaBox = ProductVariant::where('sku', 'MNG-KTK-BOX')->first();

        // Sale 1: WAITING_VERIFICATION (QRIS)
        $sale1 = Sale::firstOrCreate(
            ['invoice_number' => 'INV-'.date('Ymd').'-0001'],
            [
                'user_id' => null,
                'customer_name' => 'Muhammad Budi',
                'customer_phone' => '089876543210',
                'customer_address' => 'Jl. Buah Segar No. 45, Bandung',
                'total_amount' => 95000,
                'payment_method' => 'QRIS',
                'payment_status' => Sale::STATUS_WAITING_VERIFICATION,
                'payment_proof' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
                'notes' => 'Tolong kirimkan pagi hari ya kak',
                'created_at' => Carbon::now()->subHours(2),
            ]
        );

        if ($sale1->wasRecentlyCreated && $varStrawMed && $varApelKg) {
            SaleItem::create([
                'sale_id' => $sale1->id,
                'product_variant_id' => $varStrawMed->id,
                'product_name' => 'Stroberi Zahwa Ciwidey Super',
                'variant_name' => 'Mika Medium (Pcs)',
                'quantity' => 2,
                'price' => 28000,
                'subtotal' => 56000,
            ]);

            SaleItem::create([
                'sale_id' => $sale1->id,
                'product_variant_id' => $varApelKg->id,
                'product_name' => 'Apel Fuji Wang Shan Premium',
                'variant_name' => 'Tanpa Kemasan (Kg)',
                'quantity' => 1.5,
                'price' => 45000,
                'subtotal' => 67500,
            ]);
        }

        // Sale 2: PAID (Transfer)
        $sale2 = Sale::firstOrCreate(
            ['invoice_number' => 'INV-'.date('Ymd').'-0002'],
            [
                'user_id' => null,
                'customer_name' => 'Hj. Siti Rahma',
                'customer_phone' => '081299887766',
                'customer_address' => 'Komplek Permata Hijau Blok C-12',
                'total_amount' => 140000,
                'payment_method' => 'TRANSFER',
                'payment_status' => Sale::STATUS_PAID,
                'payment_proof' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
                'notes' => 'Parcel buah untuk orang tua',
                'paid_at' => Carbon::now()->subDay(),
                'created_at' => Carbon::now()->subDay(),
            ]
        );

        if ($sale2->wasRecentlyCreated && $varManggaBox) {
            SaleItem::create([
                'sale_id' => $sale2->id,
                'product_variant_id' => $varManggaBox->id,
                'product_name' => 'Mangga Harum Manis Probolinggo',
                'variant_name' => 'Kotak (Box)',
                'quantity' => 2,
                'price' => 70000,
                'subtotal' => 140000,
            ]);
        }

        // Sale 3: COD
        $sale3 = Sale::firstOrCreate(
            ['invoice_number' => 'INV-'.date('Ymd').'-0003'],
            [
                'user_id' => null,
                'customer_name' => 'Bpk. Ahmad Fauzi',
                'customer_phone' => '085712344321',
                'customer_address' => 'Jl. Dago Atas No. 88, Bandung',
                'total_amount' => 75000,
                'payment_method' => 'COD',
                'payment_status' => Sale::STATUS_PENDING,
                'notes' => 'Bayar saat kurir sampai',
                'created_at' => Carbon::now()->subMinutes(30),
            ]
        );

        if ($sale3->wasRecentlyCreated && $varStrawMed) {
            SaleItem::create([
                'sale_id' => $sale3->id,
                'product_variant_id' => $varStrawMed->id,
                'product_name' => 'Stroberi Zahwa Ciwidey Super',
                'variant_name' => 'Tanpa Kemasan (Kg)',
                'quantity' => 1,
                'price' => 75000,
                'subtotal' => 75000,
            ]);
        }
        */
    }

    private function createVariant(Product $product, ?PackagingType $packaging, ?Size $size, Unit $unit, string $sku, float $price, float $stock): ProductVariant
    {
        $variant = ProductVariant::firstOrCreate(
            ['sku' => $sku],
            [
                'product_id' => $product->id,
                'packaging_type_id' => $packaging?->id,
                'size_id' => $size?->id,
                'unit_id' => $unit->id,
                'price' => $price,
                'stock' => $stock,
                'is_active' => true,
            ]
        );

        if ($variant->wasRecentlyCreated && $stock > 0) {
            StockMutation::create([
                'product_variant_id' => $variant->id,
                'type' => 'IN',
                'quantity' => $stock,
                'stock_before' => 0,
                'stock_after' => $stock,
                'reference_number' => 'INIT-SEED',
                'notes' => 'Stok awal panen master data seeder',
            ]);
        }

        return $variant;
    }
}
