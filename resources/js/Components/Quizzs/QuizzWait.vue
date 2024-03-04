<script setup lang="ts">

import QuizzIconWait from "@/Components/Quizzs/QuizzIconWait.vue"

defineProps({
	quizz: {type: Object, required: true}
})
</script>

<template>
	<article class="grid place-items-center min-h-screen text-lg lg:text-xl">
		<quizz-icon-wait />
	</article>
</template>
