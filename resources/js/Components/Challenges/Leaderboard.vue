<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue"
import axios from "axios"
import {LeaderboardStatsInterface} from "@/types/leaderboardInterfaces.ts"
import {TeamInterface} from "@/types/userInterfaces.ts"

const props = defineProps<{
	challengeId: number
	teams?: number[]
}>()

const loading = ref(true)
const global = ref<LeaderboardStatsInterface>()
const teamsList = ref<TeamInterface[]>([])
const teamStats = ref<LeaderboardStatsInterface>()


function loadStats() {
	axios.get(
		route('api.challenges.leaderboard', {
			challenge: props.challengeId,
			teams: props.teams ?? [],
		})
	)
		.then(res => {
			global.value = res.data.global
			teamsList.value = res.data.teams
			teamStats.value = res.data.teamStats
			loading.value = false

		})
		.catch(err => {
			console.log(err)
		})
}

let interval = null
onMounted(() => {
	loadStats()
	interval = setInterval(() => loadStats(), 1000)
})
onUnmounted(() => {
	if (interval) clearInterval(interval)
})
</script>

<template>
	<article v-if="loading">
		Chargement en cours...
	</article>
	<article
		v-else
		class="space-y-12 my-12"
	>
		<div class="flex gap-3 justify-center">
			<div
				v-theme.bg.text
				class="w-40 aspect-square p-4 rounded-xl
							border border-gray-200
							shadow-sm
							grid place-items-center"
			>
				<div class="text-center flex flex-col justify-between h-full">
					<i
						class="text-5xl bi bi-trophy"
					/>
					<div class="text-3xl">
						{{ Math.max(...global.scores.map(x => x.score)) }} / {{ global.total }}
					</div>
					<div class="text-sm ">
						meilleure / total
					</div>
				</div>
			</div>

			<div
				v-theme.bg.text
				class="w-40 aspect-square p-4 rounded-xl
							border border-gray-200
							shadow-sm
							grid place-items-center"
			>
				<div class="text-center flex flex-col justify-between h-full">
					<i
						class="text-5xl bi bi-align-middle"
					/>
					<div class="text-3xl">
						{{ global.average.toFixed(1) }} / {{ global.median }}
					</div>
					<div class="text-sm ">
						moyenne / médiane
					</div>
				</div>
			</div>
		</div>

		<div v-if="teamsList.length>0">
			<div class="text-3xl text-center">
				<div>Classement pour {{ teamsList.map(team => team.name).join(',') }}</div>
			</div>

			<div class="flex flex-col gap-3 max-w-xl mx-auto">
				<transition-group
					name="list"
				>
					<template
						v-for="(score, index) in teamStats.scores"
						:key="`team-${score.user_id}`"
					>
						<div class="bg-content rounded-lg border text-2xl flex gap-12">
							<div
								class="font-code font-semibold p-5 bg-gray-100 border rounded-l-lg border-gray-300"
							>
								{{ index + 1 }}
							</div>
							<div class="py-5 flex items-baseline gap-3">
								<i class="bi bi-trophy" />{{ score.score }}
								<!--								<span class="text-xs">( {{ score.attempts }} essais)</span>-->
							</div>
							<div class="flex-1 py-5">
								{{ score.user?.public_name ?? ' inconnu ? ' }}
							</div>
						</div>
					</template>
				</transition-group>
			</div>
		</div>
	</article>
</template>

<style scoped>

</style>
