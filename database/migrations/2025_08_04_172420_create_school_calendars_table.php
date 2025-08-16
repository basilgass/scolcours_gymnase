<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('school_calendars', function (Blueprint $table) {
			$table->id();
			$table->integer('week')->nullable();
			$table->date('day');
			$table->boolean('school')->default(true);
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('school_calendars');
	}
};
