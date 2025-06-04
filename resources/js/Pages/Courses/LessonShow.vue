<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {
	ChallengeInterface,
	CourseInterface,
	LessonInterface,
	PostShowInterface,
	UserDeckInterface
} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import Card from "@/Components/Ui/Card.vue"
import PostDisplay from "@/Components/Posts/PostDisplay.vue"
import {Link as InertiaLink} from "@inertiajs/vue3"
import ChallengeDisplay from "@/Components/Challenges/ChallengeDisplay.vue"
import LessonIsNotOpened from "@/Components/Courses/LessonIsNotOpened.vue"
import LessonIsUnknwon from "@/Components/Courses/LessonIsUnknwon.vue"
import {computed, ref} from "vue"
import {useStoreLesson} from "@/stores/useStoreLesson.ts"
import UserdeckShow from "@/Pages/Decks/UserdeckShow.vue"
import DeckDisplay from "@/Pages/Decks/DeckDisplay.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
	lesson: LessonInterface
}>()

const menuToggle = ref(true)
// TODO: title on InertiaLink with v-katex

const lessonScore = useStoreLesson()

lessonScore.init(props.lesson)

const lessonResult = computed<number>(() => {
	return Math.round(lessonScore.current / lessonScore.target * 100)
})

</script>

<template>
	<main>
		<header>
			<article-title
				:title="lesson.title"
				:return-link="{
					label: 'retour',
					url: ''
				}"
			/>
		</header>

		<div class="flex flex-col sm:flex-row gap-3 w-full">
			<article class="flex-1">
				<lesson-is-not-opened
					v-if="!lesson.calendar.is_opened"
					:lesson
				/>
				<post-display
					v-else-if="lesson.lessonable_type==='Post'"
					no-title
					:post="lesson.lessonable as PostShowInterface"
				/>
				<challenge-display
					v-else-if="lesson.lessonable_type==='Challenge'"
					:challenge="lesson.lessonable as ChallengeInterface"
					:selector="lesson.parameters.selector as number ?? 0"
				/>
				<deck-display
					v-else-if="lesson.lessonable_type==='Deck'"
					:deck="lesson.lessonable as UserDeckInterface"
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
									'text-slate-400': !l.calendar.is_opened
								}"
							>
								<i
									:class="{
										'bi bi-book': l.lessonable_type==='Post',
										'bi bi-question': l.lessonable_type==='Challenge',
										'bi bi-copy': l.lessonable_type==='Deck',
									}"
								/>
								<InertiaLink
									class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
									:href="route('lessons.show', {course: course.slug, lesson: l.id})"
									:disabled="!l.calendar.is_opened"
									v-katex.auto="l.title"
									:title="l.title"
								/>
								<div v-show="l.calendar.remaining_days>0">
									{{ l.calendar.remaining_days }}j
								</div>
							</div>
						</div>
					</Card>

					<Card>
						<template #header>
							<div
								class="flex justify-between cursor-pointer"
								:title="menuToggle?'':'formulaire'"
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
						:class="lessonResult>=100 ? 'bg-green-100 border-green-600 text-green-600':''"
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
									{{ lessonResult }} %
								</div>
							</div>
						</template>
					</Card>
				</div>
			</aside>
		</div>
	</main>
</template>

<style scoped>

</style>
