<?php

	namespace App\Http\Controllers;

	use App\Http\Resources\ToolResource;
	use App\Models\Theme;
	use App\Models\Tool;
	use Illuminate\Http\Request;
	use Inertia\Inertia;

	class ToolController extends Controller
	{
		public function index()
		{
			$data = ["theme"    => Theme::where('slug', 'tools')->first()];
			$data['tools'] = Tool::orderBy('title')->get();
			$data['tool'] = null;
			return Inertia::render("Tools/ToolsPage", $data);
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

			return Inertia::render("Tools/ToolsPage", $data);
		}

		public function edit(Tool $tool)
		{
			return Inertia::render("Tools/ToolsEdit", [
				'tool'=> ToolResource::make($tool),
			]);
		}

		public function update(Request $request, Tool $tool)
		{
			$validation = $request->validate([
				'title' => ['string', 'required'],
				'body' => ['string', 'required'],
			]);

			$tool->update($validation);
		}

		public function destroy(Tool $tool)
		{
			//
		}
	}
