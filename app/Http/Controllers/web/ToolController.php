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

	public function show($value)
	{
		$tool = is_numeric($value)
			? Tool::findOrFail($value)
			: Tool::where('slug', $value)->firstOrFail();

		if ($value !== $tool->slug) {
			return redirect()->route('tools.show', $tool, 301);
		}
		return Inertia::render("Tools/ToolsShow", [
			"tools" => Tool::all(),
			"tool"  => $tool
		]);
	}

	public function edit(Tool $tool)
	{
		return Inertia::render("Tools/ToolsEdit", [
			'tool' => ToolResource::make($tool),
		]);
	}

}
