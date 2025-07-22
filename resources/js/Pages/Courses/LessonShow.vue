<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {
	ChallengeInterface,
	CourseInterface,
	DeckInterface, GeneratorInterface,
	LessonInterface,
	PostShowInterface,
	ScoreInterface
} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import Card from "@/Components/Ui/Card.vue"
import PostDisplay from "@/Components/Posts/PostDisplay.vue"
import {Link as InertiaLink} from "@inertiajs/vue3"
import ChallengeDisplay from "@/Components/Challenges/ChallengeDisplay.vue"
import LessonIsUnknwon from "@/Components/Courses/LessonIsUnknwon.vue"
import {ref} from "vue"
import DeckDisplay from "@/Pages/Decks/DeckDisplay.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormulaSearch from "@/Components/FormulaSearch.vue"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"
import {ScoreLessonDataInterface} from "@/types/scoreInterfaces.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface,
	lesson: LessonInterface,
	score: ScoreInterface,
}>()

const menuToggle = ref(true)

const scoreStore = useStoreScore()
const score = await scoreStore.getScore<ScoreLessonDataInterface>('Lesson', props.lesson.id)


const showFormularDialog = ref(false)


</script>

<template>
	<main>
		<header>
			<article-title
				:title="lesson.title"
				:return-link="{
					label: 'retour au cours',
					url: route('students.courses.show', {course: course.slug})
				}"
			/>
		</header>

		<div class="flex flex-col sm:flex-row gap-3 w-full">
			<article class="flex-1">
				<!--				<lesson-is-not-opened-->
				<!--					v-if="!lesson.calendar.is_opened"-->
				<!--					:lesson-->
				<!--				/>-->
				<post-display
					v-if="lesson.lessonable_type==='Post'"
					no-title
					:post="lesson.lessonable as PostShowInterface"
				/>
				<challenge-display
					v-else-if="lesson.lessonable_type==='Challenge'"
					:challenge="lesson.lessonable as ChallengeInterface"
					:selector="0"
				/>
				<challenge-training
					v-else-if="lesson.lessonable_type==='Generator'"
					:generator="lesson.lessonable as GeneratorInterface"
				/>
				<deck-display
					v-else-if="lesson.lessonable_type==='Deck'"
					:deck="lesson.lessonable as DeckInterface"
				/>
				<lesson-is-unknwon v-else />
			</article>

			<aside
				class="w-full text-sm relative"
				:class="{
					'sm:w-[200px] md:w-[250px]': menuToggle,
					'sm:max-w-[40px]':!menuToggle
				}"
			>
				<div class="sticky top-3 space-y-3">
					<Card>
						<template #header>
							<div
								@click="menuToggle = !menuToggle"
								class="flex justify-between cursor-pointer"
								:title="menuToggle?'':'menu'"
							>
								<div v-show="menuToggle">
									menu
								</div>
								<i
									class="bi bi-chevron-double-right transition-all"
									:class="menuToggle ? '' : 'rotate-180'"
								/>
							</div>
						</template>
						<div
							class="space-y-1 py-3"
							v-if="menuToggle"
						>
							<div
								v-for="l in course.lessons"
								:key="`goto-${l.id}`"
								class="flex gap-2 hover:pl-1 transition-all"
								v-theme.text="l.id===lesson.id"
								:class="{
									'font-semibold': l.id===lesson.id,
								}"
							>
								<lesson-type-icon :lesson="l" />
								<InertiaLink
									class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
									:href="route('students.lessons.show', {course: course.slug, lesson: l.id})"
									v-katex.auto="l.title"
									:title="l.title"
								/>
								<!--								<div v-show="l.calendar.remaining_days>0">-->
								<!--									{{ l.calendar.remaining_days }}j-->
								<!--								</div>-->
							</div>
						</div>
					</Card>

					<Card>
						<template #header>
							<div
								class="flex justify-between cursor-pointer"
								:title="menuToggle?'':'formulaire'"
								@click="showFormularDialog=true"
							>
								<div v-show="menuToggle">
									formulaire
								</div>
								<i
									class="bi bi-book-half"
								/>
							</div>
						</template>
					</Card>

					<Card
						:class="score.is_resolved ? 'bg-green-100 border-green-600 text-green-600':''"
					>
						<template #header>
							<div
								class="flex justify-between cursor-pointer"
								:title="menuToggle?'':'score'"
							>
								<div v-show="menuToggle">
									score
								</div>
								<div class="whitespace-nowrap">
									{{ score.score }} %
								</div>
							</div>
						</template>
					</Card>
				</div>
			</aside>
		</div>

		<dialog-modal v-model="showFormularDialog">
			<template #header>
				<div class="p-3 flex justify-between">
					<h3
						class="text-2xl font-semibold"
					>
						Formulaire
					</h3>
					<i
						class="bi bi-x-lg cursor-pointer"
						@click="showFormularDialog=false"
					/>
				</div>
			</template>
			<formula-search
				class="px-3 pb-3"
				:theme-id="course.theme_id"
			/>
		</dialog-modal>
	</main>
</template>

<style scoped>

</style>
