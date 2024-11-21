<?php
// TODO: Evalaution doit être travailler de A-Z, avec les resources, etc...
namespace App\Http\Controllers;

use App\Http\Resources\EvaluationRessource;
use App\Models\Evaluation;
use Inertia\Inertia;

class EvaluationController extends Controller
{
    public function show(Evaluation $evaluation)
    {
        return Inertia::render('Evaluations/EvaluationShow',
            [
                'evaluation'=>EvaluationRessource::make($evaluation),
            ]
        );
    }
}
