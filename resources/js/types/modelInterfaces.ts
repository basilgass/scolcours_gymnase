import type {lessonableClassName, LessonScoreRulesInterface} from "@/types/lessonInterfaces.ts"
import type {ScoreInterface, ScoreLessonDataInterface} from "@/types/scoreInterfaces.ts"
import type {BlockInterface} from "@/types/blockInterfaces.ts"
import {Ref} from "vue"

// Re-exports depuis les fichiers domaine (rétrocompatibilité)
export type {
	UserInterface, TeamInterface, TeamCalendarInterface
} from "@/types/userInterfaces.ts"
export type {WidgetInterface, WidgetPropsInterface} from "@/types/widgetInterfaces.ts"
export type {
	IllustrationMinInterface, IllustrationInterface, BlockMinInterface, BlockInterface
} from "@/types/blockInterfaces.ts"
export type {
	ThemeNameInterface, ThemeInterface, ChapterInterface, ChapterShowInterface
} from "@/types/chapterInterfaces.ts"
export type {
	QuestionDynamicInterface,
	QuestionInterface,
	PostInterface,
	PostShowInterface,
	PostQuestionsStatsInterface,
	PostQuestionsForOneUserStatsInterface
} from "@/types/postInterfaces.ts"
export type {
	GeneratorInterface,
	ChallengeScoreInterface,
	ChallengeGameState,
	ChallengeMinInterface,
	ChallengeInterface,
	ChallengeLevelInterface,
	ChallengeAnswerInterface,
	ChallengeGameInterface
} from "@/types/challengeInterfaces.ts"
export type {CardInterface, CardInterfaceExtended, DeckInterface, provideDeckData} from "@/types/deckInterfaces.ts"
export type {EvaluationInterface, EvaluationAdminInterface} from "@/types/evaluationInterfaces.ts"
export type {QuizzInterface, QuizzSessionInterface} from "@/types/quizzInterfaces.ts"
export type {CourseMinInterface, CourseInterface} from "@/types/courseInterfaces.ts"
export type {ScoreInterface} from "@/types/scoreInterfaces.ts"

// LessonInterface gardée ici en raison de la dépendance circulaire avec lessonInterfaces.ts
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

// Interfaces non encore déplacées dans un fichier domaine
export interface ToolInterface {
	body: string
	id: number
	parameters: string
	slug: string
	theme_id: number
	title: string
	updated_at: string
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

export interface LanguageInterface {
	game: "list" | "type" | "memory" | "guess" | "deck" | "match",
	language: {
		slug: string,
		name: string,
		determinants: string,
		books: BookInterface[]
	},
}

export interface LanguageDataInterface extends LanguageInterface {
	units: Ref<TranslationUnitInterfaceExtended[]>,
	state: Ref<"intro" | "running" | "finished">,
	words: Ref<TranslationWord[]>
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
