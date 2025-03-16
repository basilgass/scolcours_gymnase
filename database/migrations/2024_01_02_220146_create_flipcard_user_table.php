<?php

use App\Models\Card;
use App\Models\User;
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
        Schema::create('flipcard_user', function (Blueprint $table) {
            $table->id();
			$table->foreignIdFor(Card::class)->constrained()->cascadeOnDelete();
			$table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
			$table->boolean('success')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flipcard_user');
    }
};
