<?php

namespace App\Console\Commands;

use App\Models\Question;
use Illuminate\Console\Command;
use Str;

class keyboardUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'keyboard:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the keyboards name, checker and parameters.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
		$questions = Question::all();
		foreach ($questions as $question){
			if(Str::startsWith($question["keyboard"], "#")){
				$question->update([
					"keyboard"=>substr($question["keyboard"], 1),
					"checker"=>null
				]);
			}else{
				// It's a basic keyboard.
				$keybrd = explode("|", $question["keyboard"]);
				$checker = explode("|", $question["checker"]);
				$params = explode("\n\n", $question['parameteres']);

				$new_parameters = [];
				foreach ($keybrd as $i=>$kbrd){
					$p = $kbrd;
					if(array_key_exists($i, $checker) and $checker[$i]!==null and $checker[$i]!==""){
						$p = $p."@".$checker[$i];
					}
					if(array_key_exists($i, $params) && $params[$i]!==null and $params[$i]!==""){
						$p = $p."\n".$params[$i];
					}
					$new_parameters[] = $p;
				}

				$question->update([
					"keyboard"=>null,
					"checker"=>null,
					"parameters"=>implode("\n\n", $new_parameters)
				]);

			}
		}

        return Command::SUCCESS;
    }
}
