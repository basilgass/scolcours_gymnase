import {
	BlockInterface,
	CardInterface,
	DeckInterface,
	IllustrationInterface,
	IllustrationMinInterface
} from "@/types/modelInterfaces.ts"

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

export function makeIllustration(config: IllustrationMinInterface): IllustrationInterface {
	return {
		id: -1,
		block_id: -1,
		code: config.code,
		parameters: config.parameters,
		css: '',
		order: 0,
		title: '',
		footer: '',
		widget_id: -1,
		widget: {
			id: -1,
			component: 'draw-parser-widget.vue',
			slug: 'dynamic-widget',
			name: 'dynamic-widget',
			theme_id: null,
			description: '',
			control: false,
			...config.widget
		}
	}
}

export function makeDeck(
	title: string,
	cards: CardInterface[]
): DeckInterface {

	return {
		id: -1,
		title,
		active: true,
		slug: title,
		cards_count: cards.length,
		cards,
		chapter: null,
		user: null
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
		user: {
			id: -1,
			score: 0,
			attempts: 0,
			data: null,
			is_resolved: false,
		}
	}
}
