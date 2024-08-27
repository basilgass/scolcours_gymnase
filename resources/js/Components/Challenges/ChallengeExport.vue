<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import { asciiToTex } from "@/Composables/keyboardConfig"
import { useGenerator } from "@/Composables/useGenerator"
import { flashInterface, generatedQuestionInterface } from "@/types"
import { ChallengeInterface } from "@/types/modelInterfaces"
import { usePage } from "@inertiajs/vue3"
import { useClipboard } from "@vueuse/core"
import axios from "axios"
import { inject, PropType, ref } from "vue"

/**
 * This component is used to generate a PDF from a challenge
 * Actually, it's only visible for administrators
 * TODO: make PDF generator available for everyone
 * TODO: reformat ChallengeExport.vue
 */

const props = defineProps({
	challenge: {
		type: Object as PropType<ChallengeInterface>,
		required: true
	}
})

const flash = inject<flashInterface>("flash")

const pdfGeneratorNb = ref<number[]>(Array(props.challenge.generators.length).fill(10))
const pdfQuestionWrapper = ref("\\( @ \\)")
const pdfError = ref("")
const pdfLaTeX = ref("")

const { copy, copied } = useClipboard({ source: pdfLaTeX })

const pdfGenereate = () => {
	let questions: generatedQuestionInterface[] = []
	pdfGeneratorNb.value.forEach((nb, index) => {
		for (let i = 0; i < nb; i++) {
			questions.push(
				useGenerator(props.challenge.generators[index]).random()
			)
		}
	})

	if (pdfQuestionWrapper.value !== "") {
		questions = questions.map((q) => {
			// Wrap the question in a custom wrapper
			q.question = pdfQuestionWrapper.value.replace("@", q.question)

			// Convert asciimath to latex
			q.answer = asciiToTex(q.answer)
			return q
		})
	}

	pdfError.value = ""
	pdfLaTeX.value = ""

	// TODO: use the route helper
	axios
		.post(route("latex.pdf"), {
			template: "latex.questions",
			title: props.challenge.title,
			slug: props.challenge.slug,
			theme: usePage().props.theme ? usePage().props.theme.slug : "divers",
			questions: questions
		})
		.then((res) => {
			pdfLaTeX.value = res.data.tex
			flash.success(
				"PDF généré avec succès",
				{
					link: {
						label: "Voir le PDF",
						url: route("latex.download", [res.data.slug]),
						external: true
					},
					timeout: 5000
				}
			)
			document.location.href = route("latex.download", [res.data.slug])
		})
		.catch((err) => {
			pdfError.value = err.response.data.message
		})
}
</script>

<template>
	<div
		v-admin
		class="mt-10 -mx-5 p-5 border-t"
	>
		<div class="flex gap-5 mb-5">
			<h3 class="text-xl font-semibold">
				pdf
			</h3>

			<form-maker
				v-model="pdfQuestionWrapper"
				inline-label
				label="wrapper"
				sm
			/>

			<button
				v-theme.btn
				class="btn btn-xs ml-auto"
				@click="pdfGenereate"
			>
				générer
			</button>
		</div>
		<div class="flex flex-col gap-3">
			<div
				v-for="(gen, index) of props.challenge.generators"
				:key="`pdf-${gen.slug}`"
				class="flex gap-3 items-center"
			>
				<div class="flex gap-3">
					<i class="bi bi-calculator text-xl" />
					<h2
						v-katex.auto="gen.title"
						class="text-lg"
					/>
				</div>

				<form-maker
					v-model="pdfGeneratorNb[index]"
					class="w-[200px]"
					inline-label
					type="number"
					with-icon
				/>
			</div>
		</div>
		<div
			v-if="pdfLaTeX"
			class="my-10"
		>
			<div class="flex justify-between mb-3">
				<h3 class="font-code text-gray-600">
					Code LaTeX
				</h3>
				<button
					v-if="!copied"
					class="btn btn-xs"
					@click="copy(pdfLaTeX)"
				>
					<i class="bi bi-clipboard" /> copier
				</button>
				<div v-else>
					<button
						class="btn btn-xs btn-success"
						disabled
					>
						<i class="bi bi-clipboard-check" /> copié !
					</button>
				</div>
			</div>
			<pre
				class="bg-gray-100 overflow-y-auto overflow-x-auto max-h-screen"
				v-text="pdfLaTeX"
			/>
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

<style scoped></style>
