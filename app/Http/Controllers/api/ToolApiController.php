<?php

	namespace App\Http\Controllers\api;

	use App\Http\Controllers\Controller;
	use App\Http\Resources\ToolResource;
	use App\Models\Theme;
	use App\Models\Tool;
	use Illuminate\Http\Request;
	use Inertia\Inertia;

	class ToolApiController extends Controller
	{
		public function index()
		{
			return ToolResource::collection(Tool::all());
		}

		public function show(Tool $tool)
		{
			return ToolResource::make($tool);
		}

		public function fetch()
		{
			return ToolResource::collection(Tool::all());
		}

		public function create()
		{
			//
		}

		public function store(Request $request)
		{
			//
		}


		public function update(Request $request, Tool $tool)
		{
			$validated = $request->validate([
				'title' => ['string', 'required'],
				'body' => ['string', 'required'],
				'theme_id' => ['integer', 'exists:App\Models\Theme,id', 'nullable'],
			]);

			$tool->update($validated);
		}

		public function destroy(Tool $tool)
		{
			//
		}
	}
