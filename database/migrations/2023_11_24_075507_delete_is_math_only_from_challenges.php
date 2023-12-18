<?php

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
        Schema::table('challenges', function (Blueprint $table) {
			$table->dropColumn('generator');
			$table->dropColumn('isMathOnly');
			$table->dropColumn('output');
			$table->dropColumn('keyboard');
			$table->dropColumn('parameters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            // No revert :(
        });
    }
};
