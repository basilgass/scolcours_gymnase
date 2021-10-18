<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChaptersController extends Controller
{
    public function index()
    {
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Chapter $chapter)
    {
        return Inertia::render(
            "Chapter",
            [
                "chapter" => $chapter
            ]
        );
    }

    public function edit(Chapter $chapter)
    {
        //
    }

    public function update(Request $request, Chapter $chapter)
    {
        //
    }

    public function destroy(Chapter $chapter)
    {
        //
    }
}
