<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('translation_units', function (Blueprint $table) {
			$table->id();
			$table->string('language');
			$table->string('unit');
			$table->string('title')->default('');
			$table->timestamps();

			$table->unique(['language', 'unit']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('translation_units');
	}
};
