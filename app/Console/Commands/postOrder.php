<?php

namespace App\Console\Commands;

use App\Models\Chapter;
use Illuminate\Console\Command;

class postOrder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:order';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the posts ordering';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
		$chapters = Chapter::all();
		foreach ($chapters as $chapter){
			foreach ($chapter->posts as $index=>$post){
				$post->update(['order'=>$index+1]);
			}
		}
        return Command::SUCCESS;
    }
}
