<?php

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
		Schema::table('challenges', function (Blueprint $table) {
			$table->renameColumn('checker', 'parameters');
		});
        Schema::table('challenges', function (Blueprint $table) {
			$table->string('keyboard')->default(null)->nullable()->change();
			$table->text('parameters')->default(null)->nullable()->after('keyboard')->change();
        });

		DB::statement("alter table challenges modify `parameters` text null after keyboard;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('challenges', function (Blueprint $table) {
			$table->renameColumn('parameters', 'checker');
        });
		Schema::table('challenges', function (Blueprint $table) {
			$table->string('keyboard')->change();
			$table->string('checker')->default('')->change();
		});
    }
};
