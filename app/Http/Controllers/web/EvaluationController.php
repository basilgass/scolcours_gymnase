<?php
// TODO: Evalaution doit être travailler de A-Z, avec les resources, etc...
namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvaluationRessource;
use App\Models\Evaluation;
use Inertia\Inertia;

class EvaluationController extends Controller
{
	public function index()
	{
		//TODO: les évaluations doivnet être liée à un cours + team
		$evaluations = Evaluation::all();
		return Inertia::render('Evaluations/EvaluationIndex',
			[
				'evaluations' => EvaluationRessource::collection($evaluations),
			]
		);
	}

	public function show(Evaluation $evaluation)
	{
		return Inertia::render('Evaluations/EvaluationShow',
			[
				'evaluation' => EvaluationRessource::make($evaluation),
			]
		);
	}
}
