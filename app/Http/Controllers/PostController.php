<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostShowResource;
use App\Http\Resources\ThemeResource;
use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    public function index()
    {
        // TODO : make a single post page view...
        //		return Inertia::render("Tools", $data);
    }

    public function store(Chapter $chapter, Request $request)
    {
        $validation = $request->validate([
            'title' => ['string', 'min:2']
        ]);

        $post = $chapter->posts()->create([
            'title' => $validation[ 'title' ],
            'order' => count($chapter->posts) + 1
        ]);

        // Load the blocks, even if it's empty :)
        $post->blocks;

        return [
            'post'     => PostShowResource::make($post),
            'redirect' => route('themes.chapters.slide', [
                'theme'   => $chapter->theme->slug,
                'chapter' => $chapter->slug,
                'order'   => $post->order
            ])
        ];
    }

    public function show(Post $post)
    {
        // Find the chapter for this post and redirect to it !
        return redirect(route('themes.chapters.slide', [
            $post->chapter->theme,
            $post->chapter,
            $post->order
        ]));
    }

    public function edit(Post $post)
    {
        $post->unsetRelation('blocks');
        $post->unsetRelation('questions');

        // Create a post form
        return Inertia::render("Posts/PostEdit", [
            'theme' => ThemeResource::make($post->chapter->theme),
            'post'  => $post
        ]);
    }

    public function updateBlocksOrder(Post $post, Request $request)
    {
        foreach ($request[ 'order' ] as $row) {
            $post->blocks->find($row[ 'id' ])->update(['order' => $row[ 'order' ]]);
        }

        return 1;
    }

    public function update(Post $post, Request $request)
    {
        // Validate the post.
        $validation = $request->validate([
            'title'         => ['max:255'],
            'active'        => ['boolean'],
            'script'        => ['string', 'nullable'],
            'switch'        => ['string', 'nullable'],
            'type'          => ['string', 'nullable'],
            'questionsGrid' => ['string', 'nullable'],
        ]);

        $post->title = $validation[ 'title' ];
        $post->active = $validation[ 'active' ];
        $post->script = $validation[ 'script' ] ?? '';
        $post->switch = $validation[ 'switch' ];
        $post->type = $validation[ 'type' ] ?? null;
        $post->questionsGrid = $validation[ 'questionsGrid' ] ?? null;
        $post->save();

        return PostShowResource::make($post);
    }

    public function updateQuestionsOrder(Post $post, Request $request)
    {
        foreach ($request[ 'order' ] as $value) {
            $post->questions->find($value[ 'id' ])->update(['order' => $value[ 'order' ]]);
        }

        return true;
    }

    public function updateQuestionsGrid(Post $post, Request $request)
    {
        $validate = $request->validate([
            'grid' => ['string', 'nullable']
        ]);

        $post->update([
            'questionsGrid' => $validate[ 'grid' ] ?? $validate[ 'grid' ]
        ]);
        $post->save();
        return true;
    }

    public function destroy($id)
    {
        $post = Post::find($id);

        if ($post) {
            $chapter = $post->chapter;
            // Remove all children blocks.
            $post->blocks()->delete();

            // Destroy the post
            //            $post->delete();
            Post::destroy($id);

            // Update the posts order.
            $chapter->reorder();

            return $chapter->url;
        }

        return null;
    }

    public function movePostToChapter(Post $post, Chapter $chapter)
    {
        // remove the block from the current blockable.
        $post->update([
            'chapter_id' => $chapter->id,
            'order'      => count($chapter->posts) + 2
        ]);

        return [
            'url'   => $chapter->url,
            'label' => $chapter->title,
        ];
    }

    // Get basic info about a post
    public function info(Post $post)
    {
        return [
            "title" => $post->title,
        ];
    }
}
