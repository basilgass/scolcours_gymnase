<script setup lang="ts">

import {PiDraw} from "pidraw"
import {ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps<{
	draw: PiDraw
}>()
export type AnimationEvent = 'start' | 'pause' | 'resume' | 'stop'

const emits = defineEmits<{
	change: [e: AnimationEvent]
}>()

const currentAnimation = ref<AnimationEvent>('stop')

function animation(trigger: AnimationEvent) {
	if (trigger === 'start') {
		if (currentAnimation.value === 'stop') {
			props.draw.animation.start()
		} else {
			props.draw.animation.resume()
		}
	} else if (trigger === 'pause') {
		props.draw.animation.pause()
	} else if (trigger === 'stop') {
		props.draw.animation.cancel()
	}

	currentAnimation.value = trigger

	emits('change', trigger)
}

</script>

<template>
	<div class="flex mt-1 w-full justify-end">
		<sc-button
			theme
			:outline="currentAnimation==='stop' || currentAnimation==='pause'"
			@click="animation('start')"
			xs
			class="rounded-r-none outline-none border-r-0"
		>
			<i class="bi bi-play-fill" />
		</sc-button>
		<sc-button
			theme
			:outline="currentAnimation!=='pause'"
			@click="animation('pause')"
			xs
			class="rounded-none outline-none border-r-0"
		>
			<i class="bi bi-pause-fill" />
		</sc-button>
		<sc-button
			theme
			:outline="currentAnimation!=='stop'"
			@click="animation('stop')"
			xs
			class="rounded-l-none outline-none"
		>
			<i class="bi bi-stop-fill" />
		</sc-button>
	</div>
</template>

<style scoped>

</style>
