<template>
	<div
		v-if="chapterRelations.length>0 || editMode.enabled.value"
		class="px-5"
	>
		<h3 class="uppercase font-extralight mb-2">
			prérequis
		</h3>

		<div class="flex flex-wrap gap-3">
			<Link
				v-for="ch of chapterRelations"
				:key="`related-${ch.slug}`"
				v-theme.btn="ch.theme_id"
				v-katex.auto="ch.title"
				as="button"
				class="btn-xs"
				:href="route('chapter.show', [ch.slug])"
			/>
		</div>

		<div
			v-show="editMode.enabled.value"
			v-admin
			class="my-5"
		>
			<div class="mb-3">
				<button
					v-show="editMode.enabled.value"
					v-admin
					class="btn-new-inline"
					@click="getAllChapters"
				>
					nouvelle relation
				</button>
			</div>

			<button
				v-for="chapter of allChapters"
				:key="chapter.slug"
				v-katex.auto="chapter.title"
				v-theme.btn="chapter.theme_id"
				class="btn-xs"
				@click="toggleRelation(chapter.id)"
			/>
		</div>
	</div>
</template>
<script setup>

import {inject, ref} from "vue"
import axios from "axios"

let props = defineProps({
	chapter: {type: Object, required: true}
})

const flash = inject("flash"),
	editMode = inject("editMode")

let chapterRelations = ref(props.chapter.relations),
	allChapters = ref([]),
	getAllChapters = function(){
		axios.get(route("chapters.index.min"))
			.then(res=>{
				allChapters.value = res.data.data.filter(ch=>ch.slug!==props.chapter.slug)
			})
			.catch(res => {
				console.warn(res)
			})
	},
	toggleRelation = function(id) {
		axios.post(route("chapters.relations.toggle", [props.chapter.id, id]))
			.then(res => {
				flash.success("relation correctement mis à jour...")
				if(res.data!==false){
					chapterRelations.value = res.data.data
				}
			})
	}
</script>
