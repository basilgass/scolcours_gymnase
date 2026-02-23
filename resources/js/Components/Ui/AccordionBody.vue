<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue'

const show = defineModel()

const contentRef = ref<HTMLElement | null>(null)
const height = ref('0px')

function updateHeight() {
	if (!contentRef.value) return

	if (show.value) {
		height.value = contentRef.value.scrollHeight + 'px'
		setTimeout(() => {
			height.value = 'auto'
		}, 300)
	} else {
		height.value = contentRef.value.scrollHeight + 'px'

		requestAnimationFrame(() => {
			height.value = '0px'
		})
	}
}

watch(show,
	async () => {
		await nextTick()
		updateHeight()
	})

onMounted(updateHeight)
</script>

<template>
	<div
		class="overflow-hidden transition-all duration-300 ease-in-out"
		:style="{ height }"
	>
		<div ref="contentRef">
			<slot />
		</div>
	</div>
</template>
