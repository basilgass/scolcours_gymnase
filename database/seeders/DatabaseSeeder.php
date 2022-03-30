<?php

namespace Database\Seeders;

use App\Models\PostTemplate;
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
        // \App\Models\User::factory(10)->create();
        User::create([
            'name' => 'Basil',
            'email' => 'basil@scolcours.ch',
            'password' => Hash::make('semidieu'),
        ]);
				// Create a new

		PostTemplate::create([
			'name' => 'Article de base',
			'component' => 'SimplePost'
		]);

		PostTemplate::create([
			'name' => 'Quizz glisser - déposer',
			'component' => 'QuizzPost'
		]);
    }
}
