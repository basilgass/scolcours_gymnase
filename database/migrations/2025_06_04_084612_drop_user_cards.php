<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::dropIfExists('user_cards');
	}

	public function down(): void
	{
		Schema::create('user_cards', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_deck_id')->constrained('user_decks')->cascadeOnDelete();
			$table->morphs('cardable');
			// Current "run status":
			// null => not yet started
			// 0 => not found
			// 1 => found
			$table->integer('current_score')->nullable();
			$table->integer('current_appearances')->default(0);
			$table->integer('current_time_spent')->default(0);

			$table->integer('appearances')->default(0);
			$table->integer('success')->default(0);
			$table->float('time_spent')->default(0);
			$table->timestamps();
		});
	}
};
