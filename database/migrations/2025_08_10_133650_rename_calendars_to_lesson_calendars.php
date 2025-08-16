<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::rename('calendars', 'lesson_calendars');
	}

	public function down(): void
	{
		Schema::rename('lesson_calendars', 'calendars');
	}
};
