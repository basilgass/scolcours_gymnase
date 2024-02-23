<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
		layout: LayoutMain,
	}
</script>

<script setup>
	import FilteredList from "@/Components/Ui/FilteredList.vue"

	const props = defineProps({
		team: { type: Object, required: true },
		students: { type: Object, required: true },
		chapters: { type: Object, required: true },
		challenges: { type: Object, required: true },
	})
</script>
<template>
	<article class="flex flex-col gap-5">
		<h2 class="text-3xl font-semibold my-10">
			{{ props.team.name }}
		</h2>

		<filtered-list
			:item-title="(item) => item.name"
			:list="props.students.data"
			item-class="bg-white"
			:title="`${props.students.data.length} étudiants`"
		>
			<template #card="{ item }">
				<div
					class="bg-white rounded-lg border border-slate-200 p-4 min-h-[3em]"
				>
					<i class="bi bi-person mr-3" />{{ item.name }}
				</div>
			</template>
		</filtered-list>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
			<filtered-list
				:item-background="(item) => item.theme_id"
				:list="props.chapters.data"
				:route-data="(item) => [props.team.name, item.slug]"
				:route-name="'teams.chapters.stats'"
				title="chapitres"
			/>

			<filtered-list
				:item-background="(item) => item.chapter.theme_id"
				:list="props.challenges.data"
				:route-data="(item) => [props.team.name, item.slug]"
				:route-name="'teams.challenge'"
				title="challenges"
			/>
		</div>
	</article>
</template>
