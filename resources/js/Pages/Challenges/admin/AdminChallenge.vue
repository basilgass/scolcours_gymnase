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
import {ChallengeLevelInterface} from "@/types/challengeInterfaces.ts"

defineOptions({layout: LayoutAdmin})

interface IChallengeAdmin {
	id: number,
	title: string,
	slug: string
	time_limit: number
	levels: ChallengeLevelInterface[]
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
			list-class="grid grid-cols-2 gap-x-6 gap-y-3"
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
					<div class="flex flex-col gap-1 text-sm">
						<div><span class="font-semibold">durée</span> {{ item.time_limit }} s</div>
						<div class="mt-3 font-semibold">
							niveaux
						</div>

						<div class="border-content divide-y">
							<div
								v-for="(level, index) in item.levels"
								:key="index"
								class="flex gap-3"
							>
								<div class="w-20">
									{{ level.level_number }} (x{{ level.points_to_pass }})
								</div>
								<div class="flex flex-col flex-1 gap-1">
									<div
										v-for="generator in level.generators"
										:key="generator.id"
										class="flex justify-between items-baseline"
									>
										<div class="flex gap-1 items-baseline">
											<sc-button
												type="visit"
												icon
												xs
												no-label
												ghost
												:href="route('generators.show', {generator: generator.slug})"
											/>
											<div v-katex.auto="generator.title" />
										</div>
										<sc-button
											type="edit"
											icon
											xs
											no-label
											ghost
											:href="route('admin.generators.edit', {generator: generator.id})"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<template #footer>
						<div class="flex justify-end gap-3">
							<sc-button
								type="edit"
								icon
								xs
								:href="route('admin.challenges.edit', {challenge: item.id})"
							/>
							<sc-button
								type="visit"
								xs
								icon
								:href="route('challenges.show', { challenge: item.slug })"
							/>
						</div>
					</template>
				</card>
			</template>
		</filtered-list>
	</section>
</template>


