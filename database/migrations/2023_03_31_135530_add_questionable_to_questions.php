<?php

use App\Models\Post;
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
			$table->morphs('questionable');
        });

		// Update everything
		$questions = Question::all();
		foreach ($questions as $question) {
			$question->update([
				"questionable_type" => "App\Models\Post",
				"questionable_id" => $question->post_id
			]);
		}

		Schema::table('questions', function (Blueprint $table) {
			$table->dropForeign(["post_id"]);
		});
		Schema::table('questions', function (Blueprint $table) {
			$table->dropColumn(["post_id"]);
		});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
		Schema::table('questions', function (Blueprint $table) {
			$table->foreignIdFor(Post::class)->constrained()->cascadeOnDelete();
		});

		// Update everything
		$questions = Question::all();
		foreach ($questions as $question) {
			if($question->questionable_type==='App\Models\Post') {
				$question->update([
					"post_id" => $question->questionable_id,
				]);
			}
		}

		Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['questionable_type', 'questionable_id']);
        });
    }
};
