<script
	lang="ts"
	setup
>

import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { flashInterface } from "@/types"
import type { deckInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import { inject, PropType, ref } from "vue"

const props = defineProps({
	deck: { type: Object as PropType<deckInterface>, required: true }
})

const  editMode  = useStoreEditMode()
const flash = inject<flashInterface>('flash')

const theDeck = ref(props.deck)

const showMarkdown = ref(-1)
function addCard() {
	axios.post(route("decks.addFlipcard", [props.deck.id]))
		.then(res => {
			theDeck.value.flipcards.push(res.data)
		})
		.catch(err => {
			console.log(err.response.data.message)
		})
}

function deleteFlipcard(flipcardID) {
	axios.delete(route("flipcards.destroy", [flipcardID]))
		.then(() => {
			theDeck.value.flipcards = theDeck.value.flipcards.filter(flipcard => flipcard.id !== flipcardID)
		})
}

function updateDecksOrder() {
	axios
		.post(route("decks.updateOrder"), {
			order: theDeck.value.flipcards.map((x, index) => {
				return { id: x.id, order: index }
			})
		})
		.then((res) => {
			console.log(res)
			flash.success(
				"L'ordre des cartes à bien été enregistré !"
			)
		})
		.catch((res) => {
			// toDO: Show error message
			console.log(res)
			console.warn("update ordering order: ", res.data)
		})
}
</script>

<template>
	<article>
		<draggable
			v-model="theDeck.flipcards"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !$page.props.auth.can.admin,
			}"
			class="grid grid-cols-1 gap-5"
			@end="updateDecksOrder"
		>
			<template #item="{ element }">
				<div class="bg-gray-200 p-2">
					<div class="flex justify-between px-2 pb-2 items-center">
						<div class="draggable-handle cursor-move text-xs">
							<i class="bi bi-arrows-move mr-2" />id: {{ element.id }}
						</div>
						<confirm-button
							class="btn btn-delete btn-xs"
							@confirm="deleteFlipcard(element.id)"
						>
							supprimer
						</confirm-button>
					</div>
					<div class="grid grid-cols-2 gap-5">
						<div class="relative">
							<form-maker
								v-if="editMode.enable"
								v-model="element.recto.body"
								type="code"
								class="w-full rounded-xl min-h-[200px]"
								rows="10"
								@focus="showMarkdown = element.id"
								:axios="{
									model: 'Block',
									id: element.recto.id,
									column: 'body',
									button: true
								}"
							/>
							<div
								class="absolute right-0 bottom-0 p-2 cursor-pointer z-10"
								@click="router.visit(route('blocks.edit', element.recto.id))"
							>
								<i class="bi bi-pencil" />
							</div>
						</div>
						<div class="relative">
							<form-maker
								v-if="editMode.enable"
								v-model="element.verso.body"
								type="code"
								class="w-full"
								rows="10"
								@focus="showMarkdown = element.id"
								:axios="{
									model: 'Block',
									id: element.verso.id,
									column: 'body',
									button: true
								}"
							/>
							<div
								class="absolute right-0 bottom-0 p-2 cursor-pointer z-10"
								@click="router.visit(route('blocks.edit', element.verso.id))"
							>
								<i class="bi bi-pencil" />
							</div>
						</div>
					</div>
					<div v-if="showMarkdown === element.id || !editMode.enable">
						<div
							class="text-lg flex justify-between mt-3"
							v-show="editMode.enable"
						>
							<div>Prévisualisation</div>
							<button @click="showMarkdown = -1">
								<i class="bi bi-x-lg" />
							</button>
						</div>
						<div class="grid grid-cols-2 gap-5">
							<markdown-it
								:text="element.recto.body"
								class="w-full px-3 border bg-white border-slate-200"
							/>
							<markdown-it
								v-if="showMarkdown === element.id"
								:text="element.verso.body"
								class="w-full px-3 border bg-white border-slate-200"
							/>
						</div>
					</div>
				</div>
			</template>
		</draggable>


		<div class="text-center mt-20">
			<button
				class="btn btn-add"
				@click="addCard"
			>
				Ajouter une carte
			</button>
		</div>
	</article>
</template>

<style scoped></style>
