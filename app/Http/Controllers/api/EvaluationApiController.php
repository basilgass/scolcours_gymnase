<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvaluationRessource;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EvaluationApiController extends Controller
{
	public function index()
	{

	}

	public function show($id)
	{
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			"slug"  => ['required', 'string', 'unique:App\Models\Evaluation,slug'],
			"title" => ['required', 'string'],
		]);

		$validated['body'] = "";
		$evaluation = Evaluation::create($validated);

		return EvaluationRessource::make($evaluation);
	}

	public function update(Request $request, Evaluation $evaluation)
	{

		$validated = $request->validate([
			"title"        => ['required', 'string'],
			"slug"         => ['sometimes', 'string', Rule::unique(Evaluation::class, 'slug')->ignore($evaluation->id)],
			"body"         => ['required', 'string'],
			"auto_control" => ['required', 'boolean'],
		]);

		// On contrôle que si il y a un nouveau slug, il doit être unique
		$evaluation->update($validated);

		return response()->noContent();
	}

	public function destroy($id)
	{
	}
}
