<?php

use App\Models\Lesson;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('calendars', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(Lesson::class)->constrained('lessons');
			$table->dateTime('scheduled_at')->nullable();
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('calendars');
	}
};
