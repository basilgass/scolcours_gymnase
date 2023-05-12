<template>
	<section>
		<h1 class="text-2xl">
			Quizz
		</h1>

		<div class="h-[80vh] w-full grid place-items-center">
			<div v-if="props.shortcode">
				IL Y A UN SHORTCUT {{ props.shortcode }}
			</div>
			<div v-else>
				Dommage, vous n'êtes pour l'instant pas invité à un quizz.
			</div>
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
let props = defineProps({
	shortcode: { type: String, required: true },
})
</script>
