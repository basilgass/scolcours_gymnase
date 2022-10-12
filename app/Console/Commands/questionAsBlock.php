<?php

namespace App\Console\Commands;

use App\Models\Question;
use Illuminate\Console\Command;

class questionAsBlock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'questionasblocks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all questions body to a block version';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
		$questions = Question::all();
		foreach ($questions as $question){
			if($question->blocks()->where('blockable_id', $question->id)->count()>0){
				$this->info($question->id . ' already exist as block');
			}else {
				$this->info('Updating question: ' . $question->id);
				$question->blocks()->create([
					'title' => '',
					'body' => $question->body
				]);
			}
		}
        return Command::SUCCESS;
    }
}
