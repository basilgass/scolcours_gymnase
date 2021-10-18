<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemesController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Theme $theme)
    {
        return Inertia::render('Theme', [
            "theme" => $theme,
            "chapters" => $theme->chapters()->get(['slug', 'title', 'body'])
        ]);
    }

    public function edit(Theme $theme)
    {
        //
    }

    public function update(Request $request, Theme $theme)
    {
        //
    }

    public function destroy(Theme $theme)
    {
        //
    }
}
