<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ToolResource;
use App\Models\Theme;
use App\Models\Tool;
use Inertia\Inertia;

class ToolController extends Controller
{
	public function index()
	{
		$data = [
			"theme" => Theme::where('slug', 'tools')->first(),
			"tools" => Tool::orderBy('title')->get(),
			"tool"  => null,
		];

		return Inertia::render("Tools/ToolsIndex", $data);
	}

	public function show(Tool $tool)
	{
		$data = ["theme" => Theme::where('slug', 'tools')->first()];
		$data['tools'] = Tool::all();
		$data['tool'] = $tool;

		return Inertia::render("Tools/ToolsShow", $data);
	}

	public function showById(Tool $tool)
	{
		return redirect()->route("tools.show", [
			"tool" => $tool->slug
		]);
	}

	public function edit(Tool $tool)
	{
		return Inertia::render("Tools/ToolsEdit", [
			'tool' => ToolResource::make($tool),
		]);
	}

}
