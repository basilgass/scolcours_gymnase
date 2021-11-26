<template>
	<component :is="quizzComponent" />
</template>

<script setup>
	import { computed, defineAsyncComponent } from "vue"

	const props = defineProps({
		"quizz": String,
		"theme": Object
	})

	const quizzComponent = computed(
		()=> defineAsyncComponent(
			() => import(`@/Components/Quizz/${props.quizz}`)
		)
	)

</script>
