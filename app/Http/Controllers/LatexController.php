<?php

namespace App\Http\Controllers;

use App\Models\LatexPdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Ismaelw\LaraTeX\LaraTeX;

class LatexController extends Controller
{
	public function latex(Request $data) // POST request
	{
		// TODO: Faire un formrequest.
		$validated = $data->validate([
			'template'  => ['required', 'string', 'in:latex.questions,latex.standalone,latex.simple'],
			'title'     => ['required', 'string'],
			'slug'      => ['required', 'string'],
			'theme'     => ['string', 'nullable'],
			'questions' => ['array', 'nullable'],
			'content'   => ['string', 'nullable'],
		]);

		// Check if folder exists.
		$theme = $validated["theme"] ?? 'divers';
		$folder = "pdf/{$theme}/{$validated["slug"]}";
		if (!Storage::disk('public')->exists($folder)) {
			Storage::disk('public')->makeDirectory($folder);
		}

		// Generate a filename
		$fileID = Str::random(4);

		// Check if it is already in the database.
		while (LatexPdf::whereSlug($fileID)->first()) {
			$fileID = Str::random(4);
		}

		$filename = $fileID . '.pdf';
		$fullpath = $folder . '/' . $filename;

		// TODO: validate the questions to make sure it does not contain malicious code
		$content = $validated['content'] ?? '';
		if ($content !== strip_tags($content)) {
			$content = e($content);
		}

		$laraTeX = (new LaraTeX($validated["template"]))
			->with([
				'title'     => $validated["title"],
				'questions' => $validated["questions"] ?? [],
				'content'   => $content,
				'slug'      => '/download/' . $fileID
			]);

		$result = $laraTeX->savePdf(
			Storage::disk('public')->path($fullpath)
		);

		if ($result) {
			// Save it to the database.
			$pdf = LatexPdf::create([
				'slug' => $fileID,
				'name' => $validated["slug"] . '.pdf',
				'url'  => $fullpath
			]);

			$pdf->tex = $laraTeX->render();
			return $pdf;
		}

		return false;
	}

	public function download(string $fileID) // Download file name from public/pdf
	{
		$pdf = LatexPdf::whereSlug($fileID)->first();

		if ($pdf) {
			return Storage::disk('public')
			              ->download(
				              $pdf->url,
				              $pdf->name
			              );
		}
		return false;
	}

	public function links()
	{
		return LatexPdf::all();
	}

	public function dry()
	{
		return (new LaraTeX)->dryRun();
	}
}
