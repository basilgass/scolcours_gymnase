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
		// Affichage de tous les générateurs, utilisé dans l'admin.
		return Inertia::render("Generators/GeneratorIndex", [
			"generators" => GeneratorResource::collection(Generator::all())
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
		// Affichage de tous les générateurs, utilisé dans l'admin.
		return Inertia::render("Generators/admin/AdminGenerator", [
			"generators" => GeneratorResource::collection(Generator::all())
		]);
	}
}
