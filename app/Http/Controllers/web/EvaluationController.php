<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvaluationResource;
use App\Models\Evaluation;
use Inertia\Inertia;

class EvaluationController extends Controller
{
	public function index()
	{
		$user = \Auth::user();

		$evaluations = $user
			? $user->teamEvaluationsQuery()->get()
			: [];

		return Inertia::render('Evaluations/EvaluationIndex',
			[
				'evaluations' => EvaluationResource::collection($evaluations),
			]
		);
	}

	public function show(Evaluation $evaluation)
	{
		return Inertia::render('Evaluations/EvaluationShow',
			[
				'evaluation' => EvaluationResource::make($evaluation),
			]
		);
	}
}
