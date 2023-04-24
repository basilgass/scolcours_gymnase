<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quizz_sessions', function (Blueprint $table) {
            $table->id();

			$table->foreignIdFor(\App\Models\Quizz::class)->constrained()->cascadeOnDelete();
			$table->string('shortcode')->unique();
			$table->boolean('enable')->default(false);

			// current "question" = intro
			$table->integer('index')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizz_sessions');
    }
};
