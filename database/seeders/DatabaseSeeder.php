<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Basil',
            'email' => 'basil@scolcours.ch',
            'password' => Hash::make('semidieu'),
        ]);

		User::create([
			'name' => 'etudiant',
			'email' => 'etudiant@scolcours.ch',
			'password' => Hash::make('etudiant'),
		]);
    }
}
