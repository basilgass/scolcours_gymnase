<?php

namespace App\Console\Commands;

use App\Models\Illustration;
use App\Models\Question;
use Illuminate\Console\Command;
use Str;

class PidrawUpdate extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'pidraw:update';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Update the Illustration code';

	/**
	 * Execute the console command.
	 *
	 * @return int
	 */
	public function handle()
	{
		$illustrations = Illustration::all();

		foreach ($illustrations as $illustration) {
			// Replace all : to =
			$code = Str::of($illustration->code)->replaceMatches(
				'/(w|fill|tex|label|move|btn|riemann|drag)(:)/',
				'$1='
			);

			$code = Str::of($code)->replaceMatches(
				'/(biss)/',
				'bis'
			);
			// Replace all Tex with position modifiers (domain to XY)
			$code = $code->replaceMatches(
				'/([tl|tc|tr|ml|mc|mr|bl|bc|br]\/[-0-9.]+)(:)/',
				'$1;'
			);
			// If it finishes with ;, add the zero (end of a line)
			$code = $code->replaceMatches(
				'/;\n/',
				';0\n'
			);
			// If it finishes with ;, add the zero (end of a string)
			$code = $code->replaceMatches(
				'/;$/',
				';0'
			);

			if (str_contains($code, ':')) {
				$this->info($code);
			}

			// Update the paramtets
			$parameters = $illustration->parameters;

			if ($illustration->parameters === '' || $illustration->parameters === null) {
				$parameters = "grid,axis,x=-5:5,y=-5:5";
			}
			$illustration->update([
				"code" => $code,
				"parameters" => $parameters
			]);
		}

		// foreach ($questions as $question) {
		// 	if (Str::startsWith($question["keyboard"], "#")) {
		// 		$question->update([
		// 			"keyboard" => substr($question["keyboard"], 1),
		// 			"checker" => null
		// 		]);
		// 	} else {
		// 		// It's a basic keyboard.
		// 		$keybrd = explode("|", $question["keyboard"]);
		// 		$checker = explode("|", $question["checker"]);
		// 		$params = explode("\n\n", $question['parameteres']);

		// 		$new_parameters = [];
		// 		foreach ($keybrd as $i => $kbrd) {
		// 			$p = $kbrd;
		// 			if (array_key_exists($i, $checker) and $checker[$i] !== null and $checker[$i] !== "") {
		// 				$p = $p . "@" . $checker[$i];
		// 			}
		// 			if (array_key_exists($i, $params) && $params[$i] !== null and $params[$i] !== "") {
		// 				$p = $p . "\n" . $params[$i];
		// 			}
		// 			$new_parameters[] = $p;
		// 		}

		// 		$question->update([
		// 			"keyboard" => null,
		// 			"checker" => null,
		// 			"parameters" => implode("\n\n", $new_parameters)
		// 		]);
		// 	}
		// }

		return Command::SUCCESS;
	}
}
