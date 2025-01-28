<script setup lang="ts">
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import {onMounted, ref} from "vue"
import {useGenerator} from "@/Composables/useGenerator.ts"

const props = withDefaults(
	defineProps<{
		generator: GeneratorInterface,
		generateOnMounted?: boolean,
		questionsNumber?: number
	}>(),
	{
		generateOnMounted: false,
		questionsNumber: 3
	}
)

const generatedErrors = ref('')
const generatedQuestions = ref([])

const emits = defineEmits<{
	generatedStatus: [value: boolean]
}>()

function generateQuestions() {
	if (props.generator.code === '') {
		return []
	}

	generatedQuestions.value = []

	try {
		const gen = useGenerator(props.generator)
		for (let i = 0; i < props.questionsNumber; i++) {
			generatedQuestions.value.push(
				gen.question()
			)
		}

		generatedErrors.value = ''
		emits('generatedStatus', true)
	} catch (err) {
		generatedErrors.value = err
		emits('generatedStatus', false)
	}
}

onMounted(() => {
	if (props.generateOnMounted) {
		generateQuestions()
	}
})

</script>

<template>
	<article>
		<div class="flex justify-between">
			<h3>Exemples</h3>
			<button
				class="btn-xs"
				@click="generateQuestions()"
			>
				générer
			</button>
		</div>
		<div
			v-if="generatedQuestions.length > 0"
			class="font-code flex flex-col gap-3"
		>
			<div
				v-for="(question, idx) of generatedQuestions"
				:key="`question-${idx}`"
				class="border rounded shadow bg-white px-2 flex justify-between items-baseline py-2"
			>
				<div v-katex.auto="question.block.body.replaceAll('$a','\\ ?')" />
				<div
					class="text-xs"
					v-text="question.answer"
				/>
			</div>
		</div>
		<div
			v-if="generatedErrors"
			class="text-red-700 text-xs"
		>
			{{ generatedErrors }}
		</div>
	</article>
</template>

<style scoped>

</style>
