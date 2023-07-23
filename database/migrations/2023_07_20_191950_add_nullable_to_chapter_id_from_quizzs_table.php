<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNullableToChapterIdFromQuizzsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('quizzs', function (Blueprint $table) {
			$table->unsignedBigInteger('chapter_id')->nullable()->change();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('quizzs', function (Blueprint $table) {
			$table->unsignedBigInteger('chapter_id')->nullable(false)->change();
		});
	}
}
