<!--
Interface pour les "flash message"
A utiliser en conjonction avec
const flash = inject('flash')
-->
<template>
	<transition name="flash-message">
		<div
			v-if="show"
			class="rounded px-10 py-5"
			v-bind="$attrs"
			@click="closeFlashMessage"
		>
			<slot />
		</div>
	</transition>
</template>

<script setup>

import {onMounted, ref} from "vue"

const emits = defineEmits(["open", "close"])

const props = defineProps({
	timeout: {type: Number, default: 1000*60}
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
