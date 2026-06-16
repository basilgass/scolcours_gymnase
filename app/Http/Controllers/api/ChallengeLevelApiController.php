<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeLevelResource;
use App\Http\Resources\GeneratorResource;
use App\Models\Challenge;
use App\Models\ChallengeLevel;
use App\Models\Generator;
use App\Models\Generatorable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ChallengeLevelApiController extends Controller
{
    public function store(Challenge $challenge): ChallengeLevelResource
    {
        $lastLevel = $challenge->levels()->reorder()->orderByDesc('level_number')->first();

        $level = $challenge->levels()->create([
            'level_number'   => $lastLevel ? $lastLevel->level_number + 1 : 1,
            'points_to_pass' => $lastLevel ? $lastLevel->points_to_pass : 5,
        ]);

        return ChallengeLevelResource::make($level->load('generators'));
    }

    public function update(ChallengeLevel $challengeLevel, Request $request): true
    {
        $validated = $request->validate([
            'points_to_pass' => ['required', 'numeric', 'min:1'],
        ]);

        $challengeLevel->update($validated);

        return true;
    }

    public function destroy(ChallengeLevel $challengeLevel): JsonResponse|true
    {
        if ($challengeLevel->generators()->count() > 0) {
            return response()->json(['message' => 'Ce niveau contient des générateurs.'], 422);
        }

        if ($challengeLevel->challenge->levels()->count() <= 1) {
            return response()->json(['message' => 'Un challenge doit avoir au moins un niveau.'], 422);
        }

        $deletedLevelNumber = $challengeLevel->level_number;
        $challenge = $challengeLevel->challenge;

        $challengeLevel->delete();

        // Renumber remaining levels above the deleted one
        $challenge->levels()
            ->where('level_number', '>', $deletedLevelNumber)
            ->decrement('level_number');

        return true;
    }

    public function attachGenerator(ChallengeLevel $challengeLevel, Generator $generator): AnonymousResourceCollection
    {
        $order = $challengeLevel->generators()->count() + 1;

        $challengeLevel->generators()->attach($generator, ['order' => $order]);

        return GeneratorResource::collection($challengeLevel->load('generators')->generators);
    }

    public function detachGenerator(ChallengeLevel $challengeLevel, Generatorable $generatorable): AnonymousResourceCollection
    {
        $this->ensurePivotBelongsToLevel($challengeLevel, $generatorable);

        $generatorable->delete();

        return GeneratorResource::collection($challengeLevel->load('generators')->generators);
    }

    public function updateGeneratorConfig(ChallengeLevel $challengeLevel, Generatorable $generatorable, Request $request): AnonymousResourceCollection
    {
        $this->ensurePivotBelongsToLevel($challengeLevel, $generatorable);

        $validated = $request->validate([
            'time_per_question' => ['sometimes', 'nullable', 'numeric', 'min:1'],
            'parameters'        => ['sometimes', 'nullable', 'array'],
        ]);

        $pivotUpdate = [];

        if ($request->has('time_per_question')) {
            $pivotUpdate['config'] = $validated['time_per_question'] !== null
                ? json_encode(['time_per_question' => $validated['time_per_question']])
                : null;
        }

        if ($request->has('parameters')) {
            $pivotUpdate['parameters'] = ! empty($validated['parameters'])
                ? json_encode($validated['parameters'])
                : null;
        }

        $generatorable->update($pivotUpdate);

        return GeneratorResource::collection($challengeLevel->load('generators')->generators);
    }

    /**
     * Garantit que la ligne de pivot appartient bien au niveau ciblé : le binding
     * par id seul n'est pas scopé au parent, un id forgé pointant vers un autre
     * generatorable doit être rejeté.
     */
    private function ensurePivotBelongsToLevel(ChallengeLevel $challengeLevel, Generatorable $generatorable): void
    {
        abort_unless(
            $generatorable->generatorable_type === ChallengeLevel::class
            && $generatorable->generatorable_id === $challengeLevel->id,
            404
        );
    }
}
