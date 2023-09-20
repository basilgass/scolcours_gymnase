<template>
	<article class="grid place-items-center min-h-screen text-lg lg:text-xl">
		<quizz-icon-wait />
	</article>
</template>

<script setup>

import QuizzIconWait from "@/Components/Quizzs/QuizzIconWait.vue"

let props = defineProps({
	quizz: {type: Object, required: true}
})
</script>
