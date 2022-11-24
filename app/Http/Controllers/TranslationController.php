<?php

namespace App\Http\Controllers;

use App\Models\TranslationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class TranslationController extends Controller
{
	public function index($language)
	{
		return Inertia::render("languages/LanguageIndex.vue", [
			"language"=>$language
		]);
	}

	public function show($language, $game)
	{
		$code = "";
		if($language==='italiano'){$code="it";}
		if($language==='english'){$code="en";}

		$units = TranslationUnit::where('language', $code)->get();

		return Inertia::render("languages/Language".Str::title($game).".vue", [
			"code"=>$code,
			"language"=>$language,
			"units"=>$units
		]);
	}
	public function import()
	{
		return Inertia::render("languages/LanguageImport.vue");
	}

	public function create(Request $request)
	{

		$validation = $request->validate([
			'language' => ['string', 'min:2'],
			'unit' => ['required'],
			'title' => ["nullable"],
			"translations" => ['array'],
			"translations.*.fr" => ['string'],
			"translations.*.foreign" => ['string'],
			"translations.*.definition" => ['string', 'nullable'],
			"translations.*.examples" => ['string', "nullable"],
		]);

		// Make sur the unit / language exists.
		$unit = TranslationUnit::updateOrCreate([
			"language"=>$validation["language"],
			"unit"=>$validation["unit"]
		], [
			"title"=> $validation['title']?:''
		]);

		foreach ($validation['translations'] as $translation) {
			$unit->translations()->create($translation);
		}

		return true;
	}

	public function fetchWords(TranslationUnit $unit)
	{
		return $unit->translations;
	}
}
