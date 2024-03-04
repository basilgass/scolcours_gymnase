<script setup lang="ts">

import { computed, ref, unref } from "vue"
import { useKeyboard } from "@/Composables/useKeyboard"
import CodeArea from "@/Components/Ui/CodeArea.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })
const kbrdCode = ref("")

const kbrds = computed(() => {
		return useKeyboard().getKeyboards(unref(kbrdCode))
	}),
	kbrdId = ref(0),
	kbrdFormat = computed(()=>{
		if(kbrds.value===null) { return "format non reconnu"}

		if(kbrds.value[kbrdId.value]===undefined){
			return "ce clavier n'existe pas..."
		}

		return kbrds.value[kbrdId.value].checker.format

	}),
	kbrdsJson = computed(()=>{
		return JSON.stringify(kbrds.value, null, "\t")
	})
</script>
<template>
	<!-- Title -->
	<div ref="root">
		<form-maker
			type="textarea"
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

