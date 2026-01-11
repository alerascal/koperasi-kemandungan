<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Koperasi',
            'email' => 'admin@koperasi.com',
            'password' => Hash::make('password'),
            'phone' => '081234567890',
            'address' => 'Jl. Koperasi No. 1',
            'role' => 'admin',
            'is_active' => true,
            'member_number' => 'ADM001',
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => Hash::make('password'),
            'phone' => '081234567891',
            'address' => 'Jl. Mawar No. 10',
            'role' => 'member',
            'is_active' => true,
            'member_number' => 'MBR001',
        ]);

        User::create([
            'name' => 'Siti Rahayu',
            'email' => 'siti@example.com',
            'password' => Hash::make('password'),
            'phone' => '081234567892',
            'address' => 'Jl. Melati No. 5',
            'role' => 'user',
            'is_active' => true,
        ]);
    }
}
