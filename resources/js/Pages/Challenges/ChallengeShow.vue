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
import {useScrollTo} from "@/Composables/useHelpers.ts";

defineOptions({layout: LayoutMain})

const editMode = useStoreEditMode()

const props = defineProps<{
	challenge: ChallengeInterface,
	teams: TeamInterface[]
}>()

const selector = ref(0)

const state = ref<ChallengeGameState>("intro")

const challengeRef = useTemplateRef<InstanceType<typeof ChallengeDisplay>>('main')

function onSelect(index: number) {
	selector.value = index

	useScrollTo(challengeRef.value.$el, 32)
}
</script>

<template>
	<section>
		<!-- Challenge title and description -->
		<article-title
			v-theme.text
			:title="challenge.title"
			:return-link="{
				label: challenge.chapter.title,
				url: route('chapters.show', {id: challenge.chapter.id})
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
					:selector
					@state-change="state=$event"
				/>

				<!-- Challenge side menu -->
				<aside
					v-show="state==='intro'"
					class="w-full order-1 md:w-40 md:order-2"
				>
					<div class="flex flex-col gap-1">
						<sc-button
							:outline="selector !== 0"
							theme
							class="w-full cursor-pointer transition-all"
							@click="onSelect(0)"
						>
							<div class="flex gap-3 items-center w-full">
								<i class="bi bi-controller text-2xl" />
								<h2>
									Challenge
								</h2>
							</div>
						</sc-button>
						<sc-button
							v-for="(gen, index) of challenge.generators"
							:key="`generator-selector-${gen.slug}`"
							theme
							:outline="selector !== index + 1"
							class="w-full cursor-pointer transition-all"
							xs
							@click="onSelect(index+1)"
						>
							<div class="flex gap-1 items-center w-full overflow-hidden whitespace-nowrap">
								<i class="bi bi-calculator" />
								<h2 v-katex.auto="gen.title" />
							</div>
						</sc-button>
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
