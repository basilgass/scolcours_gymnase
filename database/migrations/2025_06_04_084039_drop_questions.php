<?php

use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::dropIfExists('question_user');
	}

	public function down(): void
	{
		Schema::create('question_user', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
			$table->foreignIdFor(Question::class)->constrained()->cascadeOnDelete();
			$table->boolean('result')->default(false);
			$table->text('answer')->default('');
			$table->integer('attempts')->default(0);
			$table->timestamps();
		});
	}
};
