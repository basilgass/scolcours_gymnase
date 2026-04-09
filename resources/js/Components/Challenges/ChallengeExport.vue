<script lang="ts" setup>
import FormInput from "@/Components/Form/FormInput.vue"
import {asciiToTex} from "@/Composables/keyboardConfig"
import {useGenerator} from "@/Composables/useGenerator"
import {generatedQuestionInterface} from "@/types"
import {ChallengeInterface} from "@/types/modelInterfaces"
import {usePage} from "@inertiajs/vue3"
import {computed, PropType, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import Card from "@/Components/Ui/Card.vue"
import {usePdf} from "@/Composables/useDownloadPdf.ts"

/**
 * This component is used to generate a PDF from a challenge
 * REFACTOR: reformat ChallengeExport.vue
 */

const props = defineProps({
	challenge: {
		type: Object as PropType<ChallengeInterface>,
		required: true
	}
})

const allGenerators = computed(() => props.challenge.levels.flatMap(level => level.generators))
const pdfGeneratorNb = ref<number[]>(Array(allGenerators.value.length).fill(10))
const pdfQuestionWrapper = ref("\\( @ \\)")
const pdfError = ref("")
const pdfLaTeX = ref("")

const MAX_QUESTIONS_PER_GENERATOR = 30
const pdfGenereate = () => {
	let questions: generatedQuestionInterface[] = []

	const maxQuestions = pdfGeneratorNb.value.map(nb => Math.min(nb, MAX_QUESTIONS_PER_GENERATOR))

	maxQuestions.forEach((nb, index) => {
		for (let i = 0; i < nb; i++) {
			questions.push(
				useGenerator(allGenerators.value[index]).random()
			)
		}
	})

	if (pdfQuestionWrapper.value !== "") {
		questions = questions.map((q) => {
			console.log(q.answer)
			// Wrap the question in a custom wrapper
			q.question = pdfQuestionWrapper.value.replace("@", q.question)

			// Convert asciimath to latex
			q.answer = asciiToTex(q.answer.toString())
			return q
		})
	}

	pdfError.value = ""
	pdfLaTeX.value = ""

	usePdf().download({
		template: "latex.questions",
		title: props.challenge.title,
		slug: props.challenge.slug,
		theme: usePage().props.theme ? usePage().props.theme.slug : "divers",
		questions
	})
}
</script>

<template>
	<div
		class="border-content border-t"
	>
		<sc-button
			class="mx-auto my-10"
			theme
			xl
			@click="pdfGenereate"
		>
			générer un pdf
		</sc-button>

		<Card>
			<template #header>
				configuration
			</template>
			<FormInput
				v-model="pdfQuestionWrapper"
				inline-label
				label="wrapper"
				class="max-w-[300px]"
				sm
			/>
		</Card>
		<h4 class="font-[400] mt-8 mb-4">
			Nombre de questions par générateurs
		</h4>
		<div class="flex gap-3">
			<Card
				v-for="(gen, index) of allGenerators"
				:key="`pdf-${gen.slug}`"
				class="overflow-hidden"
			>
				<FormInput
					v-model="pdfGeneratorNb[index]"
					class="max-w-[150px]"
					type="number"
					:max="MAX_QUESTIONS_PER_GENERATOR"
					:min="0"
					with-icon
					:label="gen.title"
				/>
			</Card>
		</div>
		<div
			v-if="pdfLaTeX"
			class="my-10"
		>
			<tex-code :tex="pdfLaTeX" />
		</div>
		<div
			v-if="pdfError"
			class="my-10"
		>
			<h3 class="text-red-600 mb-3">
				Erreur lors de la génération du code LaTeX.
			</h3>
			<pre
				class="bg-red-100 overflow-y-auto overflow-x-auto max-h-screen"
				v-text="pdfError"
			/>
		</div>
	</div>
</template>
