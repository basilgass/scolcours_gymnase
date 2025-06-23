<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGeneratorRequest;
use App\Http\Requests\UpdateGeneratorRequest;
use App\Http\Resources\GeneratorResource;
use App\Models\Generator;
use Illuminate\Http\Request;

class GeneratorApiController extends Controller
{
	public function index(Request $request)
	{
		$search = $request->query('search');

		$query = Generator::query();

		if ($search) {
			$query->where('title', 'like', '%' . $search . '%');
		}

		return $query->get();
	}

	public function show(Generator $generator)
	{
		// Affichage de tous les générateurs, utilisé dans l'admin.
		return GeneratorResource::make($generator);
	}

	public function store(StoreGeneratorRequest $request)
	{
		$generator = Generator::create($request->validated());
		return $generator->id;
	}


	public function update(Generator $generator, UpdateGeneratorRequest $request)
	{
		$generator->update($request->validated());

		return $generator->refresh();
	}

	public function destroy(Generator $generator)
	{
		$generator->delete();
	}

	public function fetch(Generator $generator)
	{
		// API - to get the generator from it's id.
		return $generator;
	}
}
