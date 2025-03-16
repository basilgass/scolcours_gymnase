<script setup lang="ts">

import ScButton from "@/Components/Ui/scButton.vue"

defineProps<{
	languages: string[]
}>()

const language = defineModel<string>()

</script>

<template>
	<article class="flex gap-3">
		<sc-button
			v-for="lang in languages"
			:key="lang"
			:outline="language!==lang"
			@click="language=lang"
		>
			{{ lang }}
		</sc-button>
	</article>
</template>
