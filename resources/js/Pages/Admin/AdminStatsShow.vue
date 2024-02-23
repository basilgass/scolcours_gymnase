

<template>
	<section>
		<h1 class="text-3xl pt-5">
			Statistiques de {{ team.name }}
		</h1>
		<h3 class="text-2xl mb-10">
			{{ chapter.title }}
		</h3>

		<div class="space-y-20">
			<team-stats-per-user
				:user="teamUser"
				:chapter="chapter"
				:stats="getTeamStats()"
				percent
			/>


			<team-stats-per-user
				v-for="user in users"
				:key="user.id"
				:user="user"
				:chapter="chapter"
				:stats="getUserStats(user.id)"
			/>
		</div>
	</section>

	<!--	<section>-->

	<!--	</section>-->
	<!--	<section>-->
	<!--		<div-->
	<!--			v-for="(post, id) of stats"-->
	<!--			:key="`post-${id}`"-->
	<!--		>-->
	<!--			<h3-->
	<!--				v-katex.auto="post.title"-->
	<!--				class="text-lg font-semibold"-->
	<!--			/>-->

	<!--			<div-->
	<!--				v-for="(question, index) of post.questions"-->
	<!--				:key="`question-${question.id}`"-->
	<!--			>-->
	<!--				{{ index + 1 }} (id: {{ question.id }}) - {{ question.resolved }} sur {{ users.length }}-->

	<!--				<progress-bar :percent="question.resolved/users.length*100" />-->

	<!--				{{ question.answers }} tentatives-->

	<!--				<div>-->
	<!--					{{ question.users.length }} participants-->
	<!--				</div>-->
	<!--			</div>-->
	<!--		</div>-->
	<!--	</section>-->
</template><script lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>

<script lang="ts" setup>

import { computed, PropType } from "vue"
import {
	ChapterMinInterface, PostQuestionsStatsInterface,
	TeamInterface, PostQuestionsForOneUserStatsInterface
} from "@/types/modelInterfaces"
import TeamStatsPerUser from "@/Components/Teams/TeamStatsPerUser.vue"

let props = defineProps({
	team: { type: Object as PropType<TeamInterface>, required: true },
	chapter: { type: Object as PropType<ChapterMinInterface>, required: true },
	stats: { type: Object as PropType<PostQuestionsStatsInterface[]>, required: true }
})

const users = computed(()=>{
	return props.team.users.toSorted((a, b) => {
		return a.name.localeCompare(b.name)
	})
})
const teamUser = computed(()=>{
	return {
		id: -1,
		name: props.team.name,
		firstname: "Toute l'équipe",
		fullname: props.team.name,
		email: "",
		teams: []
	}
})
function getUserStats(user_id: number): PostQuestionsForOneUserStatsInterface[] {
	return props.stats.map(post => {
		const questions= post.questions.map(question => {
			return {
				id: question.id,
				result: question.users[user_id] || null,
				total: 1
			}
		}) as unknown as {id: number, result: number, total: number}[]

		return {
			id: post.id,
			title: post.title,
			questions,
			sum: questions.reduce((acc, question) => {
				return acc + (question.result ? 1 : 0)
			}, 0),
			total: questions.length
		}
	})
}

function getTeamStats() {
	return props.stats.map(post => {
		const questions= post.questions.map(question => {
			return {
				id: question.id,
				result: Object.values(question.users).reduce((acc, result) => {
					return acc + (result ? 1 : 0)
				}, 0),
				total: Object.values(question.users).length
			}
		}) as unknown as {id: number, result: number, total: number}[]

		return {
			id: post.id,
			title: post.title,
			questions,
			sum: questions.reduce((acc, question) => {
				return acc + question.result
			}, 0),
			total: questions.reduce((acc, question) => {
				return acc + question.total
			}, 0)
		}
	})

}
</script>

