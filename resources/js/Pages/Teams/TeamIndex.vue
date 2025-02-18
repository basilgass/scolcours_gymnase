<script
	lang="ts"
	setup
>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import { PropType } from "vue"

defineOptions({ layout: LayoutMain })

interface simpleTeam {
	id: number;
	name: string;
	users_count: number;
}

const props = defineProps({
	teams: { type: Object as PropType<simpleTeam[]>, required: true }
})

</script>
<template>
	<article class="scolcours-container">
		<h2 class="text-3xl font-semibold mb-5">
			Teams
		</h2>

		<div>
			<div class="flex gap-5">
				<InertiaLink
					v-for="team of props.teams"
					:key="`id-${team.id}`"
					:href="route('teams.show', [team.name])"
					as="button"
					class="bg-white px-4 py-2 border border-gray-200 rounded-sm hover:scale-105 hover:shadow-sm transition-all flex flex-col gap-2"
				>
					<div class="font-semibold text-xl">
						{{ team.name }}
					</div>
					<div>{{ team.users_count }} étudiants</div>
				</InertiaLink>
			</div>
		</div>
	</article>
</template>
