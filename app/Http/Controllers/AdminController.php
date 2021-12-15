<?php
	
	namespace App\Http\Controllers;
	
	use App\Models\Challenge;
	use App\Models\Chapter;
	use App\Models\Theme;
	use App\Models\Tools;
	use Illuminate\Support\Facades\Storage;
	use Illuminate\Support\Str;
	use Inertia\Inertia;
	
	class AdminController extends Controller
	{
		public function show()
		{
			$this->loadTools();
			$this->loadChallenges();
			$this->loadChapters();
			
			return Inertia::render(
				'Admin',
				[
					'tools' => Tools::all()->map(function($tool, $key){
						return [
							'slug'=>$tool->slug,
							'title'=>$tool->slug,
							'updated_at'=>$tool->updated_at->format('d.m.Y H:m')
						];
					}),
					'chapters' => Chapter::all()->map(function($tool, $key){
						return [
							'slug'=>$tool->slug,
							'title'=>$tool->slug,
							'updated_at'=>$tool->updated_at->format('d.m.Y H:m')
						];
					}),
					'challenges' => Challenge::all()->map(function($tool, $key){
						return [
							'slug'=>$tool->slug,
							'title'=>$tool->slug,
							'updated_at'=>$tool->updated_at->format('d.m.Y H:m')
						];
					})
				]
			);
		}
		
		public function loadTools()
		{
			foreach (Storage::disk('tools')->files() as $file) {
				$slug = substr($file, 0, -4);
				$lastModified = Storage::disk('tools')->lastModified($file);
				$existingTools = Tools::where('slug', $slug)->first();
				
				// Les informations dans la base de données sont plus récente - pas de modification à faire.
				if ($existingTools?->updated_at->greaterThanOrEqualTo(\Carbon\Carbon::createFromTimestamp($lastModified))) {
					continue;
				}
				
				// Les informations dans le fichier sont plus récent... on récupère les données.
				$content = Storage::disk('tools')->get($file);
				
				// Le titre
				if (preg_match("/\*\stitle:\s?(.+)/", $content, $title)) {
					$title = $title[1];
				} else {
					$title = '';
				}
				
				// La description
				if (preg_match("/\*\sbody:\s?(.+)/", $content, $body)) {
					$body = $body[1];
				} else {
					$body = '';
				}
				
				// Les paramètrs
				if (preg_match("/\*\sparameters:\s?(.+)/", $content, $parameters)) {
					$parameters = collect(explode(",", $parameters[1]))->map(fn($x) => trim($x));
				} else {
					$parameters = collect([]);
				}
				
				// Les tags
				if (preg_match("/\*\stags:\s?(.+)/", $content, $tags)) {
					$tags = collect(explode(",", $tags[1]))->map(fn($x) => trim($x));
				} else {
					$tags = collect([]);
				}
				
				// Création dans la base de donnée.
				Tools::updateOrCreate(
					[
						"slug" => $slug
					],
					[
						"title"       => $title,
						"body" => $body,
						"parameters"  => $parameters
					]
				);
			}
		}
		
		public function loadChallenges()
		{
			foreach (Storage::disk('challenges')->files() as $file) {
				$slug = substr($file, 0, -4);
				
				if (Str::startsWith($slug, 'template')) {
					continue;
				}
				
				$lastModified = Storage::disk('challenges')->lastModified($file);
				$existingTools = Tools::where('slug', $slug)->first();
				
				// Les informations dans la base de données sont plus récente - pas de modification à faire.
				if ($existingTools?->updated_at->greaterThanOrEqualTo(\Carbon\Carbon::createFromTimestamp($lastModified))) {
					continue;
				}
				
				$content = Storage::disk('challenges')->get($file);
				
				// Get the title
				if (preg_match("/const title = [\"']\s?(.+)[\"']/", $content, $title)) {
					$title = Str::replace("\'", "'", $title[1]);
				} else {
					$title = $slug;
				}
				// Création dans la base de donnée.
				Challenge::updateOrCreate(
					[
						"slug" => $slug
					],
					[
						"title" => $title,
					]
				);
			}
		}
		
		public function loadChapters()
		{
			foreach (Storage::disk('chapters')->directories() as $directory){
				$theme_id = Theme::where('slug', $directory)->first()->id;
				foreach (Storage::disk('chapters')->files($directory) as $file){
					$slug = substr($file, strlen($directory)+1, -4);
					$lastModified = Storage::disk('chapters')->lastModified($file);
					$existingChapters = Tools::where('slug', $slug)->first();
					
					// Les informations dans la base de données sont plus récente - pas de modification à faire.
					if ($existingChapters?->updated_at->greaterThanOrEqualTo(\Carbon\Carbon::createFromTimestamp($lastModified))) {
						continue;
					}
					
					
					// Les informations dans le fichier sont plus récent... on récupère les données.
					$content = Storage::disk('chapters')->get($file);
					
					// Le titre
					if (preg_match("/\*\stitle:\s?(.+)/", $content, $title)) {
						$title = $title[1];
					} else {
						$title = '';
					}
					
					// La description
					if (preg_match("/\*\sbody:\s?(.+)/", $content, $body)) {
						$body = $body[1];
					} else {
						$body = '';
					}
					
					
					// Création dans la base de donnée.
					Chapter::updateOrCreate(
						[
							"slug" => $slug,
						],
						[
							"theme_id" => $theme_id,
							"title" => $title,
							"body"  => $body,
						]
					);
				}
			}
			
		}
	}
