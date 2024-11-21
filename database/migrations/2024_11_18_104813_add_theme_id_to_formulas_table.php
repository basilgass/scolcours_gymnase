<?php

use App\Models\Formula;
use App\Models\Theme;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('formulas', function (Blueprint $table) {
            $table->foreignIdFor(Theme::class)->after('id')->nullable()->constrained()->cascadeOnDelete();
        });


        // Populate the theme_id column based on the chapter's theme
        Formula::all()->each(function (Formula $formula){
            $chapter = $formula->chapters()->first();

            if ($chapter) {
                $formula->update([
                    "theme_id"=>$chapter->theme_id
                ]);
            }
        });
//        DB::table('formulas')->get()->each(function (Formula $formula) {
//            $chapter = $formula->chapters()->first();
//            //DB::table('chapters')->where('id', $formula->chapter->id)->first();
//            if ($chapter) {
//                DB::table('formulas')->where('id', $formula->id)->update(['theme_id' => $chapter->theme_id]);
//            }
//        });
    }

    public function down(): void
    {
        Schema::table('formulas', function (Blueprint $table) {
            $table->dropConstrainedForeignId('theme_id');
        });
    }
};
