<script
	lang="ts"
	setup
>

import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {ChapterInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps<{
	chapter: ChapterInterface,
	relations: ChapterInterface[]
}>()

const flash = useStoreFlashMessage()

const editMode = useStoreEditMode()


const chapterRelations = ref(props.relations)
const modifyRelations = ref(false)
const searchChapters = ref([])

const getAllChapters = function () {
	if (modifyRelations.value) {
		modifyRelations.value = false
		return
	} else if (searchChapters.value.length > 0) {
		modifyRelations.value = true
		return
	}

	axios.get(route("api.admin.chapters.index"))
		.then(res => {
			searchChapters.value = res.data.filter(ch => ch.slug !== props.chapter.slug)
			modifyRelations.value = true
		})
		.catch(res => {
			console.warn(res)
		})
}

const toggleRelation = function (id) {
	console.log('TOGGLE', formChapter.value)
	axios.post(route("api.admin.chapters.relations.toggle", [props.chapter.id, id]))
		.then(res => {
			flash.success("relation correctement mis à jour...")
			if (res.data !== false) {
				chapterRelations.value = res.data
			}
		}).catch(res => {
		flash.error(res.data)
	})
}

const formChapter = ref<ChapterInterface>()
</script>
<template>
	<div>
		<h3 class="uppercase font-extralight mb-2">
			prérequis
		</h3>

		<div
			v-if="chapterRelations.length > 0"
			class="flex flex-wrap gap-3"
		>
			<sc-button
				v-for="ch of chapterRelations"
				:key="`related-${ch.slug}`"
				v-katex.auto="ch.title"
				:theme="ch.theme_id"
				:href="route('chapters.show', [ch.id])"
				xs
				outline
			/>
		</div>
		<div v-else>
			Il n'y a pas de prérequis pour le chapitre
			<span
				v-theme.text
				v-katex.auto="chapter.title"
			/>
		</div>

		<div
			v-show="editMode.enable"
			v-admin
			class="my-5"
		>
			<div class="mb-3">
				<sc-button
					v-admin
					type="add"
					icon
					@click="getAllChapters"
				>
					nouvelle relation
				</sc-button>
			</div>

			<filtered-list
				v-show="modifyRelations"
				:list="searchChapters"
				filter-by-theme
				class="flex flex-wrap gap-3"
			>
				<template #card="{item}: {item: ChapterInterface}">
					<sc-button
						:key="item.slug"
						v-katex.auto="item.title"
						:theme="item.theme_id"
						:outline="!Object.values(chapterRelations).map(x => x.slug).includes(item.slug)"
						@click="toggleRelation(item.id)"
						xs
					/>
				</template>
			</filtered-list>
		</div>
	</div>
</template>
