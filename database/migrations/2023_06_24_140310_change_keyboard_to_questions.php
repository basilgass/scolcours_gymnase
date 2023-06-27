<?php

use App\Models\Question;
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
        Schema::table('questions', function (Blueprint $table) {
            $table->text('keyboard')->default("")->change();
        });


		$questions = Question::all();
		foreach ($questions as $question) {
			if($question->keyboard==="" or $question->keyboard===null){
				$question->keyboard = $question->parameters;
			}else{
				$question->keyboard .= PHP_EOL . $question->parameters;
			}
			$question->save();
		}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            //
        });
    }
};
