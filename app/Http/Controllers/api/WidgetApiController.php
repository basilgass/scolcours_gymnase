<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WidgetResource;
use App\Models\Theme;
use App\Models\Widget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WidgetApiController extends Controller
{
	public function index()
	{
		return WidgetResource::collection(Widget::all());
	}

	public function show(Widget $widget)
	{
		return WidgetResource::make($widget);
	}

	public function update(Request $request, Widget $widget)
	{
		$validate = $request->validate([
			"name"        => ["string", "min:1"],
			"slug"        => ["string", "min:1"],
			'theme_id'    => ["exists:App\Models\Theme,id", "nullable"],
			"component"   => ["string", "min:1"], // check if file exists ?
			"description" => ["string", "nullable"]
		]);

		$validate["description"] = $validate["description"] ?? "";

		$widget->update($validate);

		return $widget;
	}

	public function destroy(Widget $widget)
	{
		$widget->delete();
	}

	/** Read from a folder */
	public function refresh()
	{
		// Read all the widgets in the folder and extract the data.
		$widgets = [];

		foreach (Storage::disk('widgets')->allFiles() as $file) {
			// read it and grab the md text.
			$content = explode("<info>", Storage::disk('widgets')->get($file));
			$theme_name = explode("/", $file);
			$theme = null;
			$name = basename($file, '.vue');
			if (count($theme_name) === 2) {
				$theme = Theme::where("slug", $theme_name[0])->first()?->id ?? null;
			}

			$widgets[] = [$theme, $theme_name];

			// Should create a widget if it doesn't exist.
			Widget::firstOrCreate(
				[
					"component" => $file
				],
				[
					"name"        => $name,
					"slug"        => $name,
					"theme_id"    => $theme,
					"description" => count($content) >= 2 ? explode("</info>", $content[1])[0] : ""
				]
			);
		}

		return Widget::all();
	}


}
