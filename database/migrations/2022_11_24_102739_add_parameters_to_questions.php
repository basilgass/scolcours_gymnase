<?php

use App\Models\Question;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('questions', function (Blueprint $table) {
			$table->text('parameters')->after('keyboard')->nullable();
		});

		$questions = Question::all();
		foreach ($questions as $question) {
			$data = explode("@", $question->keyboard);
			$kbrd = $data[0];
			$params = $data[1] ?? null;

			$question->update([
				"keyboard" => $kbrd,
				"parameters" => $params
			]);
		}
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		$questions = Question::all();
		foreach ($questions as $question) {
			$question->update([
				"keyboard" => $question->keyboard . ($question->parameters?'@'.$question->parameters:'')
			]);
		}

		Schema::table('questions', function (Blueprint $table) {
			$table->dropColumn('parameters');
		});
	}
};
