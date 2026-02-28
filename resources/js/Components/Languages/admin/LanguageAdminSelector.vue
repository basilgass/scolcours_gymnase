<script setup lang="ts">

import ScButton from "@/Components/Ui/Button/scButton.vue"

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
			type="admin"
			:outline="language!==lang"
			@click="language=lang"
		>
			{{ lang }}
		</sc-button>
	</article>
</template>
