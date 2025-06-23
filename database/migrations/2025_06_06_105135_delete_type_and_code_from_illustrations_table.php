<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('illustrations', function (Blueprint $table) {
			$table->dropColumn('type');
			$table->dropColumn('value');
		});
	}

	public function down(): void
	{
		Schema::table('illustrations', function (Blueprint $table) {
			$table->string('type')->after('widget_id');
			$table->string('value')->after('css')->nullable();

		});
	}
};
