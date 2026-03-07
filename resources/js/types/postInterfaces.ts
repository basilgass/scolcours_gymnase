import type { BlockMinInterface, BlockInterface, IllustrationMinInterface } from "@/types/blockInterfaces.ts"
import type { ScoreInterface, ScoreQuestionDataInterface } from "@/types/scoreInterfaces.ts"

export interface QuestionDynamicInterface {
	answer: string;
	equationControl: string;
	block: BlockMinInterface;
	keyboard: string;
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
	type: string;
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
