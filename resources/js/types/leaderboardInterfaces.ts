import type {ScoreInterface} from "@/types/scoreInterfaces.ts"

export interface LeaderboardStatsInterface {
	scores: ScoreInterface[]
	average: number | null
	median: number | null
	rank: number | null
	total: number
}

/**
 * Props Inertia de ChallengeHallOfFame
 *
 * global    → topStats(10)  : top 10 scores + stats globales + rang de l'utilisateur connecté
 * teamStats → teamStats()   : scores des membres des teams + stats + rang (null si aucune team)
 */
export interface LeaderboardInterface {
	global: LeaderboardStatsInterface
	teamStats: LeaderboardStatsInterface | null
}
