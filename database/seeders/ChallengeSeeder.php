<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\ChallengeLevel;
use Illuminate\Database\Seeder;

class ChallengeSeeder extends Seeder
{
	private const TYPES = ['classic', 'chrono', 'blitz'];

	/**
	 * IDs de générateurs connus en base (dérivées, racines, puissances).
	 */
	private const GENERATORS_SIMPLE = [1];
	private const GENERATORS_MEDIUM_1 = [2];
	private const GENERATORS_MEDIUM_2 = [4];
	private const GENERATORS_MEDIUM_3 = [5];
	private const GENERATORS_FULL_1 = [1, 2];
	private const GENERATORS_FULL_2 = [4, 5, 6];
	private const GENERATORS_FULL_3 = [7, 8, 9];

	public function run(): void
	{
		// ── Groupe A : 1 niveau, 1 générateur ──────────────────────────────
		foreach (self::TYPES as $type) {
			$challenge = $this->createChallenge("seed-{$type}-simple", "[SEED] {$type} – simple", $type);
			$level = $this->createLevel($challenge, 1, 50);
			$this->attachGenerators($level, self::GENERATORS_SIMPLE);
		}

		// ── Groupe B : 3 niveaux, 1 générateur / niveau ────────────────────
		foreach (self::TYPES as $type) {
			$challenge = $this->createChallenge("seed-{$type}-multi", "[SEED] {$type} – multi-niveaux", $type);

			$level1 = $this->createLevel($challenge, 1, 50);
			$this->attachGenerators($level1, self::GENERATORS_MEDIUM_1);

			$level2 = $this->createLevel($challenge, 2, 70, ['lives' => 1]);
			$this->attachGenerators($level2, self::GENERATORS_MEDIUM_2);

			$level3 = $this->createLevel($challenge, 3, 90, ['time' => 30]);
			$this->attachGenerators($level3, self::GENERATORS_MEDIUM_3);
		}

		// ── Groupe C : 3 niveaux, 2-3 générateurs / niveau ─────────────────
		foreach (self::TYPES as $type) {
			$challenge = $this->createChallenge("seed-{$type}-full", "[SEED] {$type} – multi-générateurs", $type);

			$level1 = $this->createLevel($challenge, 1, 50);
			$this->attachGenerators($level1, self::GENERATORS_FULL_1);

			$level2 = $this->createLevel($challenge, 2, 70, ['lives' => 1]);
			$this->attachGenerators($level2, self::GENERATORS_FULL_2);

			$level3 = $this->createLevel($challenge, 3, 90, ['time' => 30]);
			$this->attachGenerators($level3, self::GENERATORS_FULL_3);
		}

		$this->command->info('ChallengeSeeder : 18 challenges créés (3 groupes × 6 types).');
	}

	private function createChallenge(string $slug, string $title, string $type): Challenge
	{
		return Challenge::create([
			'slug'       => $slug,
			'title'      => $title,
			'type'       => $type,
			'active'     => true,
			'lives'      => 3,
			'time_limit' => 120,
		]);
	}

	private function createLevel(
		Challenge $challenge,
		int       $levelNumber,
		int       $pointsToPass,
		?array    $bonus = null
	): ChallengeLevel
	{
		return ChallengeLevel::create([
			'challenge_id'   => $challenge->id,
			'level_number'   => $levelNumber,
			'points_to_pass' => $pointsToPass,
			'bonus'          => $bonus,
		]);
	}

	/**
	 * Attache des générateurs à un niveau en renseignant le pivot order.
	 *
	 * @param array<int> $generatorIds
	 */
	private function attachGenerators(ChallengeLevel $level, array $generatorIds): void
	{
		$pivotData = [];
		foreach ($generatorIds as $index => $generatorId) {
			$pivotData[$generatorId] = ['order' => $index + 1, 'config' => null];
		}

		$level->generators()->attach($pivotData);
	}
}
