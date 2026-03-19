<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeLevelResource;
use App\Http\Resources\GeneratorResource;
use App\Models\Challenge;
use App\Models\ChallengeLevel;
use App\Models\Generator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function attachGenerator(ChallengeLevel $challengeLevel, Generator $generator): mixed
    {
        $order = $challengeLevel->generators()->count() + 1;

        $challengeLevel->generators()->attach($generator, ['order' => $order]);

        $challengeLevel->refresh();

        return $challengeLevel->generators;
    }

    public function detachGenerator(ChallengeLevel $challengeLevel, Generator $generator): mixed
    {
        $challengeLevel->generators()->detach($generator);

        $challengeLevel->refresh();

        return $challengeLevel->generators;
    }

    public function updateGeneratorConfig(ChallengeLevel $challengeLevel, Generator $generator, Request $request): mixed
    {
        $validated = $request->validate([
            'time_per_question' => ['nullable', 'numeric', 'min:1'],
        ]);

        $config = $validated['time_per_question'] !== null
            ? json_encode(['time_per_question' => $validated['time_per_question']])
            : null;

        $challengeLevel->generators()->updateExistingPivot($generator->id, ['config' => $config]);

        $challengeLevel->refresh();

        return $challengeLevel->generators;
    }
}
