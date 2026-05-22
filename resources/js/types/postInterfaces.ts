import type {BlockInterface, BlockMinInterface, IllustrationMinInterface} from "@/types/blockInterfaces.ts"
import type {ScoreInterface, ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"

export interface QuestionDynamicInterface {
	answer: string;
	block: BlockMinInterface;
	keyboard: string;
	validation?: string,
	illustration?: IllustrationMinInterface
	user: {
		is_resolved: boolean
	};
}

export interface QuestionInterface extends QuestionDynamicInterface {
	css: string;
	displayIf: null | string;
	id: number;
	order: number;
	user: ScoreInterface<ScoreQuestionDataInterface>;
}

export type PostType = '' | 'exercise' | 'howto' | 'quizz' | 'test'

export interface PostInterface {
	active: number;
	chapter_id: number;
	id: number;
	order: number;
	questionsInfo: {
		count: number,
		answered: number
	};
	revise: boolean;
	title: string;
	type: PostType;
	updated_at: string;
}

export interface PostShowInterface extends PostInterface {
	blockAnchor: number;
	blocks: BlockInterface[];
	questions: QuestionInterface[];
	questionsGrid: string;
	script: string;
	switch: string;
}

export interface PostQuestionsStatsInterface {
	id: number;
	questions: {
		id: number;
		users: Record<string, number>[];
	}[];
	title: string;
	type: string;
}

export interface PostQuestionsForOneUserStatsInterface {
	id: number;
	questions: {
		id: number;
		result: number;
	}[];
	sum: number;
	title: string;
	total: number;
}
