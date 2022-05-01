<template>
	<div class="chapter-answer-wrapper mt-5 relative">
		<div
			class="transition-all"
			:class="show?'':'blur-sm'"
		>
			<slot />
		</div>

		<div
			v-show="!show"
			class="absolute top-0 h-full left-0 w-full grid place-items-center bg-white/50"
		>
			<button
				class="btn bg-cyan-50 hover:bg-cyan-100"
				@click="toggleAnswerVisibility()"
			>
				afficher la réponse<i class="bi bi-eye ml-3" />
			</button>
		</div>
	</div>
</template>
<script setup>

import {ref, watch} from "vue"

const emit = defineEmits(["update:modelValue"])
let props = defineProps({
	modelValue: Boolean,
})
let show = ref(props.modelValue)

function toggleAnswerVisibility(){
	show.value = !show.value
	emit("update:modelValue", !props.modelValue)
}

watch(()=>props.modelValue, (value)=>{
	show.value = value
})

</script>
