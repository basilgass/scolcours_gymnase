<?php
	
	namespace App\Http\Controllers;
	
	use App\Models\Theme;
	use Inertia\Inertia;
	
	class QuizzController extends Controller
	{
		public function quizz(string $slug)
		{
			return Inertia::render('Quizz', [
				"theme" => Theme::where("slug", "=", "algebre")->first(),
				"quizz" => $slug,
			]);
		}
	}