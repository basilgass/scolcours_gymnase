<?php

use App\Models\TranslationUnit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
			$table->foreignIdFor(TranslationUnit::class)->constrained()->cascadeOnDelete();
			$table->string('foreign');
			$table->string('fr');
			$table->text('definition')->nullable();
			$table->text('examples')->nullable();
            $table->timestamps();

			$table->unique(['translation_unit_id', 'foreign', 'fr']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('translations');
    }
};
