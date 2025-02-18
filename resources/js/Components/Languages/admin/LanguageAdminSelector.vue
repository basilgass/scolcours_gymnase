<script setup lang="ts">

defineProps<{
	languages: string[]
}>()

const language = defineModel<string>()

</script>

<template>
	<article class="flex gap-3">
		<button
			v-for="lang in languages"
			:key="lang"
			class="btn hover:shadow-sm"
			:class="{
				'bg-white': language!==lang,
				'is-active': language===lang
			}"
			@click="language=lang"
		>
			{{ lang }}
		</button>
	</article>
</template>
