import {BlockInterface, CardInterface, DeckInterface} from "@/types/modelInterfaces.ts"

export function makeBlock(body: string, title?: string, type?: string): BlockInterface {
	return {
		id: -1,
		active: true,
		order: 0,
		merge: false,
		switch: false,
		type: type ?? '',
		title: title ?? '',
		body,
		template: '',
		illustrationsGrid: '',
		illustrations: [],
		script: '',
		json: ''
	}
}

export function makeDeck(
	title: string,
	cards: CardInterface[]
): DeckInterface {

	return {
		id: -1,
		title,
		slug: title,
		chapter_id: 0,
		cards_count: cards.length,
		cards,
	}
}

export function makeCard(
	recto: string | BlockInterface,
	verso: string | BlockInterface,
): CardInterface {
	return {
		id: -1,
		recto: typeof recto === 'string' ? makeBlock(recto) : recto,
		verso: typeof verso === 'string' ? makeBlock(verso) : verso,
		score: {
			id: -1,
			score: 0,
			appearances: 0,
			success: 0,
			time_spent: 0,
		}
	}
}
