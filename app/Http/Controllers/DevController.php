<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DevController extends Controller
{
	public function index()
	{
// Get all devs.
		$devPages = collect(Storage::disk('devs')->files())->map(function ($p) {
			return pathinfo($p)['filename'];
		});

		return Inertia::render("Devs/DevIndex", [
			'pages' => $devPages
		]);
	}

	public function show(string $page)
	{
		return Inertia::render('Devs/DevShow', [
			"dev" => $page
		]);
	}
}
