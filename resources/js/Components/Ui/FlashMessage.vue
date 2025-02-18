<!--
Interface pour les "flash message"
A utiliser en conjonction avec
const flash = inject('flash')
-->
<script
	lang="ts"
	setup
>
import { onMounted, PropType, ref } from "vue"

const emits = defineEmits(["open", "close"])
const props = defineProps({
	message: { type: String, default: "aucun message :(" },
	timeout: { type: Number, default: 1000 * 5 },
	link: {
		type: Object as PropType<{ label: string, external?: boolean, url: string }>, default: () => {
		}
	},
	tex: { type: Boolean, default: false }
})

let show = ref(true),
	closeFlashMessage = function () {
		show.value = false
		emits("close", timeoutId)
	},
	timeoutId


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
