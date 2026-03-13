<script lang="ts" setup>
import {
	ChallengeInterface,
	ChapterInterface,
	CourseInterface,
	DeckInterface,
	LessonInterface,
	PostShowInterface
} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import CourseLessonEdit from "@/Components/Courses/CourseLessonEdit.vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {lessonableClassName, LessonScoreRulesInterface} from "@/types/lessonInterfaces.ts"
import axios from "axios"
import {FormElementType} from "@/Components/Form/FormMakerInterface.ts"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {useCourse} from "@/Pages/Courses/useCourse.ts"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import PostTypeIcon from "@/Components/Posts/PostTypeIcon.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import FormSearchModel from "@/Components/Form/FormSearchModel/FormSearchModel.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

const flash = useStoreFlashMessage()
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

	axios.get(route("api.chapters.posts.index", {chapter: chapter.value}))
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
			updateLessonsOrder()
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
			updateLessonsOrder()
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

const deck = ref<DeckInterface>()
const availableChallenges = ref<ChallengeInterface[]>([])
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

function onClick(lesson: LessonInterface) {
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

const lessonJsonMap = computed<Record<string, FormElementType>>(() => {
	return useCourse().lessonScoreRulesMap(showAddTab.value)
})

function updateLessonsOrder() {
	axios
		.post(
			route("api.admin.courses.lessons.order", {course: props.course.id}),
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
			:return-link="{
				label: 'retour à la liste des cours',
				url: route('admin.courses.index')
			}"
			:title="course.title"
			prefix="édition"
		/>

		<Card>
			<div class="flex flex-col gap-3">
				<form-maker v-model="theCourse.title" />
				<form-maker
					v-model="theCourse.slug"
					xs
				/>
				<form-maker
					v-model="theCourse.theme_id"
					label="thème du cours"
					theme-key="id"
					type="theme"
				/>

				<div class="flex justify-between">
					<div class="mt-5 mb-1 uppercase">
						description du cours
					</div>

					<div class="flex justify-end py-3">
						<sc-button
							type="save"
							xs
							@click="updateCourse"
						>
							enregistrer
						</sc-button>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					<form-maker
						v-model="theCourse.block.body"
						auto-size
						label="description du cours"
						resizeable
						type="codearea"
					/>
					<markdown-it :text="theCourse.block.body" />
				</div>
			</div>
		</Card>

		<Card class="my-10">
			<div class="flex gap-3 py-3">
				<sc-button
					v-for="t in lessonable"
					:key="`tab-btn-${t}`"
					:active="showAddTab===t"
					xs
					@click="toggleTab(t)"
				>
					{{ t }}
				</sc-button>
			</div>
		</Card>

		<div class="flex gap-3 my-10">
			<div class="flex-1 py-3">
				<div class="max-h-[80vh] overflow-y-auto">
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
									v-model="chapter"
									type="chapter"
									@update="loadPosts"
								/>
							</div>
							<template #footer>
								<div class="flex justify-end py-1">
									<sc-button
										v-show="posts.length>0"
										icon
										type="add"
										xs
										@click="addAllPosts"
									>
										ajouter tous les articles
									</sc-button>
								</div>
							</template>
						</Card>

						<form-search-model
							v-show="showAddTab==='Post'"
							:api-route="chapter ? route('api.chapters.posts.index', {chapter}) : null"
							title="posts"
							@selected="addLesson('Post', $event.id)"
							@on-loaded="posts = $event as PostShowInterface[]"
						>
							<template #title="{item}: {item: PostShowInterface}">
								<div class="flex gap-2">
									<post-type-icon
										:post="item"
									/>
									<div
										v-katex.auto="item.title"
									/>
								</div>
							</template>
						</form-search-model>
					</div>

					<form-search-model
						v-show="showAddTab==='Deck'"
						:api-route="route('api.decks.index')"
						title="decks"
						@selected="addLesson('Deck', $event.id)"
					/>

					<form-search-model
						v-show="showAddTab==='Challenge'"
						:api-route="route('api.challenges.index')"
						title="challenges"
						@selected="addLesson('Challenge', $event.id)"
					/>

					<form-search-model
						v-show="showAddTab==='Generator'"
						:api-route="route('api.generators.index')"
						title="générateurs"
						@selected="addLesson('Generator', $event.id)"
					/>
				</div>
			</div>

			<Card class="min-w-[300px]">
				<template #header>
					Score rules
				</template>

				<form-maker
					v-if="Object.keys(lessonJsonMap).length>0"
					v-model="scoreRules"
					:map="lessonJsonMap"
					type="json"
				/>
			</Card>
		</div>


		<article>
			<h2>Leçons</h2>

			<draggable
				v-if="lessons.length"
				:list="lessons"
				class="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
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
										v-katex.auto="element.title"
										class="text-lg font-[400]"
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
									class="bi bi-link text-xl text-blue-600 cursor-pointer"
									@click="onClick(element)"
								/>
							</div>
						</template>

						<course-lesson-edit
							:lesson="element"
						/>

						<template #footer>
							<div class="flex justify-between">
								<div />
								<confirm-button
									xs
									@confirm="deleteLesson(element)"
								>
									supprimer
								</confirm-button>
							</div>
						</template>
					</Card>
				</template>
			</draggable>
		</article>
	</main>
</template>

<style scoped>

</style>
