<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {

        Schema::table('translation_units', function (Blueprint $table) {
            // Drop the unique constraint on the 'language' and 'unit' columns
            $table->dropUnique(['language', 'unit']);

            // Prepend every data from "unit" column to the "title" column
            DB::statement('UPDATE translation_units SET title = CONCAT(title, " ", unit)');

            // Delete the unit column
            $table->dropColumn('unit');

            // The title column must be unique
            $table->unique(['language', 'title']);
        });
    }

    public function down(): void
    {
        Schema::table('translation_units', function (Blueprint $table) {
            //
        });
    }
};
