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
        Schema::table('generators', function (Blueprint $table) {
			$table->text('template')->after('body')->nullable();
        });

		$challenges = \App\Models\Challenge::all();
		foreach ($challenges as $challenge) {
			foreach($challenge->generators as $generator){
				$generator->template = $challenge->output;
				$generator->keyboard = $challenge->keyboard ?? "exact";
				$generator->save();
			}
		}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('generators', function (Blueprint $table) {
            $table->dropColumn('template');
        });
    }
};
