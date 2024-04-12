<script lang="ts" setup>

import { PropType, ref } from "vue"
import ChallengeHeader from "@/Components/Challenges/ChallengeHeader.vue"
import ChallengeExport from "@/Components/Challenges/ChallengeExport.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { ChallengeInterface, TeamInterface } from "@/types/modelInterfaces"
import ChallengeGame from "@/Components/Challenges/ChallengeGame.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import IllustrationShow from "@/Pages/Illustrations/IllustrationShow.vue"
import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	challenge: { type: Object as PropType<ChallengeInterface>, required: true },
	teams: { type: Object as PropType<TeamInterface[]>, required: true }
})

const userScore = ref(props.challenge.user)
const state = ref<"intro" | "running" | "finished">("intro")
let selector = ref(0)

</script>

<template>
	<section>
		<!-- Challenge title and description -->
		<challenge-header :challenge="challenge" />

		<div class="scolcours-container">
			<!-- the body / question of the challenge -->
			<markdown-it
				:text="props.challenge.block.body"
				class="mt-5"
			/>

			<!-- illustration -->
			<illustration-show
				v-if="props.challenge.block.illustrations.length"
				:illustration="props.challenge.block.illustrations[0]"
				class="max-w-[30em] mx-auto"
			/>

			<!-- Création du menu -->
			<div
				v-if="state==='intro'"
				class="my-10"
			>
				<div class="flex flex-col md:flex-row flex-wrap gap-1 md:gap-5">
					<div
						:class="selector === 0 ? 'is-active' : 'text-gray-400'"
						class="px-3 md:px-10 py-1 md:py-5 rounded hover:shadow min-w-[150px] border-2 cursor-pointer transition-all"
						@click="selector = 0"
					>
						<div class="flex gap-3 items-center md:justify-center">
							<i class="bi bi-controller text-2xl" />
							<h2 class="text-lg">
								Challenge
							</h2>
						</div>
					</div>
					<div
						v-for="(gen, index) of challenge.generators"
						:key="`generator-selector-${gen.slug}`"
						:class="
							selector === index + 1 ? 'is-active' : 'text-gray-400'
						"
						class="px-3 py-1 md:py-5 rounded hover:shadow min-w-[150px] border cursor-pointer transition-all"
						@click="selector = index + 1"
					>
						<div class="flex gap-3 items-center md:justify-center">
							<i class="bi bi-calculator text-xl" />
							<h2
								v-katex.auto="gen.title"
								class="text-lg"
							/>
						</div>
					</div>
				</div>
			</div>

			<challenge-game
				v-if="selector===0"
				v-model:state="state"
				v-model:user-score="userScore"
				:challenge="challenge"
				:teams="teams"
			/>
			<challenge-training
				v-else
				:challenge="challenge"
				:slug="challenge.generators[selector-1].slug"
			/>

			<!-- export to pdf - admin only ! -->
			<challenge-export :challenge="challenge" />
		</div>
	</section>
</template>
