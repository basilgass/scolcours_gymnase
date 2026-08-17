<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Supprime la colonne morte `chapters.meta_title` (vide en local et prod),
     * remplacée par l'override polymorphe `metas.meta_title` (SP1/SP2).
     */
    public function up(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            $table->dropColumn('meta_title');
        });
    }

    public function down(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            $table->string('meta_title')->nullable()->after('title');
        });
    }
};
