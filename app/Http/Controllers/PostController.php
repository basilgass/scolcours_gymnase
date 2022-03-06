<?php
	
	namespace App\Http\Controllers;
	
	use App\Models\Chapter;
	use App\Models\Post;
	use Illuminate\Http\Request;
	use Inertia\Inertia;
	
	class PostController extends Controller {
		public function index() {
//		return Inertia::render("Tools", $data);
		}
		
		public function create() {
			return Inertia::render("Posts/CreatePost", [
				"chapters" => Chapter::all()->mapWithKeys(function ($item, $key) {
					return [
						$key => [
							'theme_id' => $item->theme_id,
							'slug'     => $item->slug,
							'title'    => $item->title
						]
					];
				})
			]);
		}
		
		public function store(Request $request) {
			$validation = $request->validate([
				                                 'chapter'  => ['required', 'exists:App\Models\Chapter,slug'],
				                                 'title'    => ['max:255'],
				                                 'body'     => ['required', 'min:5'],
				                                 'template' => ['required', 'exists:App\Models\PostTemplate,id'],
				                                 'answer' => [],
												 'walkthrough' => ['array'],
				                                 'walkthrough.*.step' => ['string', 'min:3'],
				                                 'walkthrough.*.resolution' => ['string', 'min:3'],
				                                 'illustrations' => ['array'],
				                                 'illustrations.*.title' => ['string'],
				                                 'illustrations.*.type' => ['string'],
				                                 'illustrations.*.code' => ['string'],
				                                 'illustrations.*.parameters' => ['string'],
			                                 ]);
			
			dd($validation);
			// Return to the main root.
			return Inertia::render("Posts/CreatePost");
		}
		
		public function show(Post $post) {
			return Inertia::render("Posts/ViewPost", [
				'theme'    => $post->chapter->theme,
				'template' => $post->template,
				'post'     => $post
			]);
		}
		
		public function edit(Chapter $chapter) {
			//
		}
		
		public function update(Request $request, Chapter $chapter) {
			//
		}
		
		public function destroy(Chapter $chapter) {
			//
		}
	}
