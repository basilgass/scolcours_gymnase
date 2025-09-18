<script setup lang="ts">

import {QuizzSessionInterface} from "@/types/modelInterfaces.ts"

const props = defineProps<{
	quizzSession: QuizzSessionInterface
}>()
</script>

<template>
	<div
		class="text-lg lg:text-xl
		bg-black text-white
		w-full px-3 mb-10 min-h-[3em] py-3 space-y-3 sm:space-y-0
		fixed z-20
		flex flex-col sm:flex-row justify-between items-center"
	>
		<h2
			v-katex.auto="props.quizzSession.quizz.title"
			class="text-white"
		/>

		<div>
			{{ props.quizzSession.current }} sur {{ props.quizzSession.total }}
		</div>
	</div>
</template>


