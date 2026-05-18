<script lang="ts" setup>

import {CourseInterface, ScoreInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import dayjs from "dayjs"
import {computed, onMounted, ref} from "vue"
import {router} from "@inertiajs/vue3"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreLessonDataInterface} from "@/types/scoreInterfaces.ts"

const props = defineProps<{
	course: CourseInterface,
	team?: TeamInterface
}>()

const editMode = useStoreEditMode()

const scheduledAt_formated = computed<string>(() => {
	return props.course.scheduled_at ? dayjs(props.course.scheduled_at).format('dddd DD MMMM YYYY à HH:mm') : null
})

const score = ref<number>(0)
const useScores = useStoreScore()
const total = computed(() => props.course.lessons.length)
onMounted(() => {
	useScores.getScores('Lesson', props.course.lessons.map(l => l.id))
		.then((scores: ScoreInterface<ScoreLessonDataInterface>[]) => {
			score.value = scores.filter(s => s.is_resolved).length
		})
})
</script>

<template>
	<Card
		:class="{
			'opacity-40 hover:opacity-100': course.status==='not yet started'
		}"
		class="transition-all"
		:success="total > 0 && score===total"
	>
		<!-- le header ne s'affiche qu'en mode admin -->
		<template
			v-if="editMode.enable"
			#header
		>
			<div class="flex justify-between items-baseline">
				<div class="font-code text-xs">
					id: {{ course.id }}
				</div>
				<div
					v-admin="editMode.enable"
					class="flex gap-3"
				>
					<sc-button
						v-if="team"
						:href="route('admin.courses.teams.dashboard', {course: course.id, team: team.name})"
						type="primary"
						xs
					>
						voir la leçon
					</sc-button>
					<sc-button
						:href="route('admin.courses.edit', {course: course.id})"
						icon
						type="edit"
						xs
					>
						éditer le cours
					</sc-button>
				</div>
			</div>
		</template>

		<!-- body -->
		<div
			class="flex flex-col gap-3 cursor-pointer h-full"
			@click="router.visit(route('students.courses.show', {course: course.slug}))"
		>
			<h1
				v-katex.auto="course.title"
				class="text-lg md:text-xl lg:text-2xl flex-1"
			/>

			<hr class="border-content">
			<div class="text-center text-lg md:text-xl">
				{{ score }} / {{ total }}
			</div>
		</div>

		<!-- footer -->
		<template #footer>
			<div class="text-xs text-slate-500 py-1 flex justify-between">
				<div v-if="course.status==='finished'">
					terminé le {{ scheduledAt_formated }}
				</div>
				<div v-else-if="course.status==='not yet started'">
					le cours n'a pas encore commencé
				</div>
				<div v-else>
					prochaine échéance : {{ scheduledAt_formated }}
				</div>
				<div>{{ course.lessons.length }} leçons</div>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
