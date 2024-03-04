import { ThemeInterface, User } from "@/types/index"

export interface UserInterface {
	id: number;
	name: string;
	firstname: string;
	fullname: string;
	email: string;
	teams: { id: number, name: string }[];
}

export interface ChapterInterface {
	id: number;
	slug: string;
	title: string;
	meta_title: string;
	block: BlockInterface;
	active: boolean;
	updated_at: string;
	posts: PostInterface[];
	challenges: {
		id: number
		slug: string
		title: string
	}[];
	relations: {
		id: number
		slug: string
		title: string
		theme_id: number
	}[];
}


export interface ChapterMinInterface {
	id: number;
	slug: string;
	title: string;
	meta_title: string;
	theme_id: number;
}

export interface BlockInterface {
	id: number;
	order: number;
	blur: boolean;
	switch: string | boolean;
	type: string;
	title: string;
	body: string;
	template: string;
	illustrationsGrid: string;
	illustrations: IllustrationInterface[];
	script: string;
	json: string;
}
export interface BlockInterfaceExtended extends BlockInterface {
	isNew?: boolean
}

export interface IllustrationInterface {
	id: number;
	block_id: number;
	order: number;
	title: string;
	css: string;
	value: string;
	type: string;
	widget_id: number;
	widget: widgetInterface;
	parameters: string;
	code: string;
	isNew?: boolean;
}

export interface QuestionInterface {
	id: number;
	order: number;
	displayIf: boolean | string;
	css: string;
	body: string;
	block: {
		id: number
		title: string
		body: string
		illustration: IllustrationInterface
	};
	answer: string;
	checker: string;
	keyboard: string;
	user: {
		answer: string
		result: boolean
		attempts: number
		update_at: string
	};
}

export interface QuestionMinInterface {
	body: string;
	block: {
		title: string
		body: string
		illustration: IllustrationInterface
	};
	answer: string;
	keyboard: string;
	user: {
		result: boolean
	};
}

export interface PostInterface {
	id: number;
	chapter_id: number;
	type: string;
	title: string;
	order: number;
	blockAnchor: number;
	numberOfVisibleBlocks: number;
	active: number;
	script: string;
	switch: string;
	blocks: BlockInterface[];
	questions: QuestionInterface[];
	questionsGrid: string;
}

export interface EvaluationInterface {
	id: number;
	slug: string;
	title: string;
	body: string;
	randomOrder: boolean;
	owner: User;
	questions: QuestionInterface[];
}

export interface GeneratorInterface {
	id: number;
	slug: string;
	theme: ThemeInterface;
	title: string;
	body: string;
	template: string;
	keyboard: string;
	code: string;
	pivot: {
		order: number
	};
}

export interface ChallengeInterface {
	id: number;
	chapter: ChapterInterface;
	slug: string;
	active: boolean;
	title: string;
	block: BlockInterface;
	maxLevel: number;
	nextLevelAfter: number;
	duration: number;
	lives: number;
	bonusScoreTrigger: number;
	bonusScoreLife: number;
	bonusScoreTime: number;
	bonusLevelLife: number;
	bonusLevelTime: number;
	generators: GeneratorInterface[];
	updated_at: string;
}

export interface flipcardsInterface {
	id: number,
	recto: BlockInterface,
	verso: BlockInterface,
	result?: boolean
}

export interface deckInterface {
	id: number,
	title: string,
	slug: string,
	flipcards: flipcardsInterface[]
}

export interface widgetInterface {
	id: number,
	name: string,
	slug: string,
	component: string,
	theme_id: number,
	description: string,
	control: boolean
}

export interface TeamInterface {
	id: number,
	name: string,
	users: UserInterface[]
}

export interface PostQuestionsStatsInterface {
	id: number;
	title: string;
	type: string;
	questions: {
		id: number;
		users: { [key: string]: number }[];
	}[];
}

export interface PostQuestionsForOneUserStatsInterface {
	id: number;
	title: string;
	questions: {
		id: number;
		result: number;
	}[];
	sum: number;
	total: number;
}

export interface QuizzInterface {
	id: number
	title: string
	body: string
}

export interface QuizzSessionInterface {
	shortcode: string
	quizz: {
		title: string
		theme: ThemeInterface
	}
}

export interface TranslationUnitInterface {
	id: number
	language: string
	unit: string
	title: string
}
