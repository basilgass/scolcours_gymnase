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
            "books"    => $language->books,
            "game"     => $game
        ]);
    }

    public function import()
    {
        return Inertia::render("languages/LanguageImport");
    }

    public function createBook(Request $request)
    {
        $validation = $request->validate([
            "language" => ['string', 'exists:App\Models\TranslationLanguage,slug'],
            "slug"     => ['string', 'required', 'min:2', 'unique:App\Models\TranslationBook,slug'],
            "title"    => ['string', 'required', 'min:2']
        ]);

        $lang = TranslationLanguage::where('slug', $validation[ 'language' ])->first();

        if ($lang) {
            $book = $lang->books()->create([
                "slug"  => $validation[ 'slug' ],
                "title" => $validation[ 'title' ],
            ]);

            return $book;
        }

        return false;
    }

    public function create(Request $request)
    {

        $validation = $request->validate([
            'language'               => ['string', 'min:2'],
            'book'                   => ['required', 'exists:App\Models\TranslationBook,id'],
            'title'                  => ['required', 'min:2'],
            "translations"           => ['array'],
            "translations.*.fr"      => ['string'],
            "translations.*.foreign" => ['string'],
        ]);

        // Make sur the unit / language exists.
        $unit = TranslationUnit::updateOrCreate([
                "language"            => $validation[ "language" ],
                "translation_book_id" => $validation[ "book" ],
                "title"               => $validation[ "title" ]
            ]
        );

        foreach ($validation[ 'translations' ] as $translation) {
            $unit->translations()->updateOrCreate(
                $translation
            );
        }

        return true;
    }

    public function fetchBooks(TranslationLanguage $language)
    {
        return $language->books;
    }

    public function fetchUnits(TranslationBook $book)
    {
        return $book->units;
    }

    public function fetchWords(TranslationUnit $unit)
    {
        return $unit->translations;
    }

    public function updateTranslation(Request $request, Translation $translation)
    {
        $validation = $request->validate([
            "fr"      => ["string", "min:1", "required"],
            "foreign" => ["string", "min:1", "required"],
        ]);


        $translation->update($validation);
        $translation->save();
        // update the word
        return $translation;
    }
}
