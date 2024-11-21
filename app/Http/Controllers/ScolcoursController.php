<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChapterResource;
use App\Http\Resources\ChapterShowResource;
use App\Models\Chapter;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

//use App\Models\Exercise;

class ScolcoursController extends Controller
{
    public function index()
    {
        $newChapters = Chapter::with(['theme', 'blocks', 'blocks.illustrations'])
            ->where('active', true)
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('HomePage', [
            'newChapters' => ChapterShowResource::collection($newChapters)
        ]);
    }

    public function dashboard()
    {
//        $courses = Auth::user()->chapters
//            ->map(function ($chapter) {
//                return [
//                    'slug'        => $chapter->slug,
//                    'title'       => $chapter->title,
//                    'theme'       => $chapter->theme->slug,
//                    'currentPost' => $chapter->posts->where('id', $chapter->pivot->post_id)->first()->order,
//                    'maxPost'     => count($chapter->posts),
//                    'updated_at'  => Carbon::parse($chapter->pivot->updated_at)->diffForHumans()
//                ];
//            });

        $chapters = Auth::user()->chapters;
        $chapters->load("posts");

        $courses = ChapterResource::collection($chapters)
            ->map(function($chapter){
                return $chapter->additional([
                    'currentPost' => $chapter->posts->where('id', $chapter->pivot->post_id)->first()->order,
                    'maxPost'=>count($chapter->posts)
                ]);
            });

        // $courses = ChapterResource + CurrentPost + MaxPost
        return Inertia::render('DashboardPage', [
            'courses' => $courses
        ]);
    }

    public function devIndex()
    {
        // Get all devs.
        $devPages = collect(Storage::disk('devs')->files())->map(function ($p) {
            return pathinfo($p)[ 'filename' ];
        });

        return Inertia::render("Devs/DevsIndex", [
            'pages' => $devPages
        ]);
    }

    public function dev($page)
    {
        return Inertia::render('Devs/DevsShow', [
            "dev" => $page
        ]);
    }

    public function download(Request $request)
    {
        return response()->streamDownload(function () {
            echo "hello world";
        }, 'users.txt');

        $validate = $request->validate([
            'svg' => ['string', 'min:2']
        ]);

        $content = $validate[ 'svg' ];
        $filename = 'grapheur.svg';
        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, $filename);
    }
}
