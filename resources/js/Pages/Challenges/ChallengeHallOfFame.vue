<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"
import {TeamInterface} from "@/types/userInterfaces.ts"
import {LeaderboardStatsInterface} from "@/types/leaderboardInterfaces.ts"

const props = defineProps<{
	challenge: ChallengeInterface,
	teams: TeamInterface[],
	global: LeaderboardStatsInterface,
	teamStats?: LeaderboardStatsInterface,
}>()

</script>

<template>
	<section>
		<h1>Hall of fame</h1>
		<h2>challenge id {{ challenge.id }}</h2>

		<div>
			{{ global.scores.map(x => x.score) }} /
			{{ global.average }} /
			{{ global.median }} / {{ global.rank }} / {{ global.total }}
		</div>
		<div v-if="teams">
			equipes : {{ teams.map(t => t.name).join(', ') }}

			<pre v-if="teamStats">{{ teamStats.scores.map(x => x.score) }} /
			{{ teamStats.average }} /
			{{ teamStats.median }} / {{ teamStats.rank }} / {{ teamStats.total }}
		</pre>
		</div>
	</section>
</template>

<style scoped>

</style>
