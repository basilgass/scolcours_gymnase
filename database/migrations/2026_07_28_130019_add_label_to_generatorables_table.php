<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('generatorables', function (Blueprint $table) {
			$table->string('label')->after('generatorable_id')->nullable();
		});
	}

	public function down(): void
	{
		Schema::table('generatorables', function (Blueprint $table) {
			$table->dropColumn('label');
		});
	}
};
