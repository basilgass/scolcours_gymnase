<template>
	<div>
		<h3
			v-katex.auto="step.title"
			class="font-semibold"
		/>
		<markdown-it :text="step.body" />
		<div class="flex justify-between">
			<button
				v-theme.btn
				:class="stepIndex===0?'invisible':''"
				@click="stepIndex--"
			>
				<i class="bi bi-chevron-left mr-3 -ml-2" />précédant
			</button>

			<button
				v-theme.btn
				:class="stepIndex===steps.length-1?'invisible':''"
				@click="stepIndex++"
			>
				<span v-katex.auto="nextStep?.title" />
				<i class="bi bi-chevron-right ml-3 -mr-2" />
			</button>
		</div>
	</div>
</template>
<info>
parameters: ???

code: texte séparé par %STEP
</info>


<script setup>
import {computed, ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

let props = defineProps({
	illustration: {type: Object, required: true}
})

// code are the various steps.
/*
%STEP
@keyboard
   Qcm
   keyboard parameters
the question as markdown with math katex enabled
*/

let steps = computed(() => {
		let stepsResult = []

		const codeSteps = props.illustration.code.split(/%STEP/).filter(s => s !== "")
		codeSteps.forEach((body, index) => {
			let title = ""
			body = body.trim()
			if (body.startsWith(":")) {
				// Il y a un titre
				let lines = body.split("\n")
				title = lines.shift().substring(1).trim()
				body = lines.join("\n")
			} else {
				title = `étape ${index} sur ${codeSteps.length}`
			}

			stepsResult.push({
				title,
				body
			})
		})

		return stepsResult
	}),
	stepIndex = ref(0),
	step = computed(() => {
		return steps.value[stepIndex.value]
	}),
	prevStep = computed(()=>{
		if(stepIndex.value === 0){return null}
		return steps.value[stepIndex.value-1]
	}),
	nextStep = computed(()=>{
		if(stepIndex.value === step.value.length-1){return null}
		return steps.value[stepIndex.value+1]
	})
</script>
