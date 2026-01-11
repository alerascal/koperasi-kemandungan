<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $makanan = Category::where('slug', 'makanan')->first();
        $minuman = Category::where('slug', 'minuman')->first();
        $rumahTangga = Category::where('slug', 'kebutuhan-rumah-tangga')->first();

        $products = [
            [
                'name' => 'Beras Premium 5kg',
                'slug' => 'beras-premium-5kg',
                'description' => 'Beras premium kualitas terbaik',
                'price' => 65000,
                'stock' => 100,
                'category_id' => $makanan->id,
                'is_active' => true,
            ],
            [
                'name' => 'Minyak Goreng 2L',
                'slug' => 'minyak-goreng-2l',
                'description' => 'Minyak goreng kemasan 2 liter',
                'price' => 35000,
                'stock' => 150,
                'category_id' => $makanan->id,
                'is_active' => true,
            ],
            [
                'name' => 'Air Mineral 1 Dus',
                'slug' => 'air-mineral-1-dus',
                'description' => 'Air mineral 24 botol',
                'price' => 45000,
                'stock' => 80,
                'category_id' => $minuman->id,
                'is_active' => true,
            ],
            [
                'name' => 'Sabun Cuci Piring 800ml',
                'slug' => 'sabun-cuci-piring-800ml',
                'description' => 'Sabun cuci piring ekonomis',
                'price' => 18000,
                'stock' => 90,
                'category_id' => $rumahTangga->id,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
