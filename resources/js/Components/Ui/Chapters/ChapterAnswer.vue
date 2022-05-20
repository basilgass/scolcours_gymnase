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
			class="absolute top-0 h-full left-0 w-full bg-white/30"
		>
			<button
				class="w-full h-full text-3xl hover:scale-125 transition-all duration-300"
				@click="toggleAnswerVisibility()"
			>
				<i class="bi bi-eye" />
			</button>
		</div>
	</div>
</template>
<script setup>

import {ref, watch} from "vue"

const emit = defineEmits(["update:modelValue"])
let props = defineProps({
	modelValue: Boolean,
	forceShow: {type: Boolean, default: false}
})
let show = ref(props.modelValue || props.forceShow)

function toggleAnswerVisibility(){
	show.value = !show.value
	emit("update:modelValue", !props.modelValue)
}

watch(()=>props.modelValue, (value)=>{
	show.value = value
})

</script>
