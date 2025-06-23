<script lang="ts" setup>

import ChallengeExport from "@/Components/Challenges/ChallengeExport.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeGameState, ChallengeInterface, TeamInterface} from "@/types/modelInterfaces"
import {ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ChallengeDisplay from "@/Components/Challenges/ChallengeDisplay.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"

defineOptions({layout: LayoutMain})

const editMode = useStoreEditMode()

const props = defineProps<{
	challenge: ChallengeInterface,
	teams: TeamInterface[]
}>()

const selector = ref(0)

const state = ref<ChallengeGameState>("intro")

</script>

<template>
	<section>
		<!-- Challenge title and description -->
		<article-title
			v-theme.text
			:title="challenge.title"
			:return-link="{
				label: challenge.chapter.title,
				url: route('chapters.show', {slug: challenge.chapter.slug})
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

		<div>
			<block-show :block="challenge.block" />

			<!-- Création du menu - permet de faire le choix entre le challenge ou l'entraînement -->
			<div
				v-if="state==='intro'"
				class="my-10"
			>
				<div class="flex flex-col md:flex-row flex-wrap gap-1 md:gap-5">
					<sc-button
						:outline="selector !== 0"
						theme
						class="px-3 md:px-10 py-1 md:py-5 rounded-sm min-w-[150px] cursor-pointer transition-all"
						@click="selector = 0"
					>
						<div class="flex gap-3 items-center md:justify-center">
							<i class="bi bi-controller text-2xl" />
							<h2 class="text-lg">
								Challenge
							</h2>
						</div>
					</sc-button>
					<sc-button
						v-for="(gen, index) of challenge.generators"
						:key="`generator-selector-${gen.slug}`"
						theme
						:outline="selector !== index + 1"
						class="px-3 py-1 md:py-5 rounded-sm min-w-[150px] cursor-pointer transition-all"
						@click="selector = index + 1"
					>
						<div class="flex gap-3 items-center md:justify-center">
							<i class="bi bi-calculator text-xl" />
							<h2
								v-katex.auto="gen.title"
								class="text-lg"
							/>
						</div>
					</sc-button>
				</div>
			</div>

			<challenge-display
				:challenge
				:selector
				@state-change="state=$event"
			/>

			<!-- export to pdf - admin only ! -->
			<challenge-export :challenge="challenge" />
		</div>
	</section>
</template>
