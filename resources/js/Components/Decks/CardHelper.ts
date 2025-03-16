import {BlockInterface, CardInterface, UserDeckCardsInterface} from "@/types/modelInterfaces.ts"
import card from "@/Components/Ui/Card.vue"

// TODO: centralize makeBlock
export function makeBlock(body: string, title?: string): BlockInterface {
	return {
		id: -1,
		active: true,
		order: 0,
		merge: false,
		switch: false,
		type: '',
		title: title ?? '',
		body,
		template: '',
		illustrationsGrid: '',
		illustrations: [],
		script: '',
		json: ''
	}
}

export function makeCard(usercard: UserDeckCardsInterface): CardInterface {
	if (usercard.blocks.length === 0) {
		return {
			recto: makeBlock('aucune carte créée'),
			verso: makeBlock('aucune carte créée'),
			result: false
		}
	}

	// On a deux blocks: un rector, un verso.
	if (usercard.blocks.length === 2) {
		return {
			recto: usercard.blocks[0],
			verso: usercard.blocks[1],
			result: false
		}
	}

	// On a un block.
	// S'il y a un titre, le titre est le recto, le block est le verso.
	if (usercard.blocks[0].title) {
		return {
			recto: makeBlock(usercard.blocks[0].title),
			verso: usercard.blocks[0],
			result: false
		}
	}

	// S'il n'y a pas de titre, on coupe sur le signe égal du block, si il y en a un.
	const body = usercard.blocks[0].body
	const parts = body.split('=') // On coupe sur le signe égal.

	if(parts.length >=2) {
		return {
			recto: makeBlock(parts[0] + '"\\]'), // on suppose d'office que le "=" est dans partie TeX.
			verso: makeBlock(body), // le verso est la réponse, soit tout le block.
			result: false
		}
	}

	// Il n'y a pas de signe égal... le block n'est pas gérable automatiquement

	return {
		recto: makeBlock('carte non gérée'),
		verso: makeBlock('carte non gérée'),
		result: false
	}
}
