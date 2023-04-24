<template>
	<article class="grid place-items-center min-h-screen text-lg lg:text-xl">
		<icon-wait />
	</article>
</template>

<script setup>

import IconWait from "@/Components/Ui/IconWait.vue"

let props = defineProps({
	quizz: {type: Object, required: true}
})
</script>
