<template>
	<section class="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
		<Panel>
			<template #title>
				Table des matières
			</template>
			<div class="flex flex-col gap-3 mb-4">
				<div
					v-if="props.chapter.formulas.length>0"
					class="cursor-pointer"
					:class="`hover:border-b border-scolcours-${$page.props.theme.slug}`"
					@click="menuScrollTo('chapter-formula')"
				>
					formulaire
				</div>

				<!-- list of posts titles -->
				<div
					v-for="post in chapterToc"
					:key="post.id"
					class="cursor-pointer"
					@click="menuScrollTo(`post-${post.id}`)"
				>
					{{ post.title }}
				</div>
			</div>
		</Panel>

		<Panel
			v-if="$page.props.auth.user"
			class="cursor-pointer"
			@click="menuScrollTo('chapter-exercises')"
		>
			<template #title>
				Exercices
			</template>

			<div class="space-y-5 justify-between">
				<div>{{ chapterExercises.length }} exercices</div>
				<div>{{ chapterQuestions.answered }}/{{ chapterQuestions.questions }} questions répondues</div>
				<div>
					<div>{{ chapterQuestionsRatio }} % accompli</div>
					<div class="border border-green-700 rounded bg-green-50">
						<div
							class="bg-green-500 h-2"
							:style="`width: ${chapterQuestionsRatio}%`"
						/>
					</div>
				</div>
			</div>
		</Panel>

		<Panel v-if="props.chapter.challenges.length>0 || editMode">
			<template #title>
				Challenges
			</template>

			<div class="flex flex-col gap-3 mb-4">
				<Link
					v-for="challenge in props.chapter.challenges"
					:key="`challenge-${challenge.id}`"
					class="line-clamp-1 transition-color duration-500"
					:class="`hover:border-b border-scolcours-${$page.props.theme.slug}`"
					:href="route('chapters.challenge', [$page.props.theme.slug, props.chapter.slug, challenge.slug])"
				>
					{{ challenge.title }}
				</Link>
			</div>

			<div v-if="$page.props.auth.can.admin && editMode">
				<button
					class="btn-primary w-full"
					@click="showCreateChallenge=true"
				>
					Nouveau challenge
				</button>

				<dialog-modal
					v-model="showCreateChallenge"
				>
					<form-input
						v-model="newChallengeForm.title"
						label="Nouveau challenge"
						name="newChallenge"
						:focus="true"
						@enter="createNewChallenge"
						@cancel="showCreateChallenge=false"
					/>
					<form-button @click="createNewChallenge">
						Créer un nouveau challenge
					</form-button>
				</dialog-modal>
			</div>
		</Panel>
	</section>
</template>

<script setup>
import {computed, inject, ref} from "vue"
import Panel from "@/Components/Ui/Panel"
import DialogModal from "@/Components/Ui/DialogModal"
import FormInput from "@/Components/Form/FormInput"
import FormButton from "@/Components/Form/FormButton"
import {useForm} from "@inertiajs/inertia-vue3"

let props = defineProps({
	chapter: {type: Object, required: true}
})

let editMode = inject("editmode"),
	showCreateChallenge = ref(false),
	newChallengeForm = useForm({
		"title": "challenge"
	})

function createNewChallenge() {
	newChallengeForm.post(route("chapters.challenges.store", [props.chapter.slug]))
}

let chapterPosts = inject("chapterPosts"),
	chapterToc = computed(() => chapterPosts.value.filter(post => !post.type)),
	chapterExercises = computed(() => chapterPosts.value.filter(post => post.type === "exercise")),
	chapterQuestions = computed(() => {
		const questions = chapterPosts.value.reduce((sum, post) => sum + post.questions.length, 0),
			answered = chapterPosts.value
				.reduce((sum, post) => sum + post.questions
					.filter(question => question.userHasCorrectAnswer).length, 0)

		return {
			questions,
			answered
		}
	}),
	chapterQuestionsRatio = computed(() => {
		return chapterQuestions.value.questions > 0 ? Math.round(chapterQuestions.value.answered / chapterQuestions.value.questions * 100) : 0
	})

function menuScrollTo(id) {
	let el = id === undefined ? document.body : document.getElementById(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

function newChallenge(){
	alert("nouveau challenge")
}
</script>
