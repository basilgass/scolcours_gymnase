<?php
	
	namespace App\Http\Controllers;
	
	use App\Models\Chapter;
	use App\Models\Theme;
	use App\Models\Tools;
	use Illuminate\Http\Request;
	use Inertia\Inertia;
	
	class ToolsController extends Controller
	{
		public function index()
		{
			$data = ["theme"    => Theme::where('slug', 'tools')->first()];
			$data['tools'] = Tools::all();
			return Inertia::render("Tools", $data);
		}
		
		public function create()
		{
			//
		}
		
		public function store(Request $request)
		{
			//
		}
		
		public function show(Tools $tool)
		{
			$data = ["theme"    => Theme::where('slug', 'tools')->first()];
			$data['tools'] = Tools::all();
			$data['slug'] = $tool->slug;
			
			return Inertia::render("Tools", $data);
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
