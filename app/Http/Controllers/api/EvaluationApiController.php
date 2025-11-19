<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvaluationRessource;
use App\Models\Evaluation;
use Illuminate\Http\Request;

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

	public function update(Request $request, $id)
	{
	}

	public function destroy($id)
	{
	}
}
