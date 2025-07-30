<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormulaResource;
use App\Models\Chapter;
use App\Models\Formula;
use Inertia\Inertia;

class FormulaController extends Controller
{
	public function index()
	{
		return Inertia::render('Formulas/FormulaIndex');
	}

	public function show(Formula $formula)
	{
		return redirect()->route('chapters.show', [
			"chapter" => $formula->chapter
		]);
	}

}
