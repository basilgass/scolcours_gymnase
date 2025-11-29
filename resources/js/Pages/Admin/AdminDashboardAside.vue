<script setup lang="ts">

const links1 = [
	{title: "utilisateurs", route: "admin.users.index", icon: 'bi bi-person'},
	{title: "équipes", route: "admin.teams.index", icon: 'bi-person-lines-fill'},
	{title: "cours", route: "admin.courses.index", icon: 'bi-person-lines-fill'},
	{title: "quizz", route: "admin.quizzs.index", icon: 'bi bi-person-raised-hand'},
	{title: "évaluations", route: "admin.evaluations.index", icon: 'bi bi-journal-check'},
	{title: "agenda", route: "admin.agenda", icon: 'bi bi-calendar'},
]

const links2 = [
	{title: "chapitres", route: "admin.chapters.index", icon: 'bi bi-book'},
	{title: "outils", route: "admin.tools.index", icon: 'bi bi-wrench'},
	{title: "challenges", route: "admin.challenges.index", icon: 'bi bi-pencil-square'},
	{title: "générateurs", route: "admin.generators.index", icon: 'bi bi-shuffle'},
	{title: "widgets", route: "admin.widgets.index", icon: 'bi bi-nut'},
	{title: "devs", route: "dev.index", icon: 'bi bi-wrench'},
]

const links3 = [
	{title: "configuration", route: "admin.config.index", icon: 'bi bi-gear'},
	// { title: "import des langues", route: "admin.voc.import", icon: 'bi bi-translate' },
]

</script>

<template>
	<aside class="min-w-[200px] bg-slate-200 dark:bg-slate-800 dark:text-white shadow pl-6 pr-3 py-10">
		<div class="flex flex-col space-y-10">
			<div class="flex flex-col gap-2">
				<h2 class="font-semibold mb-3">
					cours
				</h2>
				<InertiaLink
					v-for="link in links1"
					:key="link.title"
					:href="route(link.route)"
				>
					<i
						:class="link.icon"
						class="mr-2"
					/>{{ link.title }}
				</InertiaLink>
			</div>
			<div class="flex flex-col gap-2">
				<h2 class="font-semibold mb-3">
					composants
				</h2>
				<InertiaLink
					v-for="link in links2"
					:key="link.title"
					:href="route(link.route)"
				>
					<i
						:class="link.icon"
						class="mr-2"
					/>{{ link.title }}
				</InertiaLink>
			</div>
			<div class="flex flex-col gap-2">
				<h2 class="font-semibold mb-3">
					généralités
				</h2>
				<InertiaLink
					v-for="link in links3"
					:key="link.title"
					:href="route(link.route)"
				>
					<i
						:class="link.icon"
						class="mr-2"
					/>{{ link.title }}
				</InertiaLink>
			</div>
		</div>
	</aside>
</template>

<style scoped>

</style>
