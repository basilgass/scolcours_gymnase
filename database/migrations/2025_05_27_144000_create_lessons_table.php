<?php

use App\Models\Course;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('lessons', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(Course::class)->constrained()->cascadeOnDelete();
			$table->string('requires')->nullable();
			$table->timestamp('opened_at')->nullable();
			$table->timestamp('scheduled_at')->nullable();
			$table->morphs('lessonable'); //accepts posts, challenges, decks, quizz, ...
			$table->json('parameters')->nullable(); // configures the lessonable...
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('lessons');
	}
};
