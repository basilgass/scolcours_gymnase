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
	theme: {
		id: number
		slug: string
	};
	challenges: {
		id: number
		slug: string
		title: string
	}[];
	relations: {
		id: number
		slug: string
		title: string
		theme: {
			id: number
			slug: string
		};
	}[];
}


export interface ChapterMinInterface {
	id: number;
	slug: string;
	title: string;
	meta_title: string;
	theme: {
		id: number
		slug: string
	};
	posts_length: number;
}

// TODO: ChapterMiniInterface vs CHapterMinInterface ?
export interface ChapterMiniInterface {
	id: number
	title: string
	url: string
	modified: string
	body: string
}

export interface BlockMinInterface {
	id: number
	title: string
	body: string
	illustration: IllustrationInterface
}

export interface BlockInterface {
	id: number;
	active: boolean;
	order: number;
	merge: boolean;
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

export interface QuestionMinInterface {
	block: BlockMinInterface;
	answer: string;
	keyboard: string;
	user: {
		result: boolean
	};
}
export interface QuestionInterface extends QuestionMinInterface{
	id: number;
	order: number;
	displayIf: null | string;
	css: string;
	user: {
		answer: string
		result: boolean
		attempts: number
		update_at: string
	};
}



//TODD: modify PostInterfae
export interface PostInterface {
	id: number;
	chapter_id: number;
	chapter: ChapterMinInterface;
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

export interface ChallengeScoreInterface {
	score: number,
	level: number
}

export interface ChallengeInterface {
	id: number;
	slug: string;
	active: boolean;
	title: string;
	maxLevel: number;
	nextLevelAfter: number;
	duration: number;
	lives: number;
	bonusScoreTrigger: number;
	bonusScoreLife: number;
	bonusScoreTime: number;
	bonusLevelLife: number;
	bonusLevelTime: number;
	updated_at: string;
	chapter: ChapterMinInterface;
	block: BlockInterface;
	best: ChallengeScoreInterface;
	user: ChallengeScoreInterface;
	generators: GeneratorInterface[];
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
	chapter: {
		id: number;
		slug: number;
	},
	theme: {
		id: number;
		slug: number;
	},
	flipcards: flipcardsInterface[]
}

export interface widgetInterface {
	id: number,
	name: string,
	slug: string,
	component: string,
	theme: {
		id: number;
		slug: number;
	},
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
		users: Record<string, number>[];
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

export interface TranslationLanguageInterface{
	slug: string
	name: string
}

export interface TranslationUnitInterface {
	id: number
	unit: string
	title: string
}

export interface TranslationWord {
	id: number,
	fr: string,
	foreign: string,
	definition: string,
	examples: string
}

export interface TranslationUnitInterfaceExtended extends TranslationUnitInterface {
	selected: boolean
	words: TranslationWord[]
}

export interface FormulaInterface {
	id: number
	order: number
	chapter: {
		id: number
		title: string
		theme: {
			id: number
			slug: string
		};
	}
	block: BlockInterface
}

export interface BookInterface {
	id: number,
	slug: string,
	name: string,
	cover: string
}
