<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('quizz_sessions', function (Blueprint $table) {
			$table->string('projection_template')->after('show_answer')->nullable();
		});
	}

	public function down(): void
	{
		Schema::table('quizz_sessions', function (Blueprint $table) {
			$table->dropColumn('projection_template');
		});
	}
};
