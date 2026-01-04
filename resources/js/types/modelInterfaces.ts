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
	email: string;
	firstname: string;
	fullname: string;
	id: number;
	name: string;
	teams?: { id: number, name: string }[];
}

export interface ChapterInterface {
	active: boolean;
	block: {
		id: number,
		body: string
	},
	id: number;
	meta_title: string;
	modified: string;
	slug: string;
	theme_id: number;
	title: string;
	updated_at: string;
	url: string;
}

export interface ChapterShowInterface extends ChapterInterface {
	block: BlockInterface;
}

export interface BlockMinInterface {
	body: string
	id: number
	illustration: IllustrationInterface | null | undefined
	title: string
}

export interface BlockInterface {
	active: boolean;
	body: string;
	id: number;
	illustrations: IllustrationInterface[];
	illustrationsGrid: string;
	json: string;
	merge: boolean;
	order: number;
	script: string;
	switch: string | boolean;
	template: string;
	title: string;
	type: string;
}

export interface IllustrationMinInterface {
	widget: {
		component: string
	},
	parameters: string
	code: string,
}

export interface IllustrationInterface {
	block_id: number;
	code: string;
	css: string;
	id: number;
	isNew?: boolean;
	order: number;
	parameters: string;
	title: string;
	widget: WidgetInterface;
	widget_id: number;
}

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

export interface User {
	email: string
	email_verified_at: string
	firstname: string
	fullname: string
	id: number
	name: string
	role: string
}

export interface ThemeNameInterface {
	id: number,
	slug: string
}

export interface ThemeInterface {
	color: string
	enabled: boolean
	icon: string
	id: number
	order: number
	slug: string
	title: string
}

export interface ToolInterface {
	body: string
	id: number
	parameters: string
	slug: string
	theme_id: number
	title: string
	updated_at: string
}

export interface EvaluationInterface {
	auto_control: boolean;
	body: string;
	id: number;
	questions: QuestionInterface[];
	randomOrder: boolean;
	slug: string;
	title: string;
}

export interface EvaluationAdminInterface extends EvaluationInterface {
	teams: TeamInterface[]
}

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

export interface ChallengeMinInterface {
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
	generators: GeneratorInterface[];
	id: number;
	lives: number;
	maxLevel: number;
	nextLevelAfter: number;
	slug: string;
	theme_id: number;
	title: string;
	updated_at: string;
	user: ChallengeScoreInterface;
}

export interface CardInterface {
	id: number,
	recto: null | BlockInterface,
	reference?: null | {
		block: BlockInterface,
		splitter: undefined | null | 'title' | string
	}
	user?: Partial<ScoreInterface<ScoreCardDataInterface>>
	verso: null | BlockInterface,
}

export interface CardInterfaceExtended extends CardInterface {
	current_appearances: number,
	current_score: number,
	current_time_spent: number,
}

export interface DeckInterface {
	cards: CardInterface[],
	cards_count: number,
	chapter: ChapterInterface,
	id: number,
	slug: string,
	title: string,
	user: ScoreInterface<ScoreDeckDataInterface>
}

export interface provideDeckData {
	cards: Ref<CardInterfaceExtended[]>,
	currentCardId: Ref<number>,
	done: () => void,
	intro: Ref<boolean>,
	loggedIn: ComputedRef<boolean>,
	reset: () => void
	running: ComputedRef<boolean>,
}

export interface WidgetInterface {
	id: number,
	component: string,
	slug: string,
	name: string,
	theme_id: number,
	description: string,
	control: boolean
}

export interface WidgetPropsInterface {
	code: string;
	parameters: string;
}

export interface TeamInterface {
	active: boolean,
	calendar: TeamCalendarInterface[]
	id: number,
	name: string,
	users: UserInterface[],
}

export interface TeamCalendarInterface {
	day: number,// 0, 1, 2, 3, 4, 5, 6, 7
	id: number,
	time: string// hh:mm:ss
}

export interface UserTeamInterface {
	calendar: TeamCalendarInterface[]
	id: number,
	name: string,
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

export interface QuizzInterface {
	chapter: ChapterInterface,
	id: number
	intro: BlockInterface,
	outro: BlockInterface,
	questions_count: number,
	sessions: QuizzSessionInterface[]
	title: string
}

export interface QuizzSessionInterface {
	current: number,
	enable: boolean,
	id: number,
	projection: string, // TODO: define projection value.
	questions: QuestionInterface[],
	quizz: {
		id: number
		title: string
	},
	shortcode: string
	showAnswer: boolean,
	status: 'intro' | 'outro' | 'question' | 'error',
	total: number,
	users: UserInterface[]
}

export interface TranslationLanguageInterface {
	name: string
	slug: string
}

export interface TranslationUnitInterface {
	id: number
	title: string
}

export interface TranslationWord {
	errors?: number
	foreign: string,
	fr: string,
	id: number,
	result?: boolean,
}

export interface TranslationUnitInterfaceExtended extends TranslationUnitInterface {
	selected: boolean
	words: TranslationWord[]
}

export interface FormulaInterface {
	block: BlockInterface
	chapter: {
		id: number,
		slug: string,
		title: string
	}
	id: number
	order: number
	theme_id: number
}

export interface BookInterface {
	cover: string
	id: number,
	slug: string,
	title: string,
}

export interface CourseMinInterface {
	block: BlockInterface,
	created_at: string,
	id: number,
	slug: string,
	theme_id: number,
	title: string,
	updated_at: string,
}

export interface CourseInterface extends CourseMinInterface {
	lessons: LessonInterface[],
	scheduled_at: string,
	status: 'not yet started' | 'active' | 'finished',
	teams?: UserTeamInterface[],
}

export interface LessonInterface<T extends LessonScoreRulesInterface = LessonScoreRulesInterface> {
	id: number,
	course_id: number,
	created_at: string,
	homework: boolean,
	lessonable_id: number | null,
	lessonable_tag: 'exercise' | 'howto' | null,
	lessonable_type: lessonableClassName | null,
	remaining_time: string,
	requires: number[],
	scheduled_at: string,
	scoreRules: T,
	title: string,
	updated_at: string,
	user: ScoreInterface<ScoreLessonDataInterface>,
}

export interface ScoreInterface<T extends ScoreDataInterface = ScoreDataInterface> {
	attempts: number,
	data: T,
	id: number,
	is_resolved: boolean,
	score: number,
	scoreable_id: number,
	scoreable_type: scoreableClassName,
	updated_at: string
	user_id: number,
}
