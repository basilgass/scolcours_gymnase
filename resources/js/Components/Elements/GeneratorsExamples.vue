<script lang="ts" setup>
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import {onMounted, ref} from "vue"
import {useGenerator} from "@/Composables/useGenerator.ts"
import ScButton from "@/Components/Ui/scButton.vue"

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
	generatorHasErrors: [value: boolean]
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
		emits('generatorHasErrors', false)
	} catch (err) {
		generatedErrors.value = err
		emits('generatorHasErrors', true)
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
		<div class="flex justify-between mb-3">
			<h3>Exemples</h3>
			<sc-button
				icon
				type="generate"
				xs
				@click="generateQuestions()"
			>
				générer
			</sc-button>
		</div>
		<div
			v-if="generatedQuestions.length > 0"
			class="font-code flex flex-col gap-3"
		>
			<div
				v-for="(question, idx) of generatedQuestions"
				:key="`question-${idx}`"
				class="border rounded-sm shadow-sm bg-content px-2 flex justify-between items-baseline py-2"
			>
				<div v-katex.auto="question.block.body.replaceAll(/\$[a-z]/g,'\\ ?')" />
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
