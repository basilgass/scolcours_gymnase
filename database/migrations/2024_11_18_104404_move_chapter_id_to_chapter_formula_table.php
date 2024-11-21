<?php

use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chapter_formula', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Chapter::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Formula::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });


        // Move existing data to the pivot table
        DB::table('formulas')->get()->each(function ($formula) {
            DB::table('chapter_formula')->insert([
                'chapter_id' => $formula->chapter_id,
                'formula_id' => $formula->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        // Remove the chapter_id column from formulas table
        Schema::table('formulas', function (Blueprint $table) {
            $table->dropConstrainedForeignIdFor(Chapter::class);
        });
    }

    public function down(): void
    {
        Schema::table('chapter_formula', function (Blueprint $table) {
            Schema::table('formulas', function (Blueprint $table) {
                $table->foreignId('chapter_id')->constrained();
            });

            Schema::dropIfExists('chapter_formula');
        });
    }
};
