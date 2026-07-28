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
			list-class="grid grid-cols-1 gap-2"
			filter-by-theme
		>
			<template #card="{ item }: { item: IChallengeAdmin }">
				<card
					:mark-theme="item.theme_id"
					no-inside-border
					compact
				>
					<div class="flex justify-between">
						<InertiaLink
							v-katex.auto="item.title"
							:href="route('challenges.show', { challenge: item.slug })"
						/>
						<sc-button
							type="edit"
							icon
							xs
							ghost
							:href="route('admin.challenges.edit', {challenge: item.id})"
						/>
					</div>
				</card>
			</template>
		</filtered-list>
	</section>
</template>


