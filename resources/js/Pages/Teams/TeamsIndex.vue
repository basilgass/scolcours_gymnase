<!--suppress ALL -->
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>

<script setup>

import {inject} from "vue"

const props = defineProps({
	teams: {type: Object, required: true}
})

const flash = inject("flash")
</script>
<template>
	<article>
		<h2 class="text-3xl font-semibold">
			Teams
		</h2>

		<div>
			<h3 class="text-lg uppercase">
				listes des teams
			</h3>

			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
				<Link
					v-for="team of props.teams"
					:key="`id-${team.id}`"
					:href="route('teams.show', [team.name])"
					class="bg-white px-4 py-2 border border-gray-200 rounded hover:scale-105 hover:shadow transition-all"
				>
					{{ team.name }}
				</Link>
			</div>
		</div>
	</article>
</template>
