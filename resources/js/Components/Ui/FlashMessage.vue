<!--
Interface pour les "flash message"
A utiliser en conjonction avec
const flash = inject('flash')
-->
<template>
	<transition name="flash-message">
		<div
			v-if="show"
			class="rounded px-10 py-5 flex flex-col gap-6 relative"
			v-bind="$attrs"
		>
			<button
				class="absolute r-0 t-0 p-1"
				@click="closeFlashMessage"
			>
				<i class="bi bi-x-lg" />
			</button>

			<slot />

			<div
				v-if="props.link"
				class="flex gap-4 hover:underline"
			>
				<i class="bi bi-link" />
				<Link
					:href="props.link.url"
					@click="closeFlashMessage"
				>
					{{ props.link.label }}
				</Link>
			</div>
		</div>
	</transition>
</template>

<script setup>

import {onMounted, ref} from "vue"

const emits = defineEmits(["open", "close"])

const props = defineProps({
	timeout: {type: Number, default: 1000*60},
	link: {type: Object, default: ()=>{}}
})

let show = ref(true),
	closeFlashMessage = function(){
		show.value = false
		emits("close", timeoutId)
	},
	timeoutId
onMounted(()=>{
	timeoutId = setTimeout(() => closeFlashMessage(), props.timeout)
	emits("open", timeoutId)
})
</script>
