<script setup lang="ts">

import {BlockInterface, type CardInterface} from "@/types/modelInterfaces.ts"
import {makeBlock} from "@/helpers/makeModel.ts"
import DeckCardItemSide from "@/Components/Decks/Parts/DeckCardItemSide.vue"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

const props = defineProps<{
	blocks: BlockInterface[]
}>()

const cards = computed<CardInterface[]>(() => {
	return props.blocks.map(block => blockToDeckCard(block))
})

const splitters = ref<string[]>(Array.from({length: props.blocks.length}, () => ""))

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

function blockToDeckCard(block: BlockInterface, splitter?: undefined | null | 'title' | string): CardInterface {
	const title = block.title

	if (splitter === 'title' && title) {
		// On utilise le titre comme carte recto.
		return {
			id: -1,
			user: null,
			recto: makeBlock(title),
			verso: block
		}
	}

	const splitterString = splitter ?? '='
	return {
		id: -1,
		user: null,
		recto: makeBlock(truncateLatexMath(block.body, splitterString)),
		verso: block
	}
}

defineEmits<{
	add: [blockId: number, splitter?: string]
}>()

</script>

<template>
	<div class="grid grid-cols-1 gap-5">
		<div
			v-for="(card, index) in cards"
			:key="`card-${card.id}`"
			class="flex flex-col gap-2"
		>
			<div class="flex justify-end">
				<form-maker
					v-model="splitters[index]"
					xs
					inline-label
					label="splitter"
				/>
				<sc-button
					type="add"
					icon
					xs
					outline
					@click="$emit('add', blocks[index].id, splitters[index])"
				>
					ajouter la carte
				</sc-button>
			</div>
			<div class="grid grid-cols-2 gap-5">
				<deck-card-item-side
					xs
					class="bg-content border"
					:block="card.recto"
				/>
				<deck-card-item-side
					xs
					class="bg-content border"
					:block="card.verso"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
