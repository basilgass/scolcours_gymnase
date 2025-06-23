<?php

namespace App\Http\Controllers\api\Translations;

use App\Http\Controllers\Controller;
use App\Models\TranslationBook;
use Illuminate\Http\Request;

class TranslationUnitController extends Controller
{
	public function index(TranslationBook $book)
	{
		return $book->units;
	}

	public function store(Request $request)
	{
	}

	public function show($id)
	{
	}

	public function update(Request $request, $id)
	{
	}

	public function destroy($id)
	{
	}
}
