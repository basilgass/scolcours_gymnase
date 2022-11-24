<template>
	<section class="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
		<Panel class="md:col-span-3 pb-3">
			<template #title>
				Table des matières
			</template>
			<ChapterToc />
		</Panel>

		<div class="md:col-span-3">
			<h3
				class="text-xl border-b mb-3 inline-block px-1"
				:class="`border-scolcours-${$page.props.theme.slug}`"
			>
				Challenges
			</h3>
			<div
				v-if="props.chapter.challenges.length>0 || editMode"
				class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1 lg:gap-3"
			>
				<Link
					v-for="challenge in props.chapter.challenges"
					:key="`challenge-${challenge.id}`"
					class="min-h-[100px] w-full h-full"
					:class="`btn-scolcours-${$page.props.theme.slug}`"
					as="button"
					:href="route('chapters.challenge', [$page.props.theme.slug, props.chapter.slug, challenge.slug])"
				>
					{{ challenge.title }}
				</Link>

				<div
					v-if="$page.props.auth.can.admin && editMode"
					class="min-h-[100px] grid place-items-center"
				>
					<button
						class="btn w-full h-full border-2 border-blue-600 border-dashed text-blue-900 bg-blue-100 hover:bg-blue-200"
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
			</div>
		</div>

		<div
			v-if="$page.props.auth.user"
			class="grid grid-cols-2 md:grid-cols-4 md:col-span-3 gap-3 min-h-[10em]"
		>
			<Panel class="grid grid-cols-1 place-items-center text-center">
				<div class="flex flex-col gap-5">
					<div class="text-lg text-gray-300 uppercase">
						exercices
					</div>
					<div class="text-4xl font-code">
						{{ chapterExercises.length }}
					</div>
				</div>
			</Panel>
			<Panel class="grid grid-cols-1 place-items-center text-center">
				<div class="flex flex-col gap-5">
					<div class="text-lg text-gray-300 uppercase">
						questions
					</div>
					<div class="text-4xl font-code">
						{{ chapterQuestions.answered }}/{{ chapterQuestions.questions }}
					</div>
				</div>
			</Panel>
			<Panel class="grid grid-cols-1 place-items-center text-center">
				<!--				<div class="flex flex-col gap-5">-->
				<!--					<div class="text-lg text-gray-300 uppercase">-->
				<!--						questions-->
				<!--					</div>-->
				<!--					<div class="text-4xl font-code">-->
				<!--						{{ chapterQuestions.answered }}/{{ chapterQuestions.questions }}-->
				<!--					</div>-->
				<!--				</div>-->
			</Panel>
			<Panel class="grid grid-cols-1 place-items-center text-center">
				<!--				<div class="flex flex-col gap-5">-->
				<!--					<div class="text-lg text-gray-300 uppercase">-->
				<!--						questions-->
				<!--					</div>-->
				<!--					<div class="text-4xl font-code">-->
				<!--						{{ chapterQuestions.answered }}/{{ chapterQuestions.questions }}-->
				<!--					</div>-->
				<!--				</div>-->
			</Panel>
		</div>

		<Panel
			v-if="$page.props.auth.user && 1===0"
		>
			<template #title>
				Exercices
			</template>

			<div class="space-y-5 justify-between">
				<div>{{ chapterExercises.length }} exercices</div>

				<button
					class="py-2 w-full btn-xs"
					:class="showExercises?'btn-success':'btn'"
					@click="$emit('update:showExercises', !showExercises)"
				>
					N'afficher que les exercices
				</button>

				<button
					class="py-2 w-full btn-xs"
					:class="hideResolvedQuestions?'btn-warning':'btn'"
					@click="$emit('update:hideResolvedQuestions', !hideResolvedQuestions)"
				>
					Cacher les questions répondues
				</button>

				<button
					class="py-2 w-full btn btn-xs"
					@click="menuScrollToClass('unanswered')"
				>
					<i class="bi bi-journal-arrow-down mr-2" /> Prochaine question
				</button>

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
	</section>
</template>

<script setup>
import {computed, inject, ref} from "vue"
import Panel from "@/Components/Ui/Panel.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormButton from "@/Components/Form/FormButton.vue"
import {useForm} from "@inertiajs/inertia-vue3"
import {menuScrollToClass} from "@/Composables/useHelpers"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import Button from "@/Components/Auth/Button.vue"

let props = defineProps({
	chapter: {type: Object, required: true},
	showExercises: {type: Boolean, required: true},
	hideResolvedQuestions: {type: Boolean, require: true}
})

let emits = defineEmits(["update:showExercises", "update:hideResolvedQuestions"])

let editMode = inject("editmode"),
	showCreateChallenge = ref(false),
	newChallengeForm = useForm({
		"title": "challenge"
	})

function createNewChallenge() {
	newChallengeForm.post(route("chapters.challenges.store", [props.chapter.slug]))
}

let chapterPosts = inject("chapterPosts"),
	chapterToc = computed(() => chapterPosts.value), // .filter(post => !post.type)
	chapterExercises = computed(() => chapterPosts.value.filter(post => post.questions.length > 0)),
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



function newChallenge(){
	alert("nouveau challenge")
}
</script>
