<template>
	<!-- Title -->
	<div ref="root">
		<form-textarea
			v-model="kbrdCode"
			:row="20"
			label="claviers"
			name="keyboard"
		/>

		<div
			v-katex.auto="kbrdFormat"
			class="code h-16"
		/>

		<code-area
			:code="kbrdsJson"
			:rows="30"
			language="json"
		/>
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
import CodeArea from "@/Components/Ui/CodeArea.vue"

let kbrdCode = ref("")

let kbrds = computed(() => {
		return useKeyboard().getKeyboards(kbrdCode)
	// return useKeyboard().getKeyboards(kbrdCode)
	}),
	kbrdId = ref(0),
	kbrdFormat = computed(()=>{
		if(kbrds.value===null) { return "format non reconnu"}

		if(kbrds.value[kbrdId.value]===undefined){
			return "ce clavier n'existe pas..."
		}

		return kbrds.value[kbrdId.value].checker.format()

	}),
	kbrdsJson = computed(()=>{
		return JSON.stringify(kbrds.value, null, "\t")
	})
</script>

