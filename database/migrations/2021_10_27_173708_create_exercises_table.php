<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExercisesTable extends Migration
{
	public function up()
	{
		Schema::create('exercises', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
			//
			$table->string('title')->default('');
			$table->text('body');
			$table->string('answer')->default('');
			$table->text('explanation')->nullable();
			//
			$table->timestamps();
		});
	}

	public function down()
	{
		Schema::dropIfExists('exercises');
	}
}
