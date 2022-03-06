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
			$requestData = json_decode($data->getContent());

			// Check if folder exists.
			$folder = "pdf/{$requestData->theme}/{$requestData->slug}";
			if (!Storage::disk('public')->exists($folder)) {
				Storage::disk('public')->makeDirectory($folder);
			}

			// Generate a filename
			// TODO: Generate slug of 4 letters
			$fileID = Str::random(4);
			// Check if is already in the database.
			while (LatexPdf::whereSlug($fileID)->first()) {
				$fileID = Str::random(4);
			}

			$filename = $fileID . '.pdf';
			$fullpath = $folder . '/' . $filename;

			$result = (new LaraTeX('latex.WhatToKnow'))->with([
				                                                  'title'     => $requestData->title,
				                                                  'questions' => $requestData->questions,
				                                                  'slug'      => '/download/' . $fileID
			                                                  ])
			                                           ->savePdf(Storage::disk('public')->path($fullpath));

			if ($result) {
				// Save it to the database.
				LatexPdf::create([
					                 'slug' => $fileID,
					                 'name' => $requestData->slug . '.pdf',
					                 'url'  => $fullpath,
				                 ]);
			}
			return $fileID;
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
