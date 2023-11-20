<?php

// Latex download - migrate to custom controller
// TODO: Implement back the PDF output.
use App\Http\Controllers\LatexController;

Route::get('/latex/dry', [LatexController::class, 'dry']);
Route::post('/latex', [LatexController::class, 'latex'])->name('latex.pdf');
Route::get('/latex/links', [LatexController::class, 'links'])->name('latex.links');
Route::get('/latex/{fileID}', [LatexController::class, 'download'])->name('latex.download');
