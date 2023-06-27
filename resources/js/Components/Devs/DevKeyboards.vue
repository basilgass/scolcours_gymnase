<template>
	<!-- Title -->
	<div ref="root">
		<form-textarea
			v-model="kbrdCode"
			name="keyboard"
			label="claviers"
			:row="20"
		/>

		<div>
			{{ kbrds }}
		</div>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import {computed, ref} from "vue"
import {useKeyboard} from "@/Composables/useKeyboard"
import FormTextarea from "@/Components/Form/FormTextarea.vue"

let kbrdCode = ref("")

let kbrds = computed(()=>{
	return useKeyboard().getKeyboards(kbrdCode)
})
</script>

