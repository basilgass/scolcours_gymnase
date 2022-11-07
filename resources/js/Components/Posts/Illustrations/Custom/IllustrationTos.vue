<template>
	<pi-table-of-signs :tos="tos" />
</template>

<script setup>

import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"

let props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)

let tos = computed(()=>{
	let [num, den] = code.value.split("/"),
		p = new PiMath.Rational(num, den),
		study = p.study()

	return study.makeSigns()
})
</script>
