<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('translation_books', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('name');
            $table->string('cover')->default("");
            $table->foreignId('translation_language_id')->constrained('translation_languages')->cascadeOnDelete();
            $table->timestamps();
        });


        // Create the books.
        $itId = DB::table('translation_languages')->where('slug', 'italiano')->value('id');
        $enId = DB::table('translation_languages')->where('slug', 'english')->value('id');
        $deId = DB::table('translation_languages')->where('slug', 'deutsch')->value('id');

        $now = now();
        DB::table('translation_books')->insert([
            ['slug' => 'npi-1',        'name' => 'Nuovissimo progetto italiano 1',          'cover' => '/images/npi1_cover.jpg', 'translation_language_id' => $itId, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'npi-2',        'name' => 'Nuovissimo progetto italiano 2',          'cover' => '/images/npi2_cover.jpg', 'translation_language_id' => $itId, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'libro-2',      'name' => 'Libro 2',                                 'cover' => '',                       'translation_language_id' => $itId, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'life',         'name' => 'Life',                                    'cover' => '',                       'translation_language_id' => $enId, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'nathan',       'name' => 'Le vocabulaire anglais (Nathan)',          'cover' => '/images/nathan_cover.jpg','translation_language_id' => $enId, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'nathan-extra', 'name' => 'Le Vocabulaire anglais (Nathan) - compléments', 'cover' => '',               'translation_language_id' => $enId, 'created_at' => $now, 'updated_at' => $now],
            ['slug' => 'genial-11-vp', 'name' => 'Genial 11 VP',                            'cover' => '',                       'translation_language_id' => $deId, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('translation_books');
    }
};
