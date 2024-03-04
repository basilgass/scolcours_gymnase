<script lang="ts" setup>
	import { computed, onMounted, PropType, ref } from "vue"
	import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
	import { useGenerator } from "@/Composables/useGenerator"
	import {
		ChallengeInterface,
		GeneratorInterface,
	} from "@/types/modelInterfaces"

	const props = defineProps({
		challenge: {
			type: Object as PropType<ChallengeInterface>,
			required: true,
		},
		slug: { type: String, required: true },
	})

	const currentGenerator = computed<GeneratorInterface>(() => {
			return props.challenge.generators.filter(
				(g) => g.slug === props.slug,
			)[0]
		}),
		counter = ref(0)

	const nextQuestion = function (checkerResult) {
			if (checkerResult.result) {
				counter.value++
			}
		},
		theQuestion = computed(() => {
			if (counter.value >= 0) {
				return useGenerator(currentGenerator).question()
			}
			return false
		})

	onMounted(() => {
		counter.value++
	})
</script>

<template>
	<div v-if="theQuestion">
		<question-show
			:key="`question-${counter}`"
			:question="theQuestion"
			class="max-w-[40em] mx-auto min-h-[500px] border border-gray-400"
			dynamic
			show-input
			@validate="nextQuestion"
		/>
	</div>
</template>

<style scoped></style>
