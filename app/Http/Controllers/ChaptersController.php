<?php
	
	namespace App\Http\Controllers;
	
	use App\Models\Chapter;
	use Illuminate\Http\Request;
	use Ismaelw\LaraTeX\LaraTeX;
	
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
			return redirect(route('theme.chapter', [$chapter->theme, $chapter]));
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
		
		public function latex(Request $data)
		{
			// TODO: modifier le nom du fichier.
			$filename = 'fichier_PDF_LATEX.pdf';
			return (new LaraTeX('latex.WhatToKnow'))->with([
				                                               'name'      => 'Primitives',
				                                               'questions' => json_decode($data->getContent())
			                                               ])
			                                        ->download($filename);
		}
	}
