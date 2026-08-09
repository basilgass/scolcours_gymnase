import type {ScoreInterface} from "@/types/scoreInterfaces.ts"

export interface LeaderboardStatsInterface {
	scores: ScoreInterface[]
	average: number | null
	median: number | null
	rank: number | null
	total: number
}
