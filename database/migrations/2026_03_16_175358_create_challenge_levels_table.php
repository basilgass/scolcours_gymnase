<?php

use App\Models\Challenge;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Challenge::class)->constrained()->cascadeOnDelete();
            $table->unsignedInteger('level_number');
            $table->unsignedInteger('points_to_pass');
            $table->json('bonus')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_levels');
    }
};
