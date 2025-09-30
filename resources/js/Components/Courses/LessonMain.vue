<script setup lang="ts">

import ChallengeDisplay from "@/Components/Challenges/ChallengeDisplay.vue"
import LessonIsUnknwon from "@/Components/Courses/LessonIsUnknwon.vue"
import PostDisplay from "@/Components/Posts/PostDisplay.vue"
import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"
import DeckDisplay from "@/Pages/Decks/DeckDisplay.vue"
import {
	ChallengeInterface,
	DeckInterface,
	GeneratorInterface,
	LessonInterface,
	PostShowInterface
} from "@/types/modelInterfaces.ts"
import {lessonableModel} from "@/types/lessonInterfaces.ts"

defineProps<{
	lessonable: lessonableModel,
	lesson: LessonInterface
}>()

</script>

<template>
	<article class="flex-1">
		<div v-if="!lessonable">
			Chargement du cours...
		</div>
		<post-display
			v-else-if="lesson.lessonable_type==='Post'"
			no-title
			:post="lessonable as PostShowInterface"
		/>
		<challenge-display
			v-else-if="lesson.lessonable_type==='Challenge'"
			:challenge="lessonable as ChallengeInterface"
			:selector="0"
		/>
		<suspense v-else-if="lesson.lessonable_type==='Generator'">
			<challenge-training
				:generator="lessonable as GeneratorInterface"
			/>
		</suspense>
		<suspense v-else-if="lesson.lessonable_type==='Deck'">
			<deck-display
				:deck="lessonable as DeckInterface"
			/>
		</suspense>
		<lesson-is-unknwon v-else />
	</article>
</template>

<style scoped>

</style>
