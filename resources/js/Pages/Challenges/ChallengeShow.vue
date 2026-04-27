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
import Card from "@/Components/Ui/Card.vue"

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

		<div class="flex flex-col md:flex-row gap-6 min-h-screen">
			<!-- Colonne principale -->
			<div class="flex-1 flex flex-col gap-6 order-2 md:order-1 min-w-0">
				<!-- description du challenge -->
				<block-show
					v-show="state === 'intro'"
					:block="challenge.block"
				/>

				<!-- affichage du challenge -->
				<challenge-display
					ref="main"
					:challenge
					:selected-generator="selectedGenerator"
					@state-change="state = $event"
				/>
			</div>

			<!-- Menu latéral -->
			<aside
				v-show="state === 'intro'"
				class="w-full md:w-64 order-1 md:order-2 shrink-0"
			>
				<Card class="md:sticky md:top-4">
					<div class="flex flex-col gap-1">
						<!-- Bouton mode jeu -->
						<sc-button
							theme
							class="w-full text-lg transition-colors"
							:outline="selectedGenerator !== null"
							sm
							@click="onSelect(null)"
						>
							<div class="flex gap-3 items-center justify-center">
								<i class="bi bi-controller text-2xl" />
								<span>Challenge</span>
							</div>
						</sc-button>

						<!-- Générateurs groupés par niveau -->
						<template
							v-for="level of challenge.levels"
							:key="`level-${level.id}`"
						>
							<template v-if="level.generators.length > 0">
								<div class="text-xs text-gray-400 uppercase pl-2 mt-4 mb-1">
									Niveau {{ level.level_number }}
								</div>

								<div
									v-for="gen of level.generators"
									:key="`gen-selector-${gen.slug}`"
									v-theme.text="selectedGenerator?.id === gen.id"
									class="flex gap-2 px-3 py-1 rounded-lg cursor-pointer
								       transition-colors"
									@click="onSelect(gen)"
								>
									<i class="bi bi-calculator text-sm shrink-0" />
									<span
										v-katex.auto="gen.title"
										class="text-sm"
									/>
								</div>
							</template>
						</template>
					</div>
				</Card>
			</aside>
		</div>

		<!-- export to pdf - admin only ! -->
		<challenge-export
			v-if="state === 'intro'"
			:challenge="challenge"
		/>
	</section>
</template>
