<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $challenges = DB::table('challenges')->get();

        foreach ($challenges as $challenge) {
            $levelOneId = null;

            for ($levelNumber = 1; $levelNumber <= $challenge->maxLevel; $levelNumber++) {
                $isLastLevel = $levelNumber === $challenge->maxLevel;

                $bonus = null;
                if (!$isLastLevel && ($challenge->bonusLevelLife > 0 || $challenge->bonusLevelTime > 0)) {
                    $bonus = json_encode([
                        'lives' => $challenge->bonusLevelLife,
                        'time'  => $challenge->bonusLevelTime,
                    ]);
                }

                $levelId = DB::table('challenge_levels')->insertGetId([
                    'challenge_id'   => $challenge->id,
                    'level_number'   => $levelNumber,
                    'points_to_pass' => $challenge->nextLevelAfter,
                    'bonus'          => $bonus,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);

                if ($levelNumber === 1) {
                    $levelOneId = $levelId;
                }
            }

            // Déplacer tous les générateurs du challenge vers le niveau 1
            DB::table('generatorables')
                ->where('generatorable_type', 'App\\Models\\Challenge')
                ->where('generatorable_id', $challenge->id)
                ->update([
                    'generatorable_type' => 'App\\Models\\ChallengeLevel',
                    'generatorable_id'   => $levelOneId,
                ]);
        }
    }

    public function down(): void
    {
        $levels = DB::table('challenge_levels')->where('level_number', 1)->get();

        foreach ($levels as $level) {
            DB::table('generatorables')
                ->where('generatorable_type', 'App\\Models\\ChallengeLevel')
                ->where('generatorable_id', $level->id)
                ->update([
                    'generatorable_type' => 'App\\Models\\Challenge',
                    'generatorable_id'   => $level->challenge_id,
                ]);
        }

        DB::table('challenge_levels')->truncate();
    }
};
