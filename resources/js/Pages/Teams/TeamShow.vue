<script
	setup
	lang="ts"
>
import FilteredList from "@/Components/Ui/FilteredList.vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { ChallengeInterface, ChapterShowInterface, TeamInterface, UserInterface } from "@/types/modelInterfaces"
import { PropType } from "vue"

defineOptions({ layout: LayoutMain })


const props = defineProps({
	team: { type: Object as PropType<TeamInterface>, required: true },
	students: { type: Object as PropType<UserInterface[]>, required: true },
	chapters: { type: Object as PropType<ChapterShowInterface[]>, required: true },
	challenges: { type: Object as PropType<ChallengeInterface[]>, required: true },
})
</script>
<template>
	<article class="scolcours-container">
		<div class=" my-10">
			<h2 class="text-3xl font-semibold">
				{{ props.team.name }}
			</h2>
			<InertiaLink :href="route('admin.teams.index')">
				<i class="bi bi-arrow-left" /> Retour aux équipes
			</InertiaLink>
		</div>


		<filtered-list
			:item-title="(x) => x.name"
			:list="props.students"
			item-class="bg-white"
			:title="`${props.students.length} étudiants`"
		>
			<template #card="{ item }: { item: string | object }">
				<div class="bg-content rounded-lg border p-4 min-h-[3em]">
					<i class="bi bi-person mr-3" />{{ (typeof item === "string") ? item : item['name'] }}
				</div>
			</template>
		</filtered-list>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
			<filtered-list
				:item-background="(item) => item.theme_id"
				:list="props.chapters"
				:route-data="(item) => [props.team.name, item.slug]"
				:route-name="'teams.chapters.stats'"
				title="chapitres"
				list-class="grid grid-cols-1 gap-3 xl:grid-cols-2"
			/>

			<filtered-list
				:item-background="(item) => item.chapter.theme_id"
				:list="props.challenges"
				:route-data="(item) => [props.team.name, item.slug]"
				:route-name="'teams.challenge'"
				title="challenges"
				list-class="grid grid-cols-1 gap-3 xl:grid-cols-2"
			/>
		</div>
	</article>
</template>
