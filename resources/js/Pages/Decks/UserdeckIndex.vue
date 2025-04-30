<script
	lang="ts"
	setup
>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {UserDeckInterface} from "@/types/modelInterfaces"
import {PropType, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import UserdeckCreate from "@/Components/Decks/UserdeckCreate.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"

defineOptions({layout: LayoutMain})

const props = defineProps({
	decks: {type: Array as PropType<UserDeckInterface[]>, required: true}
})

console.log(props.decks)

const showCreate = ref(false)

function deleteUserDeck(id: number) {
	axios.delete(route('decks.userdecks.destroy', {id: id}))
		.then(() => {
			router.reload()
		})
}

function onCreated() {
	showCreate.value = false
	router.reload()
}

</script>

<template>
	<section>
		<header class="flex justify-between items-baseline">
			<h3 class="text-3xl py-4">
				Decks de révision
			</h3>

			<sc-button
				type="add"
				icon
				xs
				@click="showCreate=!showCreate"
			>
				créer un deck
			</sc-button>
		</header>


		<dialog-modal
			v-model="showCreate"
			class="h-full w-full"
		>
			<keep-alive>
				<userdeck-create
					class="p-5"
					v-if="showCreate"
					@created="onCreated"
				/>
			</keep-alive>
		</dialog-modal>


		<div
			v-if="decks.length>0"
			class="flex flex-col gap-3"
		>
			<div
				v-for="deck in decks"
				:key="deck.id"
				class="bg-content p-3 flex justify-between"
			>
				<div>
					<h3
						v-katex.auto="deck.title"
						class="font-semibold"
					/>
					<div v-katex.auto="deck.description" />

					<div>{{ deck.number_of_cards }} cartes</div>


					<details>
						<summary>
							voir le code
						</summary>
						<pre>{{ deck }}</pre>
					</details>
				</div>

				<div>
					<sc-button :href="route('decks.show', deck.id)">
						{{ deck.running ? 'continuer' : 'commencer' }}
					</sc-button>

					<confirm-button @confirm="deleteUserDeck(deck.id)">
						supprimer
					</confirm-button>
				</div>
			</div>
		</div>
	</section>
</template>

