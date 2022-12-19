<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

class questionOrder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:questions-order';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the questions ordering';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
		$posts = Post::all();
		foreach ($posts as $post){
			foreach ($post->questions as $index=>$question){
				$question->update(['order'=>$index+1]);
			}
		}
        return Command::SUCCESS;
    }
}
