<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Models\TranslationLanguage;
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

}
