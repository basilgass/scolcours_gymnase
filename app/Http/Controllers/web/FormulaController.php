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
		$chapter = $formula->chapters()->first();

		// Formule orpheline (rattachée à aucun chapitre) : repli sur la liste.
		if ($chapter === null) {
			return redirect(route('formulas.index'));
		}

		// 301 (permanent) : la formule n'a pas de page propre, sa version
		// canonique est la page du chapitre. Redirection directe (pas via
		// chapters.show) pour éviter une double redirection.
		return redirect(route('themes.chapters.show', [
			"theme"   => $chapter->theme,
			"chapter" => $chapter,
		]), 301);
	}

}
