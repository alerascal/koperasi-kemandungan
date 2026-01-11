<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Makanan', 'slug' => 'makanan', 'description' => 'Berbagai produk makanan'],
            ['name' => 'Minuman', 'slug' => 'minuman', 'description' => 'Berbagai produk minuman'],
            ['name' => 'Kebutuhan Rumah Tangga', 'slug' => 'kebutuhan-rumah-tangga', 'description' => 'Produk kebutuhan sehari-hari'],
            ['name' => 'Elektronik', 'slug' => 'elektronik', 'description' => 'Produk elektronik dan gadget'],
            ['name' => 'Pakaian', 'slug' => 'pakaian', 'description' => 'Berbagai pakaian dan aksesoris'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
