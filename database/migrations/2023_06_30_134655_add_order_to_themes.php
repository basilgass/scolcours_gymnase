<?php

use App\Models\Theme;
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
        Schema::table('themes', function (Blueprint $table) {
            $table->integer('order')->after('title')->default(1);
        });

		// Add the new numeric item
		Theme::create([
			"slug"=>"numeric",
			"title"=>"numérique",
			"order"=>1,
			"color"=>"bg-lime-500",
			"icon"=>"123",
			"enabled"=>1
		]);

		// update all icon to be the full-class
		foreach (Theme::all() as $i=>$theme){
			$theme->icon = "bi bi-".$theme->icon;
			$theme->order = $theme->id<=7 ? $theme->id+1: 1;
			$theme->save();
		}

		// Reset the cache.
		Cache::flush();

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
		$theme = Theme::where('slug', 'numeric')->first();
		$theme?->delete();

        Schema::table('themes', function (Blueprint $table) {
			$table->dropColumn('order');
        });
    }
};
