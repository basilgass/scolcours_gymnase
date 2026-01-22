<script
	lang="ts"
	setup
>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChapterInterface, DeckInterface} from "@/types/modelInterfaces"
import {computed, PropType, reactive, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import axios from "axios"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {slugify} from "@/scolcours.ts"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})
const editMode = useStoreEditMode()

const flash = useStoreFlashMessage()

const props = defineProps({
	decks: {type: Array as PropType<DeckInterface[]>, required: true}
})
const loadedDecks = ref<DeckInterface[]>(props.decks)
const showCreate = ref(false)

const form = reactive<{ title: string, theme_id: number, chapter: ChapterInterface | undefined }>(
	{
		title: 'nouveau deck',
		theme_id: 1,
		chapter: undefined
	})
const slug = computed(() => slugify(form.title))

function createDeck() {
	axios.post(route('api.admin.decks.store'), {
		title: form.title,
		slug: slug.value,
		chapter_id: form.chapter.id,
	})
		.then((res: AxiosResponseModel<DeckInterface>) => {
			loadedDecks.value.push(res.data)
		})
		.catch((res: AxiosErrorMessage) => {
			console.warn(res.response.data.message)
		})
		.finally(() => {
			showCreate.value = false
		})
}

function toggleActive(value: DeckInterface) {
	axios.patch(route('api.admin.decks.toggleActive', {id: value.id}),
		{
			active: value.active
		})
		.catch(() => {
			flash.error(`Le deck n'a pas pu être ${value.active ? 'dés' : ''}activer`)
		})
}

function destroyDeck(id: number) {
	axios.delete(route('api.admin.decks.destroy', {id: id}))
		.then(() => {
			loadedDecks.value = loadedDecks.value.filter(d => d.id !== id)

			flash.success('Le deck a bien été supprimé.')
		})
		.catch((err: AxiosErrorMessage) => {
			flash.error('Il y a eu un problème avec la suppression du deck.')
			console.warn(err.response.data.message)
		})
}


const deckIsRunning = ref(false)

</script>

<template>
	<section>
		<article-title
			title="decks"
		/>

		<header
			v-admin="editMode.enable"
			v-theme.admin.bg
			class="flex justify-between items-baseline p-2 mb-3"
		>
			<sc-button
				type="add"
				icon
				xs
				@click="showCreate=true"
			>
				créer un deck
			</sc-button>
		</header>


		<dialog-modal
			v-model="showCreate"
			class="w-100"
		>
			<template #header>
				<div class="p-3 font-semibold border-content border-b">
					Créer un deck
				</div>
			</template>

			<div class="p-3">
				<form-maker
					v-model="form.title"
					label="titre du deck"
				/>

				<form-maker
					v-model="slug"
					label="slug"
					xs
				/>

				<form-maker
					v-model="form.chapter"
					type="chapter"
					class="flex-1"
				/>
			</div>

			<template #footer>
				<div class="p-3 border-content border-t flex justify-end gap-3">
					<sc-button
						type="cancel"
						xs
						@click="showCreate=false"
					>
						annuler
					</sc-button>
					<sc-button
						type="add"
						xs
						@click="createDeck"
					>
						créer le deck
					</sc-button>
				</div>
			</template>
		</dialog-modal>


		<filtered-list
			:list="loadedDecks"
			list-class="grid
			grid-cols-1 md:grid-cols-2 xl:grid-cols-3
			gap-2 md:gap-3 xl:gap-5"
			title="decks"
			no-title
			:filter-by-theme="(deck)=>deck.chapter?.theme_id"
		>
			<template #card="{ item }: { item: DeckInterface }">
				<div
					v-theme.border="item.chapter?.theme_id ?? false"
					class="bg-content p-3 flex justify-between h-full"
					:class="{
						'border-l-8':item.chapter?.theme_id,
						'opacity-20': !item.active
					}"
				>
					<div>
						<h3
							v-katex.auto="item.title"
							class="font-semibold"
						/>

						<div>{{ item.cards_count }} cartes</div>


						<details v-admin="editMode.enable">
							<summary>
								voir le code
							</summary>
							<pre>{{ item }}</pre>
						</details>
					</div>

					<div class="flex flex-col justify-between">
						<div class="flex gap-3 items-baseline">
							<sc-button
								xs
								:type="deckIsRunning ? 'primary' : 'success'"
								:href="route('decks.show', item.slug)"
							>
								{{ deckIsRunning ? 'continuer' : 'commencer' }}
							</sc-button>

							<sc-button
								xs
								:href="route('decks.portfolio', {deck: item.slug})"
							>
								portfolio
							</sc-button>
						</div>

						<div
							v-admin="editMode.enable"
							class="flex gap-3 items-baseline"
						>
							<form-maker
								v-model="item.active"
								type="switch"
								label="actif"
								sm
								@update="toggleActive(item)"
							/>
							<sc-button
								type="edit"
								icon
								xs
								:href="route('admin.decks.edit', {id: item.id})"
							>
								éditer
							</sc-button>

							<confirm-button
								xs
								@confirm="destroyDeck(item.id)"
							>
								<i class="bi bi-trash mx-1" /> supprimer
							</confirm-button>
						</div>
					</div>
				</div>
			</template>
		</filtered-list>
	</section>
</template>

