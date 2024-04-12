<?php

namespace App\Http\Controllers;

use App\Models\Translation;
use App\Models\TranslationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TranslationController extends Controller
{
	public function index($language)
	{
		return Inertia::render("languages/LanguageIndex", [
			"language" => $language
		]);
	}

	public function show($language, $game)
	{
		$code = "";
		if ($language === 'italiano') {
			$code = "it";
		}
		if ($language === 'english') {
			$code = "en";
		}
        if ($language === 'deutsch') {
            $code = "de";
        }

		$units = TranslationUnit::where('language', $code)->get();

		return Inertia::render("languages/LanguageShow", [
			"code" => $code,
			"language" => $language,
			"units" => $units,
			"game" => $game
		]);
	}

	public function import()
	{
		return Inertia::render("languages/LanguageImport");
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
			"language" => $validation["language"],
			"unit" => $validation["unit"]
		], [
			"title" => $validation['title'] ?: ''
		]);

		foreach ($validation['translations'] as $translation) {
			$unit->translations()->updateOrCreate(
				$translation
			);
		}

		return true;
	}

	public function fetchWords(TranslationUnit $unit)
	{
		return $unit->translations;
	}

	public function updateTranslation(Request $request, Translation $translation)
	{
		$validation = $request->validate([
			"fr" => ["string", "min:1", "required"],
			"foreign" => ["string", "min:1", "required"],
		]);


		$translation->update($validation);
		$translation->save();
		// update the word
		return $translation;
	}
}
