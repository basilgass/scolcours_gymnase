<script lang="ts" setup>

import ChallengeExport from "@/Components/Challenges/ChallengeExport.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeGameState, ChallengeInterface, TeamInterface} from "@/types/modelInterfaces"
import {ref, useTemplateRef} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ChallengeDisplay from "@/Components/Challenges/ChallengeDisplay.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {useScrollTo} from "@/Composables/useHelpers.ts"
import {GeneratorInterface} from "@/types/challengeInterfaces.ts"

defineOptions({layout: LayoutMain})

const editMode = useStoreEditMode()

const props = defineProps<{
	challenge: ChallengeInterface,
	teams: TeamInterface[]
}>()

const selectedGenerator = ref<GeneratorInterface | null>(null)

const state = ref<ChallengeGameState>("intro")

const challengeRef = useTemplateRef<InstanceType<typeof ChallengeDisplay>>('main')

function onSelect(generator: GeneratorInterface | null) {
	selectedGenerator.value = generator

	useScrollTo(challengeRef.value.$el, 32)
}
</script>

<template>
	<section>
		<!-- Challenge title and description -->
		<article-title
			v-theme.text
			:title="challenge.title"
			:return-link="challenge.chapter ? {
				label: challenge.chapter.title,
				url: route('chapters.show', {id: challenge.chapter.id})
			} : {
				label: 'challenges',
				url: route('challenges.index')
			}"
			:edit-link="{
				label: challenge.id,
				url: route('admin.challenges.edit', {id: challenge.id})
			}"
		/>

		<!-- Gestion administrateur -->
		<div
			v-admin="editMode.enable"
			v-theme.admin
			class="my-3 border-t p-3"
		>
			<h3 class="uppercase pb-3 font-extralight">
				Résultats des équipes
			</h3>
			<div class="flex flex-wrap gap-3">
				<sc-button
					v-for="team of props.teams"
					:key="team.id"
					xs
					:href="route('admin.teams.challenges.show', [team.name, props.challenge.slug])"
				>
					{{ team.name }}
				</sc-button>
			</div>
		</div>

		<div class="space-y-10">
			<block-show
				v-show="state==='intro'"
				:block="challenge.block"
			/>

			<div class="flex flex-col md:flex-row gap-3 min-h-screen">
				<challenge-display
					ref="main"
					class="flex-1 order-2 md:order-1"
					:challenge
					:selected-generator="selectedGenerator"
					@state-change="state=$event"
				/>

				<!-- Challenge side menu -->
				<aside
					v-show="state==='intro'"
					class="w-full order-1 md:w-40 md:order-2"
				>
					<div class="flex flex-col gap-1">
						<!-- Bouton mode jeu -->
						<sc-button
							:outline="selectedGenerator !== null"
							theme
							class="w-full cursor-pointer transition-all"
							@click="onSelect(null)"
						>
							<div class="flex gap-3 items-center w-full">
								<i class="bi bi-controller text-2xl" />
								<h2>
									Challenge
								</h2>
							</div>
						</sc-button>

						<!-- Générateurs groupés par niveau -->
						<template
							v-for="level of challenge.levels"
							:key="`level-${level.id}`"
						>
							<template v-if="level.generators.length > 0">
								<div class="text-xs text-gray-400 uppercase pl-1 mt-2">
									Niveau {{ level.level_number }}
								</div>
								<sc-button
									v-for="gen of level.generators"
									:key="`gen-selector-${gen.slug}`"
									theme
									:outline="selectedGenerator?.id !== gen.id"
									class="w-full cursor-pointer transition-all"
									xs
									@click="onSelect(gen)"
								>
									<div class="flex gap-1 items-center w-full overflow-hidden whitespace-nowrap">
										<i class="bi bi-calculator" />
										<h2 v-katex.auto="gen.title" />
									</div>
								</sc-button>
							</template>
						</template>
					</div>
				</aside>
			</div>

			<!-- export to pdf - admin only ! -->
			<challenge-export
				v-if="state==='intro'"
				:challenge="challenge"
			/>
		</div>
	</section>
</template>
