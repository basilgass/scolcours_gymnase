<!--suppress ALL -->
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>

<script setup>

import { computed, inject } from "vue"

const props = defineProps({
		team: { type: Object, required: true },
		challenge: { type: Object, required: true },
		scores: { type: Object, required: true }
	}),
	showStars = computed(() => {
		return usersScores.value.filter(item => item.score.stars !== "?").length > 0
	}),
	usersScores = computed(() => {
		let scoresPerUser = []
		for (let user of props.team.users) {
			const result = Object.values(props.scores).filter(score => score.user_id === user.id)[0] || false

			scoresPerUser.push({
				user,
				score: result ? {
					score: result.score,
					level: result.level,
					stars: result.stars ?? 0
				} : { score: "?", level: "?", stars: "?" }
			})
		}
		return scoresPerUser
	})

const flash = inject("flash")
</script>
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
