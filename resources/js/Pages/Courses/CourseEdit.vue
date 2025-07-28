<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {
	ChallengeInterface,
	ChapterInterface,
	CourseInterface,
	DeckInterface, GeneratorInterface,
	LessonInterface,
	PostShowInterface
} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {inject, onMounted, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import CourseLessonEdit from "@/Components/Courses/CourseLessonEdit.vue"
import CourseGraph from "@/Components/Courses/CourseGraph.vue"
import {AxiosErrorMessage, AxiosResponseModel, flashInterface} from "@/types"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {lessonableClassName} from "@/types/lessonInterfaces.ts"
import axios from "axios"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

const flash = inject<flashInterface>('flash')
const theCourse = ref<CourseInterface>(props.course)

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
	axios
		.post(route('api.admin.courses.lessons.store', {course: props.course.id}), {
			"target_type": type.toLowerCase(),
			"target_id": id
		})
		.then((res: AxiosResponseModel<LessonInterface>) => {
			theCourse.value.lessons.push(res.data)
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

function addPost(post: PostShowInterface) {
	addLesson('Post', post.id)
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

function addDeck(deck: DeckInterface) {
	addLesson('Deck', deck.id)
}

const availableChallenges = ref<ChallengeInterface[]>([])

function addChallenge(challenge: ChallengeInterface) {
	addLesson('Challenge', challenge.id)
}

const availableGenerators = ref<GeneratorInterface[]>([])

function addGenerator(challenge: GeneratorInterface) {
	addLesson('Generator', challenge.id)
}

function deleteLesson(lesson: LessonInterface) {
	axios.delete(route("api.admin.lessons.destroy", {lesson: lesson.id}))
		.then(() => {
			const index = theCourse.value.lessons.findIndex(l => l.id === lesson.id)

			if (index) {
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

onMounted(() => {
	axios
		.get(route('api.challenges.index'))
		.then((res: AxiosResponseModel<ChallengeInterface[]>) => {
			availableChallenges.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})

	axios
		.get(route('api.generators.index'))
		.then((res: AxiosResponseModel<GeneratorInterface[]>) => {
			availableGenerators.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
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

		<div>
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

			<sc-button
				type="save"
				@click="updateCourse"
			>
				enregistrer
			</sc-button>
		</div>

		<div>
			<div>Choix du chapitre</div>
			<form-maker
				type="chapter"
				v-model="chapter"
				@update="loadPosts"
			/>

			<div class="grid grid-cols-1 gap-3">
				<div
					v-for="post in posts"
					:key="`post-${post.id}`"
				>
					<Card>
						<template #header>
							<div class="flex justify-between">
								<div v-katex.auto="post.title" />
								<div>{{ post.id }}</div>
							</div>
						</template>
						<div class="flex justify-end">
							<sc-button
								type="add"
								icon
								xs
								@click="addPost(post)"
							>
								ajouter
							</sc-button>
						</div>
					</Card>
				</div>
			</div>

			<sc-button
				type="add"
				icon
				xs
				@click="addAllPosts"
			>
				ajouter tous les articles
			</sc-button>
		</div>

		<div>
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
						@click="addDeck(deck)"
					>
						ajouter
					</sc-button>
				</div>
			</Card>
		</div>

		<div v-if="availableChallenges.length>0">
			<div>Choix d'un challenge</div>
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
						@click="addChallenge(challenge)"
					>
						ajouter
					</sc-button>
				</div>
			</Card>
		</div>

		<div v-if="availableGenerators.length>0">
			<div>Choix d'un challenge</div>
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
						@click="addGenerator(generator)"
					>
						ajouter
					</sc-button>
				</div>
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
