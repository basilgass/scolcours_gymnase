<?php

namespace App\Http\Controllers;

use App\Models\Illustration;
use App\Models\Theme;
use App\Models\Widget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WidgetController extends Controller
{
	public function index()
	{

	}

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

			Widget::updateOrCreate(
				[
					"component" => $file
				],
				[
					"name" => $name,
					"slug" => $name,
					"component" => $file,
					"theme_id" => $theme,
					"description" => count($content) >= 2 ? explode("</info>", $content[1])[0] : ""
				]);

		}

		// Go through each existing illustrations and take the correct one !
		Illustration::where('value', "image")
			->update([
				"widget_id"=> Widget::where("component", "image-widget.vue" )->first()->id
			]);
		Illustration::where('value', NULL)
			->update([
				"widget_id"=> Widget::where("component", "draw-parser-widget.vue" )->first()->id
			]);
		Illustration::where('value', "LIKE", "IllustrationTos%")
			->update([
				"widget_id"=> Widget::where("component", "analyse/tableau-de-signes.vue" )->first()->id
			]);
		Illustration::where('value', "IllustrationEuclidian")
			->update([
				"widget_id"=> Widget::where("component", "algebre/division-euclidienne.vue" )->first()->id
			]);
		Illustration::where('value', "IllustrationProbabilityTree")
			->update([
				"widget_id"=> Widget::where("component", "statistiques/arbre-des-probabilites.vue" )->first()->id
			]);
		Illustration::where('value', "IllustrationStepper")
			->update([
				"widget_id"=> Widget::where("component", "etapes-par-etapes.vue" )->first()->id
			]);
		Illustration::where('value', "IllustrationValues")
			->update([
				"widget_id"=> Widget::where("component", "analyse/tableau-des-valeurs.vue" )->first()->id
			]);

		return Widget::all();
	}

	public function update(Request $request, Widget $widget)
	{
		$validate = $request->validate([
			"name" => ["string", "min:1"],
			"slug" => ["string", "min:1"],
			'theme_id' => ["exists:App\Models\Theme,id", "nullable"],
			"component" => ["string", "min:1"], // check if file exists ?
			"description" => ["string", "nullable"]
		]);

		$widget->update($validate);

		return $widget;
	}

	public function components()
	{
		return Widget::all();
	}
}
