<?php

use App\Models\Team;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('team_calendars', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(Team::class)->constrained('teams');
			$table->integer('day');
			$table->time('time');
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('team_calendars');
	}
};
