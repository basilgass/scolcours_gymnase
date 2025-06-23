<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DevController;
use App\Http\Controllers\ScolcoursController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get("/b", function () {
	return redirect()->to('/bareme');
});
Route::get("/bareme", function () {
	return \Inertia\Inertia::render("Singles/GraduatePage");
})
     ->name('bareme.show');

Route::get("/g", function () {
	return redirect()->to('/grapheur');
});
Route::get("/grapheur", function () {
	return \Inertia\Inertia::render("Singles/GraphPage");
})->name('grapheur.show');
Route::post('/grapheur/svg/download', [ScolcoursController::class, "download"])
     ->name('grapheur.download');

