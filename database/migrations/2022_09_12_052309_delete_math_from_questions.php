<?php

use App\Models\Question;
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
		// Update all columns from questions to wrap with math.
		$questions = Question::where('math', 1)->get();

		foreach ($questions as $question){
			$question->update([
				'body'=>'\\['.$question->body.(Str::endsWith($question->body, '=')?'$a':'').'\\]',
			]);
		}

        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('math');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
			$table->boolean('math')->after('post_id')->default(1);
        });
    }
};
