<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TargetClassRequest;
use App\Http\Resources\FormulaResource;
use App\Models\Chapter;
use App\Models\Formula;
use App\Traits\ResolvesTarget;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class FormulaApiController extends Controller
{
	use ResolvesTarget;

	public function index(Request $request)
	{
		if ($request->input('ids')) {
			return $this->fetch($request->input('ids'));
		}

		if ($request->input('chapter_id')) {
			$chapter = Chapter::find($request->input('chapter_id'));
			return FormulaResource::collection($chapter->formulas()->with('chapters')->get());
		}

		$formulas = Formula::with("chapters")->get();
		return FormulaResource::collection($formulas);
	}

	public function fetch($values)
	{
		// Tri portable (FIELD() est spécifique à MySQL) : on respecte l'ordre
		// des ids demandés en triant la collection en PHP.
		$formulas = Formula::with("chapters")
		                   ->whereIn('id', $values)
		                   ->get()
		                   ->sortBy(fn ($formula) => array_search($formula->id, $values))
		                   ->values();
		return FormulaResource::collection($formulas);
	}

	public function show(Formula $formula)
	{
		return FormulaResource::make($formula->load('chapters'));
	}

	public function store(Chapter $chapter, Request $request)
	{
		// Ordre propre au chapitre : on se base sur le nombre de formules déjà rattachées.
		$n = $chapter->formulas()->count();

		// La formule est l'entité canonique ; on la crée et on la rattache au chapitre
		// avec sa position (stockée sur le pivot).
		$formula = $chapter->formulas()->create([], ['order' => $n + 1]);

		$formula->blocks()->create([
			'body' => 'A modifier...'
		]);

		// Return to the main root.
		return FormulaResource::make($formula->load('chapters'));
	}

	/**
	 * Détache une formule d'un chapitre sans la supprimer : la formule reste vivante
	 * dans la bibliothèque globale (source de vérité) et dans ses autres chapitres.
	 */
	public function detach(Chapter $chapter, Formula $formula)
	{
		$chapter->formulas()->detach($formula->id);

		return response()->noContent();
	}

	/**
	 * Suppression globale : détruit la formule canonique. La cascade du pivot retire
	 * automatiquement tous ses rattachements.
	 */
	public function destroy(Formula $formula)
	{
		$formula->delete();
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Formula[]|Collection
	 */
	public function getFormulasFromChapter(Chapter $chapter)
	{
		return [
			'formular' => FormulaResource::collection($chapter->formulas()->with('chapters')->get()),
			'chapters' => $chapter->theme
				->chapters()
				->where('active', true)
				->has('formulas')
				->get()
				->map(function ($chapter) {
					return [
						'id'       => $chapter->id,
						'title'    => $chapter->title,
						'theme_id' => $chapter->theme_id
					];
				})
				->concat(
					$chapter
						->relations()
						->has('formulas')
						->get()
						->map(function ($relation) {
							return [
								//'slug'  => $relation->slug,
								'id'    => $relation->id,
								'title' => $relation->title,
								'theme' => [
									'id' => $relation->theme_id
								]
							];
						})->toArray()
				)->unique('id')
		];
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\Response
	 */


	public function updateOrder(Request $request)
	{
		// L'ordre étant propre à chaque chapitre, le réordonnancement s'applique au pivot
		// du chapitre courant.
		$chapter = Chapter::findOrFail($request->input('chapter_id'));

		foreach ($request['order'] as $value) {
			$chapter->formulas()->updateExistingPivot($value['id'], ['order' => $value['order']]);
		}

		return response()->noContent();
	}


	public function duplicate(Formula $formula)
	{
		$formula->loadMissing('chapters');

		$newFormula = $formula->replicate();
		$newFormula->push();

		// Reproduit les mêmes rattachements (avec leur ordre) que la formule d'origine.
		$newFormula->chapters()->attach(
			$formula->chapters->mapWithKeys(
				fn (Chapter $chapter) => [$chapter->id => ['order' => $chapter->pivot->order]]
			)->all()
		);

		$newFormula->blocks()->save($formula->blocks[0]->duplicate());

		return FormulaResource::make($newFormula->load('chapters'));
	}

	public function move(Formula $formula, TargetClassRequest $request)
	{
		/** @var Chapter $target */
		$target = $this->resolveTarget($request->validated());

		// « Déplacer » = ne rattacher qu'au chapitre cible (sync détache les autres),
		// en positionnant la formule en fin de liste du chapitre cible.
		$maxOrder = $target->formulas()->max('chapter_formula.order') ?? 0;
		$formula->chapters()->sync([$target->id => ['order' => $maxOrder + 1]]);

		return [
			'url'   => $target->url,
			'label' => $target->title,
		];
	}

}
