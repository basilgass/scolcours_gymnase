<?php

use App\Models\Chapter;
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
        Schema::create('chapter_relation', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
			$table->foreignIdFor(Chapter::class);
			$table->foreignIdFor(Chapter::class, 'related_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chapter_relation');
    }
};
