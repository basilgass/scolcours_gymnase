<template>
	<button :class="buttonClass"
			class="btn"
			@click="btnClick">
		<span v-show="!confirmClick"><slot/></span>
		<span v-show="confirmClick" v-text="props.confirmText"/>
	</button>
</template>

<script setup>
import {computed, ref} from "vue";

let props = defineProps({
	btnClass: {type: String, default: 'btn-success'},
	confirmClass: {type: String, default: 'btn-warning'},
	confirmText: {type: String, default: 'vraiment ?'},
	xs: {type: Boolean, default: false}
})
let emits = defineEmits(['confirm'])

let confirmClick = ref(false),
	buttonClass = computed(() => {
		let cl = props.xs ? 'btn-xs ' : ''
		return cl + (confirmClick.value ? props.confirmClass : props.btnClass)
	}),
	btnClick = function () {
		if (!confirmClick.value) {
			confirmClick.value = true
			setTimeout(() => {
				confirmClick.value = false
			}, 2000)
		} else {
			emits('confirm')
		}
	}
</script>
