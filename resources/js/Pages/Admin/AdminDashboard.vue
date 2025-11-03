<script
	lang="ts"
	setup
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})

// TODO: Créer une page spécifique pour l'admin des teams
const links1 = [
	{title: "utilisateurs", route: "admin.users.index", icon: 'bi bi-person'},
	{title: "équipes", route: "admin.teams.index", icon: 'bi-person-lines-fill'},
	{title: "cours", route: "admin.courses.index", icon: 'bi-person-lines-fill'},
	{title: "quizz", route: "admin.quizzs.index", icon: 'bi bi-person-raised-hand'},
	{title: "évaluations", route: "admin.evaluations.index", icon: 'bi bi-journal-check'},
]

const links2 = [
	{title: "chapitres", route: "admin.chapters.index", icon: 'bi bi-book'},
	{title: "outils", route: "admin.tools.index", icon: 'bi bi-wrench'},
	{title: "challenges", route: "admin.challenges.index", icon: 'bi bi-pencil-square'},
	{title: "générateurs", route: "admin.generators.index", icon: 'bi bi-shuffle'},
	{title: "widgets", route: "admin.widgets.index", icon: 'bi bi-nut'},
]

const links3 = [
	{title: "configuration générale", route: "admin.config.index", icon: 'bi bi-gear'},
	// { title: "import des langues", route: "admin.voc.import", icon: 'bi bi-translate' },
]

</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			Admin dashboard
		</h1>

		<sc-button
			:href="route('admin.agenda')"
			class="my-10"
		>
			Agenda
		</sc-button>

		<div class="grid grid-cols-1 md:grid-cols-3">
			<div class="flex flex-col gap-2">
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
	</section>
</template>
