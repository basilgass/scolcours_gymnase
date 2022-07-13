<template>
	<div ref="root">
		<!-- Enable edition mode for the whole chapter -->
		<div
			v-if="$page.props.auth.can.admin"
			class="pt-5 text-right"
		>
			<form-switch
				v-model="editMode"
				name="editMode"
				label="mode édition"
				@click="storeEditMode"
			/>
		</div>

		<!-- Main title -->
		<chapter-header
			:theme="theme"
			:chapter="chapter.data"
		/>

		<!-- Header dashboard -->
		<section class="grid grid-cols-3 gap-4 my-10">
			<Panel>
				<template #title>
					Table des matières
				</template>
				<div class="flex flex-col gap-3 mb-4">
					<div
						v-if="chapter.data.formulas.length>0"
						class="cursor-pointer"
						:class="`hover:border-b border-scolcours-${$page.props.theme.slug}`"
						@click="menuScrollTo('chapter-formula')"
					>
						formulaire
					</div>

					<div
						v-for="post in chapterPosts"
						:key="post.id"
						class="cursor-pointer"
						@click="menuScrollTo(`post-${post.id}`)"
					>
						{{ post.title }}
					</div>

					<div
						v-if="chapterExercises.length>0"
						class="cursor-pointer"
						:class="`hover:border-b border-scolcours-${$page.props.theme.slug}`"
						@click="menuScrollTo('chapter-exercises')"
					>
						Exercices
					</div>
				</div>
			</Panel>

			<Panel
				v-if="chapterExercises.length>0"
				class="cursor-pointer"
				@click="menuScrollTo('chapter-exercises')"
			>
				<template #title>
					Exercices
				</template>
				<div>{{ chapterExercises.length }} exercices, {{ numberOfQuestions.questions }} questions</div>
				<div>{{ exercisesResolvedRatio }} % accompli</div>
				<div class="border border-green-700 rounded bg-green-50">
					<div
						class="bg-green-500 h-2"
						:style="`width: ${exercisesResolvedRatio}%`"
					/>
				</div>
			</Panel>

			<Panel v-if="chapter.data.challenges.length>0">
				<template #title>
					Challenges
				</template>

				<div class="flex flex-col gap-3 mb-4">
					<Link
						v-for="challenge in chapter.data.challenges"
						:key="`challenge-${challenge.id}`"
						class="line-clamp-1 transition-color duration-500"
						:class="`hover:border-b border-scolcours-${$page.props.theme.slug}`"
						:href="route('chapters.challenge', [theme.slug, chapter.data.slug, challenge.slug])"
					>
						{{ challenge.title }}
					</Link>
				</div>
			</Panel>
		</section>

		<!-- Adding all the available posts -->
		<section class="space-y-10">
			<!-- Adding the formulas -->
			<chapter-formulas
				v-if="chapter.data.formulas.length>0 || ($page.props.auth.can.admin && editMode)"
				id="chapter-formula"
				:chapter="chapter.data"
			/>

			<div
				v-if="chapterPosts.length>0"
				class="space-y-10"
			>
				<div class="space-y-10">
					<post-show
						v-for="post in chapterPosts"
						:id="`post-${post.id}`"
						:key="post.id"
						:post="post"
						@delete="deletePost(post.id)"
						@updateTitle="post.title=$event"
					/>
				</div>
			</div>
			<div class="mt-10 text-center space-y-8">
				<div v-if="chapterPosts.length===0">
					Aucun article - que c'est triste
				</div>

				<button
					v-if="$page.props.auth.can.admin && editMode"
					class="btn-primary"
					@click="createPost"
				>
					Créer un article
				</button>
			</div>
		</section>

		<!-- Adding all the available exercises -->
		<section
			v-if="chapterExercises.length>0"
			class="space-y-10"
		>
			<div class="flex justify-between">
				<h2
					id="chapter-exercises"
					class="text-xl"
				>
					Exercices
				</h2>
				<button
					v-if="!(displayExercises.length===0 && chapterExercises.length>0)"
					class="btn btn-xs"
					:class="{
						'text-blue-900 border-blue-600 hover:bg-blue-100':showOnlyUnfishedExercises,
						'text-red-900 border-red-600 hover:bg-red-100':!showOnlyUnfishedExercises
					}"
					@click="showOnlyUnfishedExercises=!showOnlyUnfishedExercises"
				>
					{{ showOnlyUnfishedExercises ? 'Afficher tous les exercices' : 'Cacher les exercices résolus' }}
				</button>
			</div>
			<div
				v-for="exercise in displayExercises"
				:key="`chapterexercise-${exercise.id}`"
			>
				<exercise-show
					:exercise="exercise"
					@delete="deleteExercise(exercise.id)"
					@resolved="questionHasBeenResolved"
				/>
			</div>
			<div
				v-if="displayExercises.length===0 && chapterExercises.length>0"
				class="flex flex-col gap-5 items-center"
			>
				<div>Vous avez déjà répondu à tous les exercices !</div>
				<div class="text-center">
					<button
						class="btn border-blue-600 hover:bg-blue-100"
						@click="showOnlyUnfishedExercises=!showOnlyUnfishedExercises"
					>
						{{ showOnlyUnfishedExercises ? 'Afficher tous les exercices' : 'Cacher les exercices résolus' }}
					</button>
				</div>
			</div>

			<div v-if="$page.props.auth.can.admin && editMode">
				<button
					class="btn-primary"
					@click="addExercise"
				>
					Ajouter un exercice
				</button>
			</div>
		</section>
		<section
			v-else
			class="mt-20 text-center flex flex-col gap-8"
		>
			Aucun exercice en vue - que c'est triste

			<div v-if="$page.props.auth.can.admin && editMode">
				<button
					class="btn-primary"
					@click="addExercise"
				>
					Ajouter un exercice
				</button>
			</div>
		</section>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import ChapterFormulas from "@/Components/Ui/Chapters/Formulas/ChapterFormulas"
import {provide, ref, computed} from "vue"
import ChapterHeader from "@/Components/Ui/Chapters/ChapterHeader"
import PostShow from "@/Components/Posts/PostShow"
import Panel from "@/Components/Ui/Panel"
import ExerciseShow from "@/Components/Posts/ExerciseShow"
import FormSwitch from "@/Components/Form/FormSwitch"

let root = ref(null)

const props = defineProps({
	theme: {
		type: Object, default: () => {
		}
	},
	chapter: {
		type: Object, default: () => {
		}
	},
	edit: {type: Boolean, default: false}
})

let chapterPosts = ref(props.chapter.data.posts),
	chapterExercises = ref(props.chapter.data.exercises),
	editMode = ref(localStorage.getItem("ScolCoursEditMode")==="1")

let showOnlyUnfishedExercises = ref(true),
	unfinishedExercisesAtLoad = chapterExercises.value.filter(exercise => {
		return exercise.questions.filter(question=> {
			const answers = question.userAnswers
			if(answers.length===0){return true}
			return answers[answers.length-1].result===0
		}).length>0
	}),
	displayExercises = computed(()=>{
		if(showOnlyUnfishedExercises.value){
			return unfinishedExercisesAtLoad
		}else{
			return chapterExercises.value
		}
	})

provide("editmode", editMode)
function storeEditMode(){
	localStorage.setItem("ScolCoursEditMode", editMode.value?"1":"0")
}

let numberOfQuestions = computed( () => {
	let n = 0, resolved = 0
	chapterExercises.value.forEach(exercise => {
		// count the number of questions.
		n += exercise.questions.length

		// Get the number of resolved questions.
		exercise.questions.forEach(question => {
			if (question.userAnswers.length > 0) {
				resolved = resolved + (question.userAnswers[question.userAnswers.length-1].result?1:0)
			}
		})
	})

	return {
		questions: n,
		resolved
	}
})
let exercisesResolvedRatio = computed(() => {
	return numberOfQuestions.value.questions>0 ? Math.round(numberOfQuestions.value.resolved/numberOfQuestions.value.questions*100): 0
})
function questionHasBeenResolved(event){
	return exercisesResolvedRatio
}

function createPost() {
	axios.post(
		route("chapters.posts.store", [props.chapter.data.slug]),
		{
			title: "no title",
		}
	)
		.then(res => {
			const post = res.data
			post.isNew = true
			chapterPosts.value.push(post)
		})
		.catch(err => console.log(err))
}

function deletePost(id) {
	// Remove the post from the list.
	chapterPosts.value = chapterPosts.value.filter(post => post.id !== id)
}

function addExercise() {
	axios.post(
		route("chapters.exercises.store", [props.chapter.data.slug]),
		{}
	).then(res=>{
		chapterExercises.value.push(res.data)
	})
}

function deleteExercise(id){
	chapterExercises.value = chapterExercises.value.filter(exercise => exercise.id !== id)
}

function menuScrollTo(id) {
	let el = id === undefined ? document.body : document.getElementById(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}
</script>
