<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormulaResource;
use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormulaController extends Controller
{
	public function index()
	{
		$formulas = Formula::with("chapter")->get();

		return Inertia::render('Formulas/FormulaIndex', [
			'formulas' => FormulaResource::collection($formulas)
		]);
	}

	public function show(Formula $formula)
	{

	}

	public function ChaptersFormulas(Chapter $chapter)
	{
		$formulas = Formula::with("chapter")
		                   ->where('chapter_id', '=', $chapter->id)->get();

		return Inertia::render('Formulas/FormulaIndex', [
			'formulas' => FormulaResource::collection($formulas)
		]);
	}
}
