<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('illustrations', function (Blueprint $table) {
			$table->string('footer')->after('title')->nullable();
		});

		DB::table('illustrations')
		  ->whereNotNull('title')
		  ->update([
			  'footer' => DB::raw('title'),
			  'title'  => null
		  ]);
	}
	
	public function down(): void
	{
		Schema::table('illustrations', function (Blueprint $table) {
			$table->dropColumn('footer');
		});
	}
};
