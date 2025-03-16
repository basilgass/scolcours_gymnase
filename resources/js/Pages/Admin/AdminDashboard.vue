<script
	setup
	lang="ts"
>
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

const links1 = [
	{ title: "configuration générale", route: "admin.config", icon: 'bi bi-gear' },
	{ title: "utilisateurs", route: "admin.users", icon: 'bi bi-person' },
	{ title: "équipes", route: "teams.index", icon: 'bi-person-lines-fill' },
]

const links2 = [
	{ title: "chapitres", route: "admin.chapters", icon: 'bi bi-book' },
	{ title: "outils", route: "admin.tools", icon: 'bi bi-wrench' },
	{ title: "challenges", route: "admin.challenges", icon: 'bi bi-pencil-square' },
	{ title: "générateurs", route: "admin.generators", icon: 'bi bi-shuffle' },
	{ title: "widgets", route: "admin.widgets", icon: 'bi bi-nut' },
]

const links3 = [
	{ title: "quizz", route: "quizzs.admin", icon: 'bi bi-person-raised-hand' },
	{ title: "import des langues", route: "translations.import", icon: 'bi bi-translate' },
]

</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			Admin dashboard
		</h1>

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
