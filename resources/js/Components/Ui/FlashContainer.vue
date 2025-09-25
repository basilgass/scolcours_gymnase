<script setup lang="ts">

import FlashMessage from "@/Components/Ui/FlashMessage.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const flash = useStoreFlashMessage()

</script>

<template>
	<div
		v-if="flash.messages.length"
		class="fixed bottom-2 right-2 grid grid-cols-1 gap-3 max-w-[20em]"
	>
		<flash-message
			v-for="(message, idx) in flash.messages"
			:key="`flash-${idx}`"
			:class="{
				'bg-red-600/80 text-white': message.type === 'error',
				'bg-green-600/80 text-white': message.type === 'success',
				'bg-amber-400/80 text-black': message.type === 'info',
				'bg-white text-black': message.type === undefined,
			}"
			:link="message.config?.link"
			:timeout="message.config.timeout"
			@close=" flash.messages = flash.messages.filter((x) => x.id !== $event)"
			@open="message.id = $event"
			:message="message.message"
		/>
	</div>
</template>

<style scoped>

</style>
