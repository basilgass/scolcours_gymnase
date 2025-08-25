<script setup lang="ts">
// REFACTOR: retravailler l'édition d'un cours

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
import {AxiosErrorMessage, AxiosResponseModel, flashInterface} from "@/types"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {lessonableClassName, LessonScoreRulesInterface} from "@/types/lessonInterfaces.ts"
import axios from "axios"
import {FormElementType} from "@/Components/Form/FormMakerInterface.ts"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {useCourse} from "@/Pages/Courses/useCourse.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

const flash = inject<flashInterface>('flash')
const theCourse = ref<CourseInterface>(props.course)
const lessons = ref<LessonInterface[]>(props.course.lessons)
const lessonable: lessonableClassName[] = ['Post', 'Deck', 'Challenge', 'Generator']

function updateCourse() {
	axios.patch(route('api.admin.courses.update', {course: theCourse.value.id}), {
		title: theCourse.value.title,
		slug: theCourse.value.slug,
		theme_id: theCourse.value.theme_id,
		body: theCourse.value.block.body,
	})
		.then((res: AxiosResponseModel<CourseInterface>) => {
			console.log(res.data)
			flash.success("Le cours a bien été enregistré.")
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
	return useCourse().lessonScoreRulesMap(showAddTab.value)
})

function updateLessonsOrder() {
	axios
		.post(
			route("api.admin.courses.lessons.updateOrder", {course: props.course.id}),
			{
				_method: "PATCH",
				order: lessons.value.map((x, index) => {
					return {id: x.id, order: index + 1}
				})
			}
		)
		.then(() => {
			flash.success("les leçons ont bien été mis à jour !")
		})
		.catch((res) => {
				console.warn(res.data)
				flash.error("update lessons order failed")
			}
		)
}

</script>

<template>
	<main>
		<article-title
			prefix="édition"
			:title="course.title"
			:return-link="{
				label: 'retour à la liste des cours',
				url: route('admin.courses.index')
			}"
		/>

		<Card
			class="max-w-2xl mx-auto"
		>
			<div class="flex flex-col gap-3 mb-3">
				<form-maker v-model="theCourse.title" />
				<form-maker
					xs
					v-model="theCourse.slug"
				/>
				<form-maker
					label="thème du cours"
					type="theme"
					theme-key="id"
					v-model="theCourse.theme_id"
				/>

				<div class="mt-5 mb-1 uppercase">
					description du cours
				</div>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					<form-maker
						label="description du cours"
						type="codearea"
						v-model="theCourse.block.body"
					/>
					<markdown-it :text="theCourse.block.body" />
				</div>
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

			<draggable
				v-if="lessons.length"
				:list="lessons"
				class="mt-10 grid grid-cols-1 gap-3"
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
				}"
				@end="updateLessonsOrder"
			>
				<template #item="{ element }: {element: LessonInterface}">
					<Card
						:class="{
							' bg-blue-100 border-blue-600 text-blue-600': itemSource?.id===element.id
						}"
					>
						<template #header>
							<div
								class="flex justify-between"
							>
								<div
									class="flex gap-3 items-baseline cursor-pointer"
									@click="setItemSource(element)"
								>
									<i class="bi bi-arrows-move draggable-handle" />
									<lesson-type-icon :lesson="element" />

									<div
										class="text-lg font-[400]"
										v-katex.auto="element.title"
									/>
									<div class="font-code w-[16px] text-xs">
										({{ element.id }})
									</div>
								</div>

								<div v-if="itemSource?.id===element.id">
									{{ element.requires }}
								</div>
								<i
									v-else-if="itemSource"
									@click="onClick(element, $event)"
									class="bi bi-link text-xl text-blue-600 cursor-pointer"
								/>
							</div>
						</template>

						<course-lesson-edit
							:lesson="element"
						/>

						<template #footer>
							<div class="flex justify-between">
								<div />
								<sc-button
									type="delete"
									icon
									xs
									@click="deleteLesson(element)"
								>
									supprimer
								</sc-button>
							</div>
						</template>
					</Card>
				</template>
			</draggable>

			<!--			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">-->
			<!--				<div class="flex flex-col gap-3">-->
			<!--					-->
			<!--				</div>-->
			<!--				<div>-->
			<!--					<course-graph-->
			<!--						:key="counter"-->
			<!--						:course-->
			<!--						@node-click="onClick"-->
			<!--					/>-->
			<!--				</div>-->
			<!--			</div>-->
		</article>
	</main>
</template>

<style scoped>

</style>
