<script
	lang="ts"
	setup
>

import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {ChapterInterface, DeckInterface} from "@/types/modelInterfaces"
import {computed, ref} from "vue"
import DeckCardsEditIndex from "@/Components/Decks/Parts/DeckCardsEditIndex.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {slugify} from "@/scolcours.ts"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {AxiosErrorMessage} from "@/types"
import axios from "axios"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	deck: DeckInterface
}>()

const flash = useStoreFlashMessage()

const theTitle = ref<string>(props.deck.title)
const theSlug = computed<string>(() => slugify(theTitle.value))
const chapter = ref<ChapterInterface>(props.deck.chapter)

function updateDeck() {
	axios
		.patch(route('api.admin.decks.update', {deck: props.deck.id}), {
			title: theTitle.value,
			slug: theSlug.value,
			chapter_id: chapter.value.id
		})
		.then(() => {
			flash.success('Le deck a bien été enregistré')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
			flash.error('Problème lors de l\'enregistrement du deck')
		})
}
</script>
<template>
	<section class="my-5 scolcours-container">
		<article-title
			:title="theTitle"
			:subtitle="theSlug"
			:return-link="{
				label:'retour à la liste des decks',
				url: route('decks.index')
			}"
		/>

		<Card>
			<template #header>
				<div class="flex justify-between">
					<div>modifier le deck</div>
					<sc-button
						xs
						type="save"
						icon
						@click="updateDeck"
					>
						enregistrer
					</sc-button>
				</div>
			</template>
			<form-maker v-model="theTitle" />
			<form-maker
				v-model="chapter"
				type="chapter"
				label="Chapitre"
				class="mt-6 bg-content p-3"
				sm
				font-code
			/>
		</Card>

		<!-- view mode -->
		<deck-cards-edit-index
			class="mt-12"
			:deck="props.deck"
		/>
	</section>
</template>


