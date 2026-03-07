import type { ChapterInterface } from "@/types/chapterInterfaces.ts"
import type { BlockInterface } from "@/types/blockInterfaces.ts"
import type { QuestionInterface } from "@/types/postInterfaces.ts"
import type { UserInterface } from "@/types/userInterfaces.ts"

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
