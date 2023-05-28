<template>
	<div class="max-w-xl mx-auto keyboard">
		<button
			class="key-cmd bg-white w-full
				border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800"
			:disabled="disabled"
			:class="disabled?'cursor-not-allowed':''"
			@click="buttonClick"
		>
			<p v-if="!disabled">
				<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
			</p>
			<p v-else>
				Envoi de la réponse...
			</p>
		</button>
	</div>
</template>
<script setup>
const emits = defineEmits(["validate"])

const props = defineProps({
	disabled: {type: Boolean, default: false}
})

let buttonClick = function (event){
	if(!props.disabled) {
		emits("validate", event)
	}
}
</script>
