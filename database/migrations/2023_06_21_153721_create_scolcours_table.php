<?php

use App\Models\Scolcours;
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
        Schema::create('scolcours', function (Blueprint $table) {
            $table->id();
			$table->string('title')->default('Gymnase');
            $table->timestamps();
        });

		// Ajoute un élément de base.
		$scolcours = new Scolcours;
		$scolcours->title = 'Gymnase';
		$scolcours->save();

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scolcours');
    }
};
