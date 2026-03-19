import type {BlockInterface} from "@/types/blockInterfaces.ts"
import type {ChapterInterface} from "@/types/chapterInterfaces.ts"
import type {ScoreGeneratorDataInterface, ScoreInterface} from "@/types/scoreInterfaces.ts"

export interface GeneratorInterface {
	body: string;
	code: string;
	config?: { time_per_question?: number | null } | null;
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

export interface ChallengeLevelInterface {
	id: number;
	challenge_id: number;
	level_number: number;
	points_to_pass: number;
	bonus: { lives?: number; time?: number } | null;
	generators: GeneratorInterface[];
}

export interface ChallengeAnswerInterface {
	question: string
	answer: string
	result: boolean,
}

export interface ChallengeGameInterface {
	score: number,
	level: number,
	levelScore: number,
	lives: number,
	death: number,
	elapsedTime: number,
	remainingTime: number,
	questionElapsedTime: number,
	streak: number,
	levelDeaths: number,
}

export interface ChallengeInterface {
	id: number;
	slug: string;
	title: string;
	active: boolean;
	chapter: ChapterInterface;
	type: 'classic' | 'chrono' | 'streak' | 'blitz' | 'endurance' | 'precision';
	block: BlockInterface;
	best: ChallengeScoreInterface;
	levels: ChallengeLevelInterface[];
	lives: number;
	time_limit: number;
	updated_at: string;
}
