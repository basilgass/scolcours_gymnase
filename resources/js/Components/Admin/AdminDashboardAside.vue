<script setup lang="ts">

import {ref} from "vue"

const links = [
	{title: "cours", route: null, icon: 'bi bi-person-workspace'},
	{title: "utilisateurs", route: "admin.users.index", icon: 'bi bi-person'},
	{title: "équipes", route: "admin.teams.index", icon: 'bi-person-lines-fill'},
	{title: "cours", route: "admin.courses.index", icon: 'bi-book'},
	{title: "quizz", route: "admin.quizzs.index", icon: 'bi bi-person-raised-hand'},
	{title: "évaluations", route: "admin.evaluations.index", icon: 'bi bi-journal-check'},
	{title: "agenda", route: "admin.agenda", icon: 'bi bi-calendar'},
	{title: "composants", route: null, icon: "bi bi-gear-wide-connected"},
	{title: "chapitres", route: "admin.chapters.index", icon: 'bi bi-paragraph'},
	{title: "outils", route: "admin.tools.index", icon: 'bi bi-wrench'},
	{title: "challenges", route: "admin.challenges.index", icon: 'bi bi-patch-question'},
	{title: "générateurs", route: "admin.generators.index", icon: 'bi bi-shuffle'},
	{title: "widgets", route: "admin.widgets.index", icon: 'bi bi-nut'},
	{title: "devs", route: "dev.index", icon: 'bi bi-wrench'},
	{title: "généralités", route: null, icon: 'bi bi-pencil-square'},
	{title: "configuration", route: "admin.config.index", icon: 'bi bi-wrench'},
	// { title: "import des langues", route: "admin.voc.import", icon: 'bi bi-translate' },
]

const show = ref(true)

</script>

<template>
	<aside
		class="bg-slate-200 dark:bg-slate-800 dark:text-white
		pb-10
		shadow transition-all duration-300 overflow-hidden"
		:class="show ? 'px-6' : 'px-3'"
	>
		<div
			@click="show=!show"
			class="cursor-pointer mt-2 mb-5"
		>
			<i class="bi bi-three-dots" />
		</div>
		<div class="flex flex-col space-y-3">
			<div
				v-for="link in links"
				:key="link.title"
			>
				<h2
					class="font-semibold
					bg-slate-300 dark:bg-slate-700
					mt-5 mb-2 -ml-2 p-2
					border border-content rounded
					whitespace-nowrap"
					v-if="link.route===null"
				>
					<i :class="link.icon" /> <span
						v-show="show"
						class="ml-2"
					>{{ link.title }}</span>
				</h2>
				<InertiaLink
					v-else
					:href="route(link.route)"
					class="whitespace-nowrap"
				>
					<i
						:class="link.icon"
					/><span
						v-show="show"
						class="ml-2"
					>{{ link.title }}</span>
				</InertiaLink>
			</div>
		</div>
	</aside>
</template>

<style scoped>

</style>
