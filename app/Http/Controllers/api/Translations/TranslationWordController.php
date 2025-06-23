<?php

namespace App\Http\Controllers\api\Translations;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use App\Models\TranslationUnit;
use Illuminate\Http\Request;

class TranslationWordController extends Controller
{
	public function index(TranslationUnit $unit)
	{
		return $unit->translations;
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'language'               => ['string', 'min:2'],
			'book'                   => ['required', 'exists:App\Models\TranslationBook,id'],
			'title'                  => ['required', 'min:2'],
			"translations"           => ['array'],
			"translations.*.fr"      => ['string'],
			"translations.*.foreign" => ['string'],
		]);

		// Make sur the unit / language exists.
		$unit = TranslationUnit::updateOrCreate([
				"language"            => $validated["language"],
				"translation_book_id" => $validated["book"],
				"title"               => $validated["title"]
			]
		);

		foreach ($validated['translations'] as $translation) {
			$unit->translations()->updateOrCreate(
				$translation
			);
		}

		return true;

	}

	public function show($id)
	{
	}

	public function update(Request $request, $id)
	{
		$validated = $request->validate([
			"fr"      => ["string", "min:1", "required"],
			"foreign" => ["string", "min:1", "required"],
		]);

		$translation = Translation::findOrFail($id);

		$translation->update($validated);
		$translation->save();
		// update the word
		return $translation;

	}

	public function destroy($id)
	{
	}
}
