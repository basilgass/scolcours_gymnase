import type { ComputedRef, Ref } from "vue"
import type { BlockInterface } from "@/types/blockInterfaces.ts"
import type { ChapterInterface } from "@/types/chapterInterfaces.ts"
import type { ScoreInterface, ScoreCardDataInterface, ScoreDeckDataInterface } from "@/types/scoreInterfaces.ts"

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
	active: boolean,
	title: string,
	user: ScoreInterface<ScoreDeckDataInterface>
}

export interface provideDeckData {
	title: string,
	cards: Ref<CardInterfaceExtended[]>,
	currentCardId: Ref<number>,
	done: () => void,
	intro: Ref<boolean>,
	loggedIn: ComputedRef<boolean>,
	reset: () => void
	running: ComputedRef<boolean>,
}
