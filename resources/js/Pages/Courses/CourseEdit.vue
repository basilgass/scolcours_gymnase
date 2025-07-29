<script setup lang="ts">
// REFACTOR: retravailler l'édition d'un cours
// TODO: pour l'instant, on ne peut pas modifier les paramètres d'une leçon.

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {
	ChallengeInterface,
	ChapterInterface,
	CourseInterface,
	DeckInterface,
	GeneratorInterface,
	LessonInterface,
	PostShowInterface
} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, inject, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import CourseLessonEdit from "@/Components/Courses/CourseLessonEdit.vue"
import CourseGraph from "@/Components/Courses/CourseGraph.vue"
import {AxiosErrorMessage, AxiosResponseModel, flashInterface} from "@/types"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {lessonableClassName, LessonScoreRulesInterface} from "@/types/lessonInterfaces.ts"
import axios from "axios"
import {FormElementType} from "@/Components/Form/FormMakerInterface.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

const flash = inject<flashInterface>('flash')
const theCourse = ref<CourseInterface>(props.course)

const lessonable: lessonableClassName[] = ['Post', 'Deck', 'Challenge', 'Generator']

function updateCourse() {
	axios.patch(route('api.admin.courses.update', {course: theCourse.value.id}), {
		title: theCourse.value.title,
		slug: theCourse.value.slug,
		theme_id: theCourse.value.theme_id
	})
		.then((res: AxiosResponseModel<CourseInterface>) => {
			console.log(res.data)
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}


const chapter = ref<ChapterInterface>()
const posts = ref<PostShowInterface[]>([])

function loadPosts() {
	posts.value = []

	if (!chapter.value) {
		return
	}

	axios.get(route("api.chapters.posts", {chapter: chapter.value}))
		.then((res: AxiosResponseModel<PostShowInterface[]>) => {
			posts.value = res.data
		})
}

function addLesson(type: lessonableClassName, id: number) {

	const rules = Object.keys(scoreRules.value).length > 0 ? scoreRules.value : undefined

	axios
		.post(route('api.admin.courses.lessons.store', {course: props.course.id}), {
			"target_type": type.toLowerCase(),
			"target_id": id,
			scoreRules: rules
		})
		.then((res: AxiosResponseModel<LessonInterface>) => {
			theCourse.value.lessons.push(res.data)
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

const showAddTab = ref<lessonableClassName>(undefined)

function toggleTab(tab: lessonableClassName) {
	if (showAddTab.value === tab) {
		showAddTab.value = undefined

		return
	}

	if (tab === 'Challenge' && availableChallenges.value.length === 0) {
		loadChallenges()
	}

	if (tab === 'Generator' && availableGenerators.value.length === 0) {
		loadGenerators()
	}

	switch (tab) {
		case "Post":
		case "Deck":
			scoreRules.value = {}
			break
		case "Challenge":
		case "Generator":
			scoreRules.value = {target: 10}
			break
		default:
			scoreRules.value = {}
	}
	showAddTab.value = tab
}

function addAllPosts() {
	const coursesPostIds: number[] = theCourse.value.lessons
		.filter((lesson) => {
			return lesson.lessonable_type === 'Post'
		}).map(lesson => lesson.lessonable_id)

	const newPostIds = posts.value.filter(post => !coursesPostIds.includes(post.id))
		.map(post => post.id)

	axios
		.post(route('api.admin.courses.lessons.posts.store', {course: props.course.id}), {
			"ids": newPostIds
		})
		.then((res: AxiosResponseModel<LessonInterface[]>) => {
			theCourse.value.lessons.push(...res.data)
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

const deck = ref<DeckInterface>()
const availableChallenges = ref<ChallengeInterface[]>([])
const availableGenerators = ref<GeneratorInterface[]>([])
const scoreRules = ref<LessonScoreRulesInterface>(undefined)

function deleteLesson(lesson: LessonInterface) {
	axios.delete(route("api.admin.lessons.destroy", {lesson: lesson.id}))
		.then(() => {
			const index = theCourse.value.lessons.findIndex(l => l.id === lesson.id)

			if (index !== undefined) {
				theCourse.value.lessons.splice(index, 1)
			}
		})
}

// Gestion des leçons pour les relations
const itemSource = ref<LessonInterface>(undefined)
const counter = ref(1)

function onClick(lesson: LessonInterface, event: MouseEvent) {
	if (itemSource.value) {
		// Toggle requires to the itemSource.
		toggleIdInPlace(itemSource.value.requires, lesson.id)
		counter.value++

		// Mise à jour de la DB.
		axios.patch(route('api.admin.lessons.update', {lesson: itemSource.value.id}), {
			requires: itemSource.value.requires.join(','),
			parameters: itemSource.value.scoreRules
		}).then(() => {
			flash.success('Le cours a été mis à jour')
		}).catch((err: AxiosErrorMessage) => {
			flash.error('Il y a un problème avec ce cours.')
			console.warn(err.response.data.message)
		})
		return
	}
}

function setItemSource(lesson: LessonInterface) {
	itemSource.value = lesson.id === itemSource.value?.id ? undefined : lesson
}

function toggleIdInPlace(array: (string | number)[], id: string | number): void {
	const index = array.indexOf(id)
	if (index === -1) {
		array.push(id)
	} else {
		array.splice(index, 1)
	}
}

function loadChallenges() {
	axios
		.get(route('api.challenges.index'))
		.then((res: AxiosResponseModel<ChallengeInterface[]>) => {
			availableChallenges.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

function loadGenerators() {
	axios
		.get(route('api.generators.index'))
		.then((res: AxiosResponseModel<GeneratorInterface[]>) => {
			availableGenerators.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})

}

const lessonJsonMap = computed<Record<string, FormElementType>>(() => {
	switch (showAddTab.value) {
		case "Post":
			return {target: 'number', question_ids: 'text'}// TODO: FormMaker Json type cannot handle this.
		case "Challenge":
			return {target: "number", level: "number", occurences: "number"}
		case "Generator":
			return {target: "number", occurences: "number"}
		case "Deck":
			return {target: "number"}
		default:
			return {}
	}
})

</script>

<template>
	<main>
		<article-title
			prefix="édition"
			:title="course.title"
			:return-link="{
				label: 'retour aux cours',
				url: route('courses.index')
			}"
		/>

		<Card
			class="max-w-xl mx-auto"
		>
			<div class="flex flex-col gap-3 mb-3">
				<form-maker v-model="theCourse.title" />
				<form-maker
					xs
					disabled
					v-model="theCourse.slug"
				/>
				<form-maker
					label="thème du cours"
					type="theme"
					theme-key="id"
					v-model="theCourse.theme_id"
				/>
			</div>

			<template #footer>
				<div class="flex justify-end py-3">
					<sc-button
						type="save"
						@click="updateCourse"
						xs
					>
						enregistrer
					</sc-button>
				</div>
			</template>
		</Card>

		<Card class="my-10">
			<div class="flex gap-3 py-3">
				<sc-button
					v-for="t in lessonable"
					:key="`tab-btn-${t}`"
					xs
					:active="showAddTab===t"
					@click="toggleTab(t)"
				>
					{{ t }}
				</sc-button>
			</div>
		</Card>

		<div class="flex gap-3 my-10">
			<div class="flex-1 py-3">
				<div class="max-h-[40vh] overflow-y-scroll">
					<div v-show="!showAddTab">
						Sélectionner une leçon à ajouter...
					</div>

					<div
						v-show="showAddTab==='Post'"
						class="space-y-10"
					>
						<Card>
							<div class="py-3">
								<div>Choix du chapitre</div>
								<form-maker
									type="chapter"
									v-model="chapter"
									@update="loadPosts"
								/>
							</div>
							<template #footer>
								<div class="flex justify-end py-1">
									<sc-button
										v-show="posts.length>0"
										type="add"
										icon
										xs
										@click="addAllPosts"
									>
										ajouter tous les articles
									</sc-button>
								</div>
							</template>
						</Card>

						<div class="grid grid-cols-1 gap-3">
							<Card
								v-for="post in posts"
								:key="`post-${post.id}`"
							>
								<template #header>
									<div class="flex justify-between">
										<div v-katex.auto="post.title" />
										<div>{{ post.id }}</div>
									</div>
								</template>
								<div class="flex justify-end py-1">
									<sc-button
										type="add"
										icon
										xs
										@click="addLesson('Post', post.id)"
									>
										ajouter
									</sc-button>
								</div>
							</Card>
						</div>
					</div>

					<div v-show="showAddTab==='Deck'">
						<div>Choix d'un deck</div>
						<form-maker
							type="deck"
							v-model="deck"
						/>

						<Card v-if="deck">
							<template #header>
								<div v-katex.auto="deck.title" />
							</template>

							<div class="flex justify-end">
								<sc-button
									type="add"
									icon
									xs
									@click="addLesson('Deck', deck.id)"
								>
									ajouter
								</sc-button>
							</div>
						</Card>
					</div>

					<div v-show="showAddTab==='Challenge'">
						<div>Choix d'un challenge</div>
						<div class="flex flex-col gap-3">
							<Card
								v-for="challenge in availableChallenges"
								:key="`challenge-${challenge.id}`"
							>
								<template #header>
									<div v-katex.auto="challenge.title" />
								</template>

								<div class="flex justify-end">
									<sc-button
										type="add"
										icon
										xs
										@click="addLesson('Challenge', challenge.id)"
									>
										ajouter
									</sc-button>
								</div>
							</Card>
						</div>
					</div>

					<div v-show="showAddTab==='Generator'">
						<div>Choix d'un générateur</div>

						<div class="flex flex-col gap-3">
							<Card
								v-for="generator in availableGenerators"
								:key="`generator-${generator.id}`"
							>
								<template #header>
									<div v-katex.auto="generator.title" />
								</template>

								<div class="flex justify-end">
									<sc-button
										type="add"
										icon
										xs
										@click="addLesson('Generator', generator.id)"
									>
										ajouter
									</sc-button>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>

			<Card class="min-w-[300px]">
				<template #header>
					Score rules
				</template>

				<form-maker
					v-if="Object.keys(lessonJsonMap).length>0"
					type="json"
					:map="lessonJsonMap"
					v-model="scoreRules"
				/>
			</Card>
		</div>


		<article>
			<h2>Leçons</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div class="flex flex-col gap-3">
					<Card
						v-for="lesson in theCourse.lessons"
						:key="`lesson-${lesson.id}`"
						:class="{
							' bg-blue-100 border-blue-600 text-blue-600': itemSource?.id===lesson.id
						}"
					>
						<template #header>
							<div
								class="flex justify-between"
							>
								<div
									class="flex gap-3 items-baseline cursor-pointer"
									@click="setItemSource(lesson)"
								>
									<lesson-type-icon :lesson />

									<div
										class="text-lg font-[400]"
										v-katex.auto="lesson.title"
									/>
									<div class="font-code w-[16px] text-xs">
										({{ lesson.id }})
									</div>
								</div>

								<div v-if="itemSource?.id===lesson.id">
									{{ lesson.requires }}
								</div>
								<i
									v-else-if="itemSource"
									@click="onClick(lesson, $event)"
									class="bi bi-link text-xl text-blue-600 cursor-pointer"
								/>
							</div>
						</template>
						<course-lesson-edit
							:lesson
						/>
						<template #footer>
							<sc-button
								type="delete"
								icon
								xs
								@click="deleteLesson(lesson)"
							>
								supprimer
							</sc-button>
						</template>
					</Card>
				</div>
				<div>
					<course-graph
						:key="counter"
						:course
						@node-click="onClick"
					/>
				</div>
			</div>
		</article>
	</main>
</template>

<style scoped>

</style>
