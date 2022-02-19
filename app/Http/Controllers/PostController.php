<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Tools;
use Illuminate\Http\Request;

class PostController extends Controller
{
	public function index()
	{
//		return Inertia::render("Tools", $data);
	}
	
	public function create()
	{
		//
	}
	
	public function store(Request $request)
	{
		//
	}
	
	public function show(Tools $tool)
	{
//		return Inertia::render("Tools", $data);
	}
	
	public function edit(Chapter $chapter)
	{
		//
	}
	
	public function update(Request $request, Chapter $chapter)
	{
		//
	}
	
	public function destroy(Chapter $chapter)
	{
		//
	}
}
