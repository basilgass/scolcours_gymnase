<template>
	<div class="space-y-2">
		<div
				v-for="quizz in quizzes"
				:key="quizz"
			>
			<a
					class="hover:underline"
					:href="`/quizz/${quizz}`"
				>{{ quizz }}</a>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		quizzes: Array
	})
</script>

