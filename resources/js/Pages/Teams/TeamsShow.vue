<!--suppress ALL -->
<template>
	<article class="flex flex-col gap-5">
		<h2 class="text-3xl font-semibold my-10">
			{{ props.team.name }}
		</h2>

		<filtered-list
			title="étudiants"
			:list="props.students.data"
			:item-title="(item)=>item.name"
			item-class="bg-white"
		>
			<template #card="{item}">
				<div class="bg-white rounded-lg border border-slate-200 p-4 min-h-[3em]">
					<i class="bi bi-person mr-3" />{{ item.name }}
				</div>
			</template>
		</filtered-list>

		<filtered-list
			title="chapitres"
			:list="props.chapters.data"
			:route-name="'teams.chapters.stats'"
			:route-data="(item)=>[props.team.name, item.slug]"
			:item-background="(item)=>item.theme_id"
		/>

		<filtered-list
			title="challenges"
			:list="props.challenges.data"
			:route-name="'teams.challenge'"
			:route-data="(item)=>[props.team.name, item.slug]"
			:item-background="(item)=>item.chapter.theme_id"
		/>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

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
import {usePage} from "@inertiajs/vue3"
import FilteredList from "@/Components/Ui/FilteredList.vue"

const props = defineProps({
	team: {type: Object, required: true},
	students: {type: Object, required: true},
	chapters: {type: Object, required: true},
	challenges: {type: Object, required: true},
})

let filteredChallenges = computed(()=>{
		return props.challenges.data.filter(x=>x.title.includes(selectedChallenges.value))
	}),
	selectedChallenges = ref("")
const flash = inject("flash")
</script>
