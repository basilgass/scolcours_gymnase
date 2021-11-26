<?php
	
	namespace App\Http\Controllers;
	
	use App\Models\Theme;
	use Inertia\Inertia;
	
	class QuizzController extends Controller
	{
		public function index()
		{
			return Inertia::render('Quizz/index',[
				'quizzes' => ['trinome', 'produits-remarquables']
			]);
		}
		public function show(string $slug)
		{
			return Inertia::render('Quizz/Quizz', [
				"theme" => Theme::where("slug", "=", "algebre")->first(),
				"quizz" => $slug,
			]);
		}
	}