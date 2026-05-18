<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('generatorables', function (Blueprint $table) {
			$table->json('parameters')->after('config')->nullable();
		});
	}

	public function down(): void
	{
		Schema::table('generatorables', function (Blueprint $table) {
			$table->dropColumn('parameters');
		});
	}
};