<script
	lang="ts"
	setup
>

import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { flashInterface } from "@/types"
import type { ChapterInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { inject, ref } from "vue"

const props = defineProps<{
	chapter: ChapterInterface,
	relations: ChapterInterface[]
}>()

const flash = inject<flashInterface>("flash")

const editMode = useStoreEditMode()


const chapterRelations = ref(props.relations)
const modifyRelations = ref(false)
const searchChapters = ref([])

const getAllChapters = function() {
	if (modifyRelations.value) {
		modifyRelations.value = false
		return
	} else if (searchChapters.value.length > 0) {
		modifyRelations.value = true
		return
	}

	axios.get(route("chapters.index.min"))
		.then(res => {
			searchChapters.value = res.data.filter(ch => ch.slug !== props.chapter.slug)
			modifyRelations.value = true
		})
		.catch(res => {
			console.warn(res)
		})
}

const toggleRelation = function(id) {
	axios.post(route("chapters.relations.toggle", [props.chapter.id, id]))
		.then(res => {
			flash.success("relation correctement mis à jour...")
			if (res.data !== false) {
				chapterRelations.value = res.data
			}
		}).catch(res => {
		flash.error(res.data)
	})
}
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
			<InertiaLink
				v-for="ch of chapterRelations"
				:key="`related-${ch.slug}`"
				v-katex.auto="ch.title"
				v-theme.btn="ch.theme.id"
				:href="route('chapters.show', [ch.slug])"
				as="button"
				class="btn-xs"
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
				<button
					v-admin
					class="btn btn-new-inline"
					@click="getAllChapters"
				>
					nouvelle relation
				</button>
			</div>

			<div
				v-show="modifyRelations"
				class="flex flex-wrap gap-3"
			>
				<button
					v-for="chapter of searchChapters"
					:key="chapter.slug"
					v-katex.auto="chapter.title"
					v-theme.btn="chapter.theme.id"
					:class="Object.values(chapterRelations).map(x => x.slug).includes(chapter.slug) ? 'bg-white text-black' : ''"
					class="btn-xs"
					@click="toggleRelation(chapter.id)"
				/>
			</div>
		</div>
	</div>
</template>
