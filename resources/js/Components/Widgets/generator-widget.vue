<script setup lang="ts">

import type {GeneratorInterface, QuestionInterface, WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {computed, onMounted, ref} from "vue"
import {useGenerator} from "@/Composables/useGenerator.ts"
import axios from "axios"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const generator = ref<GeneratorInterface | false>(false)
const counter = ref(0)

const theQuestion = computed(() => {
	if (!generator.value) {
		return false
	}

	if (counter.value >= 0) {
		return useGenerator(generator.value).question()
	}

	return false
})

function nextQuestion(checkerResult: questionResultInterface): void {
	if (checkerResult.result) {
		setTimeout(() => {
			counter.value++
		}, 500)

	}

}


onMounted(() => {
	if (+props.illustration.parameters > 0) {
		axios.get(route('api.admin.generators.fetch', [props.illustration.parameters]))
			.then(res => {
				generator.value = res.data
			})
			.catch(err => console.error(err))
	}
})

</script>

<template>
	<question-show
		v-if="generator!==false"
		:key="`question-${counter}`"
		:question="theQuestion as QuestionInterface"
		class="max-w-[40em] mx-auto min-h-[500px] border border-gray-400"
		is-dynamic
		show-input
		@validate="nextQuestion"
	/>
</template>


