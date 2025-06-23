<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('challenge_sessions');
    }

    public function down(): void
    {
		Schema::create('challenge_sessions', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->foreignIdFor(Challenge::class)->constrained()->cascadeOnDelete();
			$table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
			$table->string('token')->unique();
			$table->boolean('open');
			$table->integer('duration');
			$table->timestamps();
		});
    }
};
