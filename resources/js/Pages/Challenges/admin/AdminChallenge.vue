<script
	lang="ts"
	setup
>
import {PropType} from "vue"
import {ChallengeInterface} from "@/types/modelInterfaces"
import Card from "@/Components/Ui/Card.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"

defineOptions({layout: LayoutAdmin})

defineProps({
	challenges: {type: Object as PropType<ChallengeInterface[]>, required: true}
})

</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			administration des challenges
		</h1>

		<filtered-list
			:list="challenges"
			list-class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4"
			filter-by-theme
		>
			<template #card="{ item }: { item: ChallengeInterface }">
				<card
					v-theme.bg.text="item.theme_id"
					with-themes
				>
					<div>
						<InertiaLink
							v-katex.auto="item.title"
							:href="route('challenges.show', { challenge: item.slug })"
							class="text-lg leading-6 font-medium"
						/>
						<p class="max-w-2xl text-sm font-code">
							{{ item.slug }}
						</p>
						<div class=" mt-3 flex justify-between text-xs font-code">
							<div>{{ item.updated_at }}</div>
							<div>Is activated</div>
						</div>
					</div>
				</card>
			</template>
		</filtered-list>
	</section>
</template>


