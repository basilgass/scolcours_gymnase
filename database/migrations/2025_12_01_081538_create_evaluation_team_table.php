<?php

use App\Models\Evaluation;
use App\Models\Team;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('evaluation_team', function (Blueprint $table) {
			$table->id();

			$table->foreignIdFor(Team::class)->constrained()->cascadeOnDelete();
			$table->foreignIdFor(Evaluation::class)->constrained()->cascadeOnDelete();
			
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('evaluation_team');
	}
};
