<!--suppress ALL -->
<template>
	<article>
		<h2 class="text-3xl font-semibold">
			{{ props.team.name }}
		</h2>

		<div>
			<h3 class="text-lg uppercase">
				listes des chapitres
			</h3>
			<form-input
				v-model="selectedChapters"
				name="chapter-list"
				label="filtrer les chapitres"
				class="mb-5"
			/>
			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
				<transition-group name="list">
					<Link
						v-for="chapter of filteredChapters"
						:key="`id-${chapter.id}`"
						:href="route('teams.chapters.stats', [props.team.name, chapter.slug])"
						class="bg-white px-4 py-2 border border-gray-200 rounded hover:scale-105 hover:shadow transition-all"
					>
						{{ chapter.title }}
					</Link>
				</transition-group>
			</div>
		</div>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain,
}
</script>
<script setup>

import {ref, watch, computed, onMounted, inject} from "vue"
import {PiMath} from "pimath/esm"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import ChallengeHeader from "@/Components/Challenges/ChallengeHeader.vue"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {usePage} from "@inertiajs/inertia-vue3"

const props = defineProps({
	team: {type: Object, required: true},
	chapters: {type: Object, required: true}
})

let filteredChapters = computed(()=>{
		return props.chapters.data.filter(x=>x.title.includes(selectedChapters.value))
	}),
	selectedChapters = ref("")
const flash = inject("flash")
</script>
