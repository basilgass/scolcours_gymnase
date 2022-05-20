<template>
	<ArticleTitle :title="theme.title" />

	<div>
		<form-input
			v-if="chapters.length>3"
			v-model="chaptersFilter"
			name="chaptersFilter"
			label="filtrer les chapitres"
		/>
	</div>
	<div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
		<transition-group
			name="list"
		>
			<Panel
				v-for="chapter in chaptersFiltered"
				:key="`chapter-${chapter.slug}`"
				class="panel flex flex-col justify-between"
			>
				<div>
					<a
						:href="route('theme.chapter', [$page.props.theme.slug, chapter.slug])"
						class="text-2xl block hover:pl-3 transform transition-all mb-5 cursor-pointer"
					>
						{{ chapter.title }}
					</a>

					<div>{{ chapter.body }}</div>
				</div>

				<div class="text-xs mt-5">
					<div>
						Nombre de challenges: {{ chapter.challenges.length }}
					</div>
					<div>
						Nombre d'exercices:
					</div>
				</div>
			</panel>
		</transition-group>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain,
}
</script>

<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle"
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"

let props = defineProps({
	theme: { type: Object, default: () => {} },
	chapters: {type: Array, default: () => []}
})

let chaptersFilter = ref("")
let chaptersFiltered = computed(()=>{
	if(chaptersFilter.value===""){return props.chapters}

	let filter = chaptersFilter.value.toLowerCase()
	return props.chapters.filter(chapter=>
		chapter.slug.toLowerCase().includes(chaptersFilter.value) ||
		chapter.title.toLowerCase().includes(chaptersFilter.value) ||
		chapter.body.toLowerCase().includes(chaptersFilter.value)
	)
})
</script>

<style scoped>

</style>
