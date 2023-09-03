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
            $table->string('slug')
				->nullable()
				->unique()
				->after('theme_id');
        });

		// Copy all titles to slug
		DB::table('generators')->update([
			'slug'=>DB::raw('title')
		]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('generators', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
