<?php

namespace App\Http\Controllers;

use App\Models\Generator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeneratorController extends Controller
{
	public function index()
	{
		return Inertia::render("Generators/GeneratorIndex", [
			"generators" => Generator::all()
		]);
	}
	public function edit(Generator $generator)
	{
		return Inertia::render("Generators/GeneratorEdit",
			[
				"theme"     => $generator->theme,
				"generator" => $generator
			]
		);
	}

	public function update(Generator $generator, Request $request)
	{
		$validation = $request->validate([
			'title'    => ['string', 'nullable'],
			'slug'     => ['string', 'min:3'],
			'body'     => ['string', 'nullable'],
			'template' => ['string', 'nullable'],
			'keyboard' => ['string'],
			'code'     => ['string'],
		]);

		if($validation['title']===null){
			$validation['title'] = "";
		}

		if($validation['body']===null){
			$validation['body'] = "";
		}

		if($validation['template']===null){
			$validation['template'] = "";
		}

		$generator->update($validation);

		return $validation;
	}

	public function destroy(Generator $generator)
	{
		$generator->delete();
	}
}
