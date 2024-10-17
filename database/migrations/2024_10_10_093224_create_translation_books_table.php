<?php

use App\Models\TranslationLanguage;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('translation_books', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('name');
            $table->string('cover')->default("");
            $table->foreignIdFor(TranslationLanguage::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });


        // Create the books.
        $itBooks = TranslationLanguage::where('slug', 'italiano')->first()->books();
        $itBooks->create(
            [
                "slug"  => "npi-1",
                "name"  => "Nuovissimo progetto italiano 1",
                "cover" => "/images/npi1_cover.jpg"
            ]
        );
        $itBooks->create(
            [
                "slug"  => "npi-2",
                "name"  => "Nuovissimo progetto italiano 2",
                "cover" => "/images/npi2_cover.jpg"
            ]
        );
        $itBooks->create(
            [
                "slug" => "libro-2",
                "name" => "Libro 2",
            ]
        );

        $enBooks = TranslationLanguage::where('slug', 'english')->first()->books();
        $enBooks->create(
            [
                "slug" => "life",
                "name" => "Life",
            ]
        );
        $enBooks->create(
            [
                "slug" => "nathan",
                "name" => "Le vocabulaire anglais (Nathan)",
                "cover" => "/images/nathan_cover.jpg"
            ]
        );
        $enBooks->create(
            [
                "slug" => "nathan-extra",
                "name" => "Le Vocabulaire anglais (Nathan) - compléments"
            ]
        );

        $deBooks = TranslationLanguage::where('slug', 'deutsch')->first()->books();
        $deBooks->create([
            "slug" => "genial-11-vp",
            "name" => "Genial 11 VP"
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('translation_books');
    }
};
