<!--suppress ALL -->
<template>
	<article>
		<h2 class="text-3xl font-semibold">
			{{ props.team.name }}
		</h2>
		<h3 class="text-lg">
			{{ props.challenge.data.title }}
		</h3>

		<div class="flex flex-wrap gap-5">
			<div
				v-for="score of usersScores"
				:key="score.user.name"
				class="bg-white rounded p-3 border border-gray-400 grid place-items-center min-w-[15em] text-center"
			>
				<div class="flex flex-col gap-5">
					<div>{{ score.user.name }}</div>
					<div class="text-xl">
						{{ score.score.score }} / {{ score.score.level }}
					</div>
					<div v-show="showStars">
						{{ score.score.stars }} étoile(s)
					</div>
				</div>
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
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {usePage} from "@inertiajs/inertia-vue3"

const props = defineProps({
		team: {type: Object, required: true},
		challenge: {type: Object, required: true},
		scores: {type: Array, required: true}
	}),
	showStars = computed(()=>{
		return usersScores.value.filter(item => item.score.stars!=="?").length>0
	}),
	usersScores = computed(() => {
		let scoresPerUser = []
		for (let user of props.team.users) {
			const result = props.scores.filter(score => score.user_id === user.id)[0] || false

			scoresPerUser.push({
				user,
				score: {
					score: result.score || "?",
					level: result.level || "?",
					stars: result.stars || "?",
				}
			})
		}
		console.log(scoresPerUser)
		return scoresPerUser
	})

const flash = inject("flash")
</script>
