<!--
Affichage de la liste des challenges pour un chapitre donné.
-->
<script lang="ts" setup>
import {ChallengeMinInterface, ChapterShowInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import ChallengeCreateButton from "@/Components/Challenges/ChallengeCreateButton.vue"

let props = defineProps<{
	chapter: ChapterShowInterface,
	challenges: ChallengeMinInterface[]
}>()

</script>

<template>
	<div>
		<h3 class="uppercase font-extralight mb-2">
			challenges
		</h3>

		<div
			v-if="challenges.length>0"
			class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8"
		>
			<sc-button
				v-for="challenge in challenges"
				:key="`challenge-${challenge.id}`"
				v-katex.auto="challenge.title"
				theme
				:href="route('challenges.show', { challenge: challenge.slug })"
				class="py-5"
			/>
		</div>

		<challenge-create-button :chapter-id="props.chapter.id" />
	</div>
</template>
