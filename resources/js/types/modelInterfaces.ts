import {ComputedRef, Ref} from "vue"
import {lessonableClassName, LessonScoreRulesInterface} from "@/types/lessonInterfaces.ts"
import {
	scoreableClassName,
	ScoreCardDataInterface,
	ScoreDataInterface,
	ScoreDeckDataInterface,
	ScoreGeneratorDataInterface,
	ScoreLessonDataInterface,
	ScoreQuestionDataInterface
} from "@/types/scoreInterfaces.ts"

export interface UserInterface {
	id: number;
	name: string;
	firstname: string;
	fullname: string;
	email: string;
	teams?: { id: number, name: string }[];
}

export interface ChapterInterface {
	id: number;
	slug: string;
	title: string;
	meta_title: string;
	theme_id: number;
	block: {
		id: number,
		body: string
	},
	active: boolean;
	url: string;
	updated_at: string;
	modified: string;
}

export interface ChapterShowInterface extends ChapterInterface {
	block: BlockInterface;
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

export interface IllustrationInterface {
	id: number;
	block_id: number;
	order: number;
	title: string;
	css: string;

	widget_id: number;
	widget: WidgetInterface;

	parameters: string;
	code: string;
	isNew?: boolean;
}

export interface QuestionDynamicInterface {
	block: BlockMinInterface;
	answer: string;
	keyboard: string;
	user: {
		is_resolved: boolean
	};
}

export interface QuestionInterface extends QuestionDynamicInterface {
	id: number;
	order: number;
	displayIf: null | string;
	css: string;
	user: ScoreInterface<ScoreQuestionDataInterface>;
}


export interface PostInterface {
	id: number;
	chapter_id: number;
	type: string;
	title: string;
	order: number;
	active: number;
	updated_at: string;
	questionsInfo: {
		count: number,
		answered: number
	};
}

export interface PostShowInterface extends PostInterface {
	blockAnchor: number;
	script: string;
	switch: string;
	blocks: BlockInterface[];
	questions: QuestionInterface[];
	questionsGrid: string;
}

export interface User {
	id: number
	name: string
	firstname: string
	fullname: string
	email: string
	email_verified_at: string
	role: string
}

export interface ThemeNameInterface {
	id: number,
	slug: string
}

export interface ThemeInterface {
	id: number
	slug: string
	title: string
	order: number
	color: string
	icon: string
	enabled: boolean
}

export interface ToolInterface {
	id: number
	slug: string
	title: string
	body: string
	parameters: string
	theme_id: number
	updated_at: string
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
	title: string;
	theme_id: number;
	body: string;
	template: string;
	keyboard: string;
	code: string;
	order: number;
	user?: ScoreInterface<ScoreGeneratorDataInterface>
}

export interface ChallengeScoreInterface {
	score: number,
	level: number
}

export type ChallengeGameState = "intro" | "running" | "finished"

export interface ChallengeMinInterface {
	id: number;
	slug: string;
	active: boolean;
	title: string;
	chapter: ChapterInterface;
	block: BlockInterface;
}

export interface ChallengeMinInterface {
	id: number;
	slug: string;
	title: string;
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
	chapter: ChapterInterface;
	theme_id: number;
	block: BlockInterface;
	best: ChallengeScoreInterface;
	user: ChallengeScoreInterface;
	generators: GeneratorInterface[];
}

export interface CardInterface {
	id: number,
	recto: null | BlockInterface,
	verso: null | BlockInterface,
	reference?: null | {
		block: BlockInterface,
		splitter: undefined | null | 'title' | string
	}
	user?: Partial<ScoreInterface<ScoreCardDataInterface>>
}

export interface CardInterfaceExtended extends CardInterface {
	current_appearances: number,
	current_score: number,
	current_time_spent: number,
}

export interface DeckInterface {
	id: number,
	title: string,
	slug: string,
	chapter: ChapterInterface,
	cards_count: number,
	cards: CardInterface[],
	user: ScoreInterface<ScoreDeckDataInterface>
}

export interface provideDeckData {
	currentCardId: Ref<number>,
	cards: Ref<CardInterfaceExtended[]>,
	intro: Ref<boolean>,
	running: ComputedRef<boolean>,
	loggedIn: ComputedRef<boolean>,
	done: () => void,
	reset: () => void
}

export interface WidgetInterface {
	id: number,
	name: string,
	slug: string,
	component: string,
	description: string,
	theme_id: number,
	control: boolean
}

export interface WidgetPropsInterface {
	parameters: string;
	code: string;
}

export interface TeamInterface {
	id: number,
	name: string,
	users: UserInterface[]
}

export interface UserTeamInterface {
	id: number,
	name: string,
	calendar: {
		id: number,
		day: number,	// 0, 1, 2, 3, 4, 5, 6, 7
		time: string,    // hh:mm:ss
	}[]
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
	slug: string
	title: string
	body: string
}

export interface QuizzSessionInterface {
	shortcode: string
	quizz: {
		title: string
		theme_id: number
	}
}

export interface TranslationLanguageInterface {
	slug: string
	name: string
}

export interface TranslationUnitInterface {
	id: number
	title: string
}

export interface TranslationWord {
	id: number,
	fr: string,
	foreign: string,
	result?: boolean,
	errors?: number
}

export interface TranslationUnitInterfaceExtended extends TranslationUnitInterface {
	selected: boolean
	words: TranslationWord[]
}

export interface FormulaInterface {
	id: number
	theme_id: number
	chapter: {
		id: number,
		slug: string,
		title: string
	}
	order: number
	block: BlockInterface
}

export interface BookInterface {
	id: number,
	slug: string,
	title: string,
	cover: string
}


export interface CourseInterface {
	id: number,
	title: string,
	slug: string,
	status: 'not yet started' | 'active' | 'finished',
	scheduled_at: string,
	theme_id: number,
	block: BlockInterface,
	lessons: LessonInterface[],
	teams?: UserTeamInterface[],
	created_at: string,
	updated_at: string,
}

export interface LessonInterface<T extends LessonScoreRulesInterface = LessonScoreRulesInterface> {
	id: number,
	title: string,
	course_id: number,
	requires: number[],
	lessonable_id: number | null,
	lessonable_type: lessonableClassName | null,
	scoreRules: T,
	user: ScoreInterface<ScoreLessonDataInterface>,
	scheduled_at: string,
	remaining_time: string,
	created_at: string,
	updated_at: string,
}

export interface ScoreInterface<T extends ScoreDataInterface = ScoreDataInterface> {
	id: number,
	user_id: number,
	score: number,
	scoreable_id: number,
	scoreable_type: scoreableClassName,
	is_resolved: boolean,
	attempts: number,
	data: T,
	updated_at: string
}
