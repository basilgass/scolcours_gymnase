<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class answerStack extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'answer-stack';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
		// supprimer toutes les réponses qui ne sont "justes"
		// modifier la table question_user.attempts pour le mettre en auto increment.
		
        // tous les utilisateurs.
		$users = User::all();

		foreach ($users as $user) {
			// toutes les questions.
			$numberOfAnswers = count($user->questions);
			$numberOfUniqueQuestions = count($user->questions->unique('pivot.question_id'));

			print $user->name.'('.$user->id.')'.', #answers='. $numberOfUniqueQuestions . "/" .$numberOfAnswers . PHP_EOL;

		}
    }
}
