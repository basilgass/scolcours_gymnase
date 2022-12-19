<template>
	<div
		v-if="isCorrect.result"
		class="flex flex-col mt-2"
	>
		<div class="my-3 text-green-500 flex">
			<i class="bi bi-check mr-4" />
			<p>Vous avez déjà répondu à cette question {{ isCorrect.when }}</p>
		</div>
		<div class="flex ">
			<button
				class="cursor-pointer flex items-center gap-5"
				@click="showAnswer=!showAnswer"
			>
				<div>Réponse</div>
				<i
					v-if="!showAnswer"
					class="bi bi-eye"
				/>
				<div
					v-else
					v-katex.display.left.nomargin="questionAnswerDisplay"
				/>
			</button>
		</div>
	</div>
	<div v-else>
		<!-- Afficher les réponses précédentes -->
		<div
			v-show="previousAnswers.length>0"
			class="text-xs mt-4 border-t pt-1"
		>
			<div
				class="flex justify-between cursor-pointer"
				@click="showPreviousAnswer=!showPreviousAnswer"
			>
				<div class="flex gap-2 hover:font-semibold">
					<div>{{ labelAnswer }}</div>
					<div
						:class="showPreviousAnswer?'rotate-90':''"
						class="transition-transform"
					>
						<i class="bi bi-chevron-right " />
					</div>
				</div>
				<Link
					v-if="!$page.props.auth.user"
					:href="route('login')"
				>
					( se connecter pour mémoriser )
				</Link>
			</div>
			<ul
				v-show="showPreviousAnswer"
				class="flex flex-wrap gap-5"
			>
				<li
					v-for="answer of previousAnswers"
					:key="answer.when"
					:class="{
						'text-green-600 font-bold':answer.result,
						'text-red-600':!answer.result,
					}"
				>
					{{ answer.answer }}
				</li>
			</ul>
		</div>

		<!-- Admin helper -->
		<div
			v-if="$page.props.auth.can.admin && editMode"
			class="text-xs text-gray-600 flex justify-between mt-6 admin-wrapper"
		>
			<div>Résultat attendu</div>
			<div>{{ theQuestion.answer }}</div>
		</div>
	</div>
</template>
<script setup>

import {computed, inject, reactive, ref} from "vue"
import {keyboards} from "@/keyboards"

let emits = defineEmits(["update:question"])
let props = defineProps({
	question: {type: Object, required: true },
	isCorrect: {type: [Object, Boolean], required: true}
})

let editMode = inject("editpost", false),
	theQuestion = reactive(props.question)

let showAnswer = ref(false),
	showPreviousAnswer = ref(false),
	labelAnswer = computed(()=>{
		return previousAnswers.value.length === 1 ? "voir la réponse précédente" : `voir les ${previousAnswers.value.length} réponses précédentes`
	})


let previousAnswers = computed(() => {
		if(!theQuestion){return []}
		if(!theQuestion.userAnswers){return []}

		return theQuestion.userAnswers?.length === 0 ? [] : theQuestion.userAnswers
	}),
	questionAnswerDisplay = computed(() => {
		if (theQuestion.keyboard) {
			const kbrd = keyboards[theQuestion.keyboard]

			if (kbrd) {
				return kbrd.tex(theQuestion.answer)
			}
		}

		return props.question.answer
	})

</script>
