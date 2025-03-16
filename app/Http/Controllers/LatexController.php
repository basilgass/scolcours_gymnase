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
		$validation = $data->validate([
										  'template'  => ['required', 'string', 'in:latex.questions,latex.standalone,latex.simple'],
										  'title'     => 'required|string',
										  'content'   => 'string',
										  'questions' => 'array',
										  'slug'      => 'required|string',
										  'theme'     => 'string',
									  ]);

		// Check if folder exists.
		$theme = $validation["theme"] ?? 'divers';
		$folder = "pdf/{$theme}/{$validation["slug"]}";
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

		// control that the content does not contain any malicious code
		// TODO: validate the questions to make sure it does not contain malicious code
//		$questions = $validation['questions'] ?? [];
//		if($validation['questions'] !== strip_tags($validation['questions'])){
//			$questions = e($validation['questions']);
//		}

		$content = $validation['content'] ?? '';
		if($validation['content'] !== strip_tags($validation['content'])){
			$content = e($validation['content']);
		}

		$laraTeX = (new LaraTeX($validation["template"]))
			->with([
					   'title'     => $validation["title"],
					   'questions' => $validation["questions"] ?? [],
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
										'name' => $validation["slug"] . '.pdf',
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
	//		public function toPng()
	//		{
	//			$outputFile = false;
	//			$latexBinFolder = dirname(config('laratex.binPath'));
	//
	//			$content = "Hello world";
	//			$result = (new LaraTeX('latex.standalone'))->with([
	//				                                                  'standalone' => true,
	//				                                                  'content'    => $content
	//			                                                  ])
	//			                                           ->render();
	//
	//			// Save the file
	//			$compileFolder = storage_path(config('laratex.tempPath'));
	//			File::put($compileFolder . '/temp.tex', $result);
	//
	//			$convertOptions = [
	//				$latexBinFolder . '/latex',
	//				'temp.tex'
	//			];
	//
	//			$home = "C:/websites/scolcours_gymnase/";
	//			if(env('APP_ENV')==='local'){
	//				$localEnv = [
	//					'HOME'        => $home,
	//					'HOMEPATH'    => $home,
	//					'HOMEDRIVE'   => $home,
	//					'USERPROFILE' => $home,
	//				];
	//			}else{
	//				$localEnv = null;
	//			}
	//
	//			$convert = new Process($convertOptions, $compileFolder, $localEnv);
	//			$convert->run();
	//
	//			if (!$convert->isSuccessful()) {
	//				dd('FAILED COMPILE TO DVI', $convertOptions,
	//				   $convert->getOutput(),
	//				   $convert->getErrorOutput());
	//			}
	//
	//
	//			// Convert to png
	//			$convertOptions = [
	//				$latexBinFolder . '/dvipng',
	//				'temp'
	//			];
	//
	//			$convert = new Process($convertOptions, $compileFolder,
	//			                       $localEnv);
	//
	//			$convert->run();
	//
	//
	//			if (!$convert->isSuccessful()) {
	//				dd('FAILED CONVERT TO PNG', $convertOptions, $convert->getOutput(),$convert->getErrorOutput() );
	//			}
	//
	//			return $compileFolder . '/temp.png';
	//		}


}
