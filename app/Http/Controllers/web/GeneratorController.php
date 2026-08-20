<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\GeneratorResource;
use App\Models\Generator;
use Inertia\Inertia;

class GeneratorController extends Controller
{
	public function index()
	{
		// Liste publique des générateurs. Les non-admins ne voient que les
		// générateurs actifs ; un générateur inactif reste accessible par
		// lien direct (slug) ou via un challenge/évaluation.
		$query = Generator::query();

		if (!auth()->user()?->admin) {
			$query->where('active', true);
		}

		return Inertia::render("Generators/GeneratorIndex", [
			"generators" => GeneratorResource::collection($query->get())
		]);
	}

	public function show(Generator $generator)
	{
		return Inertia::render("Generators/GeneratorShow",
			[
				"generator" => GeneratorResource::make($generator),
			]
		);
	}

	public function edit(Generator $generator)
	{
		return Inertia::render("Generators/GeneratorEdit",
			[
				"generator"  => $generator,
				"challenges" => ChallengeResource::collection(
					$generator->challengeLevels()->with('challenge')->get()->pluck('challenge')->unique('id')->values()
				),
			]
		);
	}

	public function admin()
	{
		$generators = Generator::orderBy('theme_id')
		                       ->orderBy('slug')
		                       ->get();

		// Affichage de tous les générateurs, utilisé dans l'admin.
		return Inertia::render("Generators/admin/AdminGenerator", [
			"generators" => GeneratorResource::collection($generators)
		]);
	}
}
