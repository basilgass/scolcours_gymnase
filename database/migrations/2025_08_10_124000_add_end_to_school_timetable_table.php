<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('school_timetable', function (Blueprint $table) {
			$table->time('end')->nullable()->after('start');
		});

		DB::table('school_timetable')->update([
			'end' => DB::raw('ADDTIME(start, "00:45:00")')
		]);

		Schema::table('school_timetable', function (Blueprint $table) {
			$table->time('end')->nullable(false)->change();
		});
	}

	public function down(): void
	{
		Schema::table('school_timetable', function (Blueprint $table) {
			$table->dropColumn('end');
		});
	}
};
