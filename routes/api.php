<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Testing
Route::middleware('admin')
     ->group(function () {
	     Route::get('/user', function () {
		     return auth()->user();
	     });


     });


Route::get('/routes/names', function (Request $request) {
	$search = $request->query('search', '');

	$routeNames = collect(Route::getRoutes())
		->filter(fn($route) => in_array('GET', $route->methods()))
		->map(fn($route) => $route->getName())
		->filter() // enlève null
		->filter(fn($name) => stripos($name, $search) !== false)
		->unique()
		->values()
		->map(fn($name, $index) => [
			'id' => $index,
			'title' => $name,
		])
		->all();

	return response()->json($routeNames);
})
     ->name('routes.index');
