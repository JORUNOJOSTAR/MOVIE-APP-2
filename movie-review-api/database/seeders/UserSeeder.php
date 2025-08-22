<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'age' => 25,
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'age' => 30,
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'age' => 35,
            'password' => Hash::make('admin123'),
        ]);

        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'age' => 22,
            'password' => Hash::make('test123'),
        ]);
    }
}
