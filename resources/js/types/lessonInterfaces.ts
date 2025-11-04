import {
	ChallengeInterface,
	DeckInterface,
	GeneratorInterface,
	LessonInterface,
	PostShowInterface,
	TeamInterface
} from "@/types/modelInterfaces.ts"
import {Dayjs} from "dayjs"

export const lessonIconsColors = {
	done: 'bg-green-100 text-green-600 border-green-300',
	past: 'bg-red-100 text-red-600 border-red-300',
	empty: 'bg-blue-100 text-blue-600 border-blue-300'
}

export interface LessonChallengeScoreRules {
	level?: number,
	occurrences?: number
	target: number,
}

export interface LessonGeneratorScoreRules {
	occurrences?: number
	target: number,
}


export interface LessonDeckScoreRules {
	target?: number
}

export interface LessonPostScoreRules {
	question_ids?: number[]
	target?: number,
}

export type lessonableClassName = 'Post' | 'Challenge' | 'Deck' | 'Generator'
export type lessonableModel = PostShowInterface | DeckInterface | ChallengeInterface | GeneratorInterface
export type LessonScoreRulesInterface =
	LessonDeckScoreRules
	| LessonChallengeScoreRules
	| LessonGeneratorScoreRules
	| LessonPostScoreRules
	| null

export interface timetableInterface {
	end: string
	id: number,
	period: number,
	start: string,
}

export interface weekCalendarInterface {
	day: Dayjs
	lesson: LessonInterface
	team: TeamInterface
}

export type itemInTimetableInterface = Record<number, weekCalendarInterface[]>

export interface weekCalendarDagTransferInterface {
	day: Dayjs,
	lesson_id: number,
	team_id: number
}
