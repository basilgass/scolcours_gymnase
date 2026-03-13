<?php

namespace App\Http\Controllers\web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvaluationAdminResource;
use App\Http\Resources\EvaluationResource;
use App\Http\Resources\TeamResource;
use App\Models\Evaluation;
use App\Models\Team;
use Inertia\Inertia;

class EvaluationAdminController extends Controller
{
	public function index()
	{
		$evaluations = Evaluation::all();

		return Inertia::render('Evaluations/admin/AdminEvaluation',
			[
				'evaluations' => EvaluationAdminResource::collection($evaluations),
				'teams'       => TeamResource::collection(Team::active()->get()),
			]
		);
	}

	public function show(Evaluation $evaluation)
	{
		return Inertia::render('Evaluations/admin/AdminEvaluationShow',
			[
				'evaluation' => EvaluationAdminResource::make($evaluation),
			]
		);
	}

	public function edit(Evaluation $evaluation)
	{
		return Inertia::render('Evaluations/EvaluationEdit',
			[
				'evaluation' => EvaluationResource::make($evaluation),
			]
		);
	}
}
