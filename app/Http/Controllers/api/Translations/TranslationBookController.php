<?php

namespace App\Http\Controllers\api\Translations;

use App\Http\Controllers\Controller;
use App\Models\TranslationLanguage;
use Illuminate\Http\Request;

class TranslationBookController extends Controller
{
	public function index(TranslationLanguage $language)
	{
		return $language->books;
	}

	public function store(TranslationLanguage $language, Request $request)
	{
		$validated = $request->validate([
			"slug"  => ['string', 'required', 'min:2', 'unique:App\Models\TranslationBook,slug'],
			"title" => ['string', 'required', 'min:2']
		]);

		return $language->books()->create([
			"slug"  => $validated['slug'],
			"title" => $validated['title'],
		]);
	}

	public function show($id)
	{
	}

	public function update(Request $request, $id)
	{
	}

	public function destroy($id)
	{
	}
}
