<!--
Interface pour les "flash message"
A utiliser en conjonction avec
const flash = inject('flash')
-->
<script
	lang="ts"
	setup
>
import {onMounted, ref} from "vue"

const emits = defineEmits(["open", "close"])
const props = withDefaults(defineProps<{
		message: string
		timeout?: number
		link?: {
			label: string,
			url: string,
			external?: boolean,
		},
		tex?: boolean
	}>()
	, {
		timeout: 1000 * 5,
		link: null,
		tex: false
	})

const show = ref(true)

let timeoutId: number

function closeFlashMessage() {
	show.value = false
	emits("close", timeoutId)
}


onMounted(() => {
	timeoutId = setTimeout(() => closeFlashMessage(), props.timeout)
	emits("open", timeoutId)
})
</script>

<template>
	<transition name="flash-message">
		<div
			v-if="show"
			class="rounded-sm px-10 py-5 flex flex-col gap-6 relative"
			v-bind="$attrs"
		>
			<!-- Message to display -->
			<div v-katex.auto="message" />

			<!-- add link if there is one -->
			<div
				v-if="props.link"
				class="flex gap-4 hover:underline"
			>
				<i class="bi bi-link" />
				<a
					v-if="props.link.external"
					:href="props.link.url"
					@click="closeFlashMessage"
				>
					{{ props.link.url }}
				</a>
				<InertiaLink
					v-else
					:href="props.link.url"
					@click="closeFlashMessage"
				>
					{{ props.link.label }}
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
	</transition>
</template>
