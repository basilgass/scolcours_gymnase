<?php

use App\Models\Challenges\ChallengeSession;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::dropIfExists('challenge_users');
	}

	public function down(): void
	{
		Schema::create('challenge_users', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->foreignIdFor(ChallengeSession::class)->constrained()->cascadeOnDelete();
			$table->string('token');
			$table->integer('score');
			//
			$table->timestamps();

			$table->unique(['challenge_session_id', 'token']);
		});
	}
};
