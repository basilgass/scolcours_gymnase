<!--
Interface pour les "flash message"
A utiliser en conjonction avec
const flash = inject('flash')
-->
<script
	lang="ts"
	setup
>
import {computed} from "vue"
import {flashMessageInterface} from "@/types"

const emits = defineEmits<{
	close: [message: flashMessageInterface]
}>()

const props = defineProps<{
	message: flashMessageInterface
}>()

function closeFlashMessage() {
	emits("close", props.message)
}

const link = computed(() => props.message.config.link)
</script>

<template>
	<div
		class="rounded-sm px-10 py-5 flex flex-col gap-6 relative"
		v-bind="$attrs"
	>
		<!--title to display if any-->
		<div v-if="message.config.title">
			{{ message.config.title }}
		</div>
		<!-- Message to display -->
		<div v-katex.auto="message.message" />

		<!-- add link if there is one -->
		<div
			v-if="link"
			class="flex gap-4 hover:underline"
		>
			<i class="bi bi-link" />
			<a
				v-if="link.external"
				:href="link.url"
				@click="closeFlashMessage"
			>
				{{ link.url }}
			</a>
			<InertiaLink
				v-else
				:href="link.url"
				@click="closeFlashMessage"
			>
				{{ link.label }}
			</InertiaLink>
		</div>

		<!-- close button -->
		<button
			class="absolute right-1 top-0"
			@click="closeFlashMessage"
		>
			<i class="bi bi-x-lg text-xl hover:rotate-180" />
		</button>
	</div>
</template>
