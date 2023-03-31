<?php

	namespace App\Http\Controllers;

	use App\Models\Chapter;
	use App\Models\Theme;
	use App\Models\Tool;
	use Illuminate\Http\Request;
	use Inertia\Inertia;

	class ToolsController extends Controller
	{
		public function index()
		{
			$data = ["theme"    => Theme::where('slug', 'tools')->first()];
			$data['tools'] = Tool::all();
			$data['tool'] = null;
			return Inertia::render("ToolsPage.vue", $data);
		}

		public function create()
		{
			//
		}

		public function store(Request $request)
		{
			//
		}

		public function show(Tool $tool)
		{
			$data = ["theme"    => Theme::where('slug', 'tools')->first()];
			$data['tools'] = Tool::all();
			$data['tool'] = $tool;

			return Inertia::render("ToolsPage.vue", $data);
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
