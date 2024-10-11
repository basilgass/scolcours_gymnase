<?php

use App\Models\TranslationLanguage;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('translation_languages', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('name');
            $table->string('determinants');
            $table->timestamps();
        });

        // Load the default values.
        TranslationLanguage::create([
            'slug' => 'italiano',
            'name'=> 'italiano',
            'determinants' => "il,la,le,lo,i,l',gli"
        ]);
        TranslationLanguage::create([
            'slug' => 'english',
            'name'=> 'english',
            'determinants' => 'a,an,the,to'
        ]);
        TranslationLanguage::create([
            'slug' => 'deutsch',
            'name'=> 'deutsch',
            'determinants' => 'der,die,das'
        ]);
        TranslationLanguage::create([
            'slug' => 'espanol',
            'name'=> 'español',
            'determinants' => ''
        ]);

    }

    public function down(): void
    {
        Schema::dropIfExists('translation_languages');
    }
};
