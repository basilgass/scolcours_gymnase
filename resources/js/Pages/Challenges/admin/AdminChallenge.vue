<script
	lang="ts"
	setup
>
import {PropType} from "vue"
import Card from "@/Components/Ui/Card.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import ChallengeCreateButton from "@/Components/Challenges/ChallengeCreateButton.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

defineOptions({layout: LayoutAdmin})

interface IChallengeAdmin {
	id: number,
	title: string,
	slug: string
	time_limit: number
	levels: number
	theme_id: number,
	updated_at: string
}

defineProps({
	challenges: {type: Object as PropType<IChallengeAdmin[]>, required: true}
})

</script>
<template>
	<section class="scolcours-container">
		<div class="flex justify-between">
			<h1 class="text-3xl pt-5 mb-10">
				administration des challenges
			</h1>
			<div>
				<challenge-create-button />
			</div>
		</div>

		<filtered-list
			:list="challenges"
			list-class="grid grid-cols-2 gap-2"
			filter-by-theme
		>
			<template #card="{ item }: { item: IChallengeAdmin }">
				<card
					:header-theme="item.theme_id"
				>
					<template #header>
						<div class="flex gap-1 items-baseline">
							<div class="font-code text-xs">
								({{ item.id }})
							</div>
							<h3
								v-katex.auto="item.title"
								class="font-semibold"
							/>
						</div>
					</template>
					<div class="font-code flex gap-16 text-sm">
						<div>durée: {{ item.time_limit }}</div>
						<div>niveaux: {{ item.levels }}</div>
					</div>

					<template #footer>
						<div class="flex justify-end gap-3">
							<sc-button
								type="visit"
								xs
								icon
								:href="route('challenges.show', { challenge: item.slug })"
							/>
							<sc-button
								type="edit"
								icon
								xs
								:href="route('admin.challenges.edit', {challenge: item.id})"
							/>
						</div>
					</template>
				</card>
			</template>
		</filtered-list>
	</section>
</template>


