<template>
	<article
		:class="{'border-4 border-green-600': type==='success'}"
		class="bg-white px-4 py-2 rounded-xl border border-gray-300 transition-all"
	>
		<slot/>
	</article>
</template>

<script setup>
import {defineProps} from "vue";

const props = defineProps({
	type: {type: String, default: ''}
})
</script>
