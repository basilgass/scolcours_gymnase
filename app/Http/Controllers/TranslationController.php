<?php

namespace App\Http\Controllers;

use App\Models\Translation;
use App\Models\TranslationBook;
use App\Models\TranslationLanguage;
use App\Models\TranslationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TranslationController extends Controller
{
	public function index(TranslationLanguage $language)
	{
		return Inertia::render("languages/LanguageIndex", [
			"language" => $language
		]);
	}

	public function show(TranslationLanguage $language, $game)
	{
//		$units = TranslationUnit::where('language', $code)->get();

		return Inertia::render("languages/LanguageShow", [
			"language" => $language,
            "books" => $language->books,
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

    public function fetchUnits(TranslationBook $book) {
        return $book->units;
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
