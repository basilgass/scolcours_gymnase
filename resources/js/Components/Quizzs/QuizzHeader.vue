<script setup>

import {computed} from "vue"

const props = defineProps({
	quizzSession: {type: Object, required: true},
})

let gaugeValue = computed(()=>{
	return (props.quizzSession.index-1)/props.quizzSession.total*100
})
</script>

<template>
	<div
		class="text-lg lg:text-xl
		bg-black text-white
		w-full px-3 mb-10 min-h-[3em] py-3 space-y-3 sm:space-y-0
		flex flex-col sm:flex-row justify-between items-center"
	>
		<h2
			v-katex.auto="props.quizzSession.quizz.title"
			class="text-white"
		/>

		<div class="flex gap-3 h-full w-full sm:w-64 items-center">
			<div class="h-4 relative flex-1">
				<div
					:style="`width: ${gaugeValue}%`"
					class="bg-slate-400 h-full rounded-full absolute left-0 t-0 transition-all"
				/>
				<div
					class="border border-slate-200 w-full h-full rounded-full absolute left-0 t-0"
				/>
			</div>
			<div class="text-xs text-gray-100">
				{{ props.quizzSession.index }} sur {{ props.quizzSession.total }}
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
