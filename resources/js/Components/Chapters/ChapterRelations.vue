<script setup lang="ts">

import { inject, PropType, ref } from "vue"
import axios from "axios"
import { editModeInterface, flashInterface } from "@/types"
import { ChapterInterface } from "@/types/modelInterfaces"

const props = defineProps({
	chapter: {type: Object as PropType<ChapterInterface>, required: true}
})

const flash = inject<flashInterface>("flash"),
	editMode = inject<editModeInterface>("editMode")

const chapterRelations = ref(props.chapter.relations),
	modifyRelations = ref(false),
	allChapters = ref([]),
	getAllChapters = function(){
		if(modifyRelations.value){
			modifyRelations.value = false
			return
		}else if(allChapters.value.length>0){
			modifyRelations.value = true
			return
		}

		axios.get(route("chapters.index.min"))
			.then(res=>{
				allChapters.value = res.data.data.filter(ch=>ch.slug!==props.chapter.slug)
				modifyRelations.value = true
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
			}).catch(res=>{
				flash.error(res.data)
			})
	}
</script>
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

			<div
				v-show="modifyRelations"
				class="flex flex-wrap gap-3"
			>
				<button
					v-for="chapter of allChapters"
					:key="chapter.slug"
					v-katex.auto="chapter.title"
					v-theme.btn="chapter.theme_id"
					class="btn-xs"
					:class="Object.values(chapterRelations).map(x=>x.slug).includes(chapter.slug)?'bg-white text-black':''"
					@click="toggleRelation(chapter.id)"
				/>
			</div>
		</div>
	</div>
</template>
