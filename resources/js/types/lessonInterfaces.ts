import {ChallengeInterface, DeckInterface, GeneratorInterface, PostShowInterface} from "@/types/modelInterfaces.ts"

export interface LessonChallengeScoreRules {
	target: number,
	level?: number,
	occurrences?: number
}

export interface LessonGeneratorScoreRules {
	target: number,
	occurrences?: number
}


export interface LessonDeckScoreRules {
	target?: number
}

export interface LessonPostScoreRules {
	target?: number,
	question_ids?: number[] // TODO: FormMaker Json type cannot handle this.
}

export type lessonableClassName = 'Post' | 'Challenge' | 'Deck' | 'Generator'
export type lessonableModel = PostShowInterface | DeckInterface | ChallengeInterface | GeneratorInterface
export type LessonScoreRulesInterface =
	LessonDeckScoreRules
	| LessonChallengeScoreRules
	| LessonGeneratorScoreRules
	| LessonPostScoreRules
	| null

