<template>
	<h2 class="text-xl font-semibold">
		A savoir
	</h2>
	
	<Link
		class="btn"
		href="/latex"
		method="post"
		:data="questions"
	>
		Download
	</Link>
	
	<div
		v-for="(item,index) in questions"
		:key="'asavoir-'+index"
		class="flex justify-between"
	>
		<div v-katex.left="item.question" />
		<div v-katex.left="item.answer" />
	</div>
</template>

<script setup>
const props = defineProps({
	questions: Array
})
</script>
