<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('deck_deck', function (Blueprint $table) {
			$table->id();
			$table->foreignId('deck_id')->constrained('decks')->onDelete('cascade');
			$table->foreignId('used_deck_id')->constrained('decks')->onDelete('cascade');
			$table->unique(['deck_id', 'used_deck_id']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('deck_deck');
	}
};
