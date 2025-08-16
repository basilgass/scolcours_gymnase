<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('school_timetable', function (Blueprint $table) {
			$table->id();

			$table->tinyInteger('period');
			$table->time('start');

			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('school_timetable');
	}
};
