import {ChallengeInterface, DeckInterface, GeneratorInterface, PostShowInterface} from "@/types/modelInterfaces.ts"

export const lessonIconsColors = {
	done: 'bg-green-100 text-green-600 border-green-300',
	past: 'bg-red-100 text-red-600 border-red-300',
	empty: 'bg-blue-100 text-blue-600 border-blue-300'
}
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
	question_ids?: number[]
}

export type lessonableClassName = 'Post' | 'Challenge' | 'Deck' | 'Generator'
export type lessonableModel = PostShowInterface | DeckInterface | ChallengeInterface | GeneratorInterface
export type LessonScoreRulesInterface =
	LessonDeckScoreRules
	| LessonChallengeScoreRules
	| LessonGeneratorScoreRules
	| LessonPostScoreRules
	| null

