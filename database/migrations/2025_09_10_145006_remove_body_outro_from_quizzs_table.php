<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('quizzs', function (Blueprint $table) {
			$table->dropColumn('body');
			$table->dropColumn('outro');
		});
	}

	public function down(): void
	{
		Schema::table('quizzs', function (Blueprint $table) {
			$table->text('outro')->after('title')->default("");
			$table->text('body')->after('title')->default("");
		});
	}
};
