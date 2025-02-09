<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('dictionary', function (Blueprint $table) {
			$table->id();

			$table->tinyText('word');
			$table->char('language', 2);
			$table->boolean('common')->default(false);

			$table->timestamps();

			$table->unique(['word', 'language']);
		});

		// Read liste-de-mots-français.js
		// Add the following words to the dictionary table
		$filePath = base_path('resources/js/helpers/liste-des-mots-francais-pli07.js');

		preg_match_all('/"([^"]+)"/', file_get_contents($filePath), $matches);
		$words = $matches[1];

		// make sure all words are unique
		$words = array_unique($words);

		print('Number of words: ' . count($words));

		$filePath = base_path('resources/js/helpers/liste-des-mots-francais.js');
		preg_match_all('/"([^"]+)"/', file_get_contents($filePath), $matches);
		$common_words = $matches[1];

		print('Number of common words: ' . count($common_words));

		foreach ($words as $word) {
			DB::table('dictionary')->insert(
				[
					'word'       => $word,
					'language'   => 'fr',
					'common'     => in_array($word, $common_words),
					'created_at' => now(),
					'updated_at' => now()
				]
			);
		}



	}

	public function down(): void
	{
		Schema::dropIfExists('dictionary');
	}
};
