<?php
Route::get("/b", function (){return redirect()->to('/bareme');});
Route::get("/bareme", function(){
	return \Inertia\Inertia::render("GraduatePage");
});
