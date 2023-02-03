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
		Schema::table('illustrations', function (Blueprint $table) {
			$table->renameColumn('title', 'value');
		});

		Schema::table('illustrations', function (Blueprint $table) {
			$table->string('title')->nullable()->after('order');
		});

	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('illustrations', function (Blueprint $table) {
			$table->dropColumn('title');
		});

		Schema::table('illustrations', function (Blueprint $table) {
			$table->renameColumn('value', 'title');
		});
	}
};
