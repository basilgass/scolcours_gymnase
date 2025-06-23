<script
	setup
	lang="ts"
>
import { computed } from "vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import StatBar from "@/Components/Ui/StatBar.vue"

defineOptions({ layout: LayoutMain })

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
	}),
	usersHallOfFame = computed(() => {
		return props.scores.map(score => {
			return {
				user: props.team.users.filter(user => user.id === score.user_id)[0],
				score: score
			}
		})
	}),
	maxScore = computed(() => {
		return Math.max(...props.scores.map(score => score.score))
	})

</script>
<template>
	<article class="py-8">
		<h2 class="text-3xl font-semibold">
			{{ props.team.name }}
		</h2>
		<InertiaLink :href="route('admin.teams.show', [team.name])">
			<i class="bi bi-arrow-left" /> Retour à l'équipe
		</InertiaLink>
		<h3 class="text-2xl">
			{{ props.challenge.data.title }}
		</h3>

		<div class="my-5">
			<h2 class="text-xl mb-3">
				Halle of fame
			</h2>

			<div class="grid grid-cols-1 gap-3">
				<div
					v-for="score in usersHallOfFame"
					:key="score.user.name"
					class="bg-content px-3 py-1 flex"
				>
					<stat-bar
						:max="maxScore"
						:value="score.score.score"
						:label="`${score.user.name} ${score.user.firstname}`"
						:label-class="`w-[200px]`"
					>
						<div class="grid grid-cols-2 gap-3">
							<div>
								{{ score.score.score }} points
							</div>
							<div class="flex gap-1 ">
								<i
									v-for="i in score.score.level"
									:key="`star-${i}`"
									class="bi bi-star-fill text-amber-400"
								/>
							</div>
						</div>
					</stat-bar>
				</div>
			</div>
		</div>

		<div class="text-xl mt-10 mb-3">
			Tous les utilisateurs
		</div>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
			<div
				v-for="score of usersScores"
				:key="score.user.name"
				class="bg-white rounded p-3 border border-gray-400
				grid place-items-center min-w-[15em] text-center"
			>
				<div class="flex flex-col gap-5">
					<div class="whitespace-nowrap">
						<div class="text-xl font-extralight">
							{{ score.user.name }}
						</div>
						<div class="font-extralight">
							{{ score.user.firstname }}
						</div>
					</div>
					<div
						class="text-4xl"
						:class="score.score.score === '?' ? 'invisible' : ''"
					>
						{{ score.score.score }}
					</div>
					<div
						v-show="showStars"
						:class="!(score.score.score > 0) ? 'invisible' : ''"
					>
						<div class="flex gap-1 justify-center text-xl">
							<i
								v-for="i in score.score.level"
								:key="`star-${i}`"
								class="bi bi-star-fill text-amber-400"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>
