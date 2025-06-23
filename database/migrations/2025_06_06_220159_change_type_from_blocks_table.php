<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('blocks', function (Blueprint $table) {
			$table->string('type')->nullable()->default(null)->change();
		});

		// Remplacer "" par NULL
		DB::table('blocks')
		  ->where('type', '')
		  ->update(['type' => null]);

	}

	public function down(): void
	{
		Schema::table('blocks', function (Blueprint $table) {
			$table->string('type')->default('')->nullable(false)->change();
		});
	}
};
