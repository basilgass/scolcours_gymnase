import {ChallengeInterface, DeckInterface, GeneratorInterface, PostShowInterface} from "@/types/modelInterfaces.ts"

export interface LessonChallengeParameters {
	target: number,
	level?: number,
	occurrences?: number
}

export interface LessonGeneratorParameters {
	target: number,
	occurrences?: number
}


export interface LessonDeckParameters {
	target?: number
}

export interface LessonPostParameters {
	target: number,
	question_ids?: number[]
}

export type lessonableClassName = 'Post' | 'Challenge' | 'Deck' | 'Generator'
export type lessonableModel = PostShowInterface | DeckInterface | ChallengeInterface | GeneratorInterface
export type LessonParametersInterface =
	LessonDeckParameters
	| LessonChallengeParameters
	| LessonGeneratorParameters
	| LessonPostParameters
	| null

