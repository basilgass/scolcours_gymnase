import {BlockInterface, type CardInterface} from "@/types/modelInterfaces.ts"
import {makeBlock} from "@/helpers/makeModel.ts"

function truncateLatexMath(text: string, splitter: string): string {
	const mathBlockRegex = /\\\[(.*?)\\\]/gs

	return text.replace(mathBlockRegex, (match, content) => {
		const index = content.indexOf(splitter)
		if (index === -1) return match

		const keep = content.slice(0, index + splitter.length)
		const hidden = content.slice(index + splitter.length).trim()
		return `\\[${keep} \\phantom{ ${hidden} }\\]`
	})
}

function blockToDeckCard(block: BlockInterface, splitter: undefined | null | 'title' | string): BlockInterface {
	const title = block.title

	if (splitter === 'title' && title) {
		// On utilise le titre comme carte recto.
		return makeBlock(title)
	}

	const splitterString = splitter ?? '='
	return makeBlock(truncateLatexMath(block.body, splitterString))
}


export function computedCard(card: CardInterface): CardInterface & { recto: BlockInterface, verso: BlockInterface } {
	if (card.recto && card.verso) {
		return card
	}

	if (card.reference?.block) {
		const recto = blockToDeckCard(card.reference.block, card.reference.splitter)

		return {
			...card,
			recto,
			verso: card.reference.block
		}

	}

	return null
}
