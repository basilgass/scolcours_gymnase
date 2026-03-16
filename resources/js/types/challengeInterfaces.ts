import type {BlockInterface} from "@/types/blockInterfaces.ts"
import type {ChapterInterface} from "@/types/chapterInterfaces.ts"
import type {ScoreGeneratorDataInterface, ScoreInterface} from "@/types/scoreInterfaces.ts"

export interface GeneratorInterface {
	body: string;
	code: string;
	id: number;
	keyboard: string;
	order: number;
	slug: string;
	template: string;
	theme_id: number;
	title: string;
	user?: ScoreInterface<ScoreGeneratorDataInterface>
}

export interface ChallengeScoreInterface {
	level: number
	score: number,
}

export type ChallengeGameState = "intro" | "running" | "finished"

export interface ChallengeMinInterface {
	active: boolean;
	block: BlockInterface;
	chapter: ChapterInterface;
	id: number;
	slug: string;
	title: string;
}

export interface ChallengeInterface {
	active: boolean;
	best: ChallengeScoreInterface;
	block: BlockInterface;
	bonusLevelLife: number;
	bonusLevelTime: number;
	bonusScoreLife: number;
	bonusScoreTime: number;
	bonusScoreTrigger: number;
	chapter: ChapterInterface;
	duration: number;
	durationByQuestion: number;
	generators: GeneratorInterface[];
	generatorsGrouping: number;
	id: number;
	lives: number;
	nextLevelAfter: number;
	slug: string;
	theme_id: number;
	title: string;
	updated_at: string;
	user: ChallengeScoreInterface;
}
