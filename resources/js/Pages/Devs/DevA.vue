<template>
	<!-- Title -->
	<div ref="root">
		<form-input
			v-model="circle"
			label="Cercle"
			name="circle"
			@keyup.enter="test=''+circle"
		/>
		<div>
			<function-study :fx="test" />
		</div>
	</div>
</template>
<script setup>
import {computed, onUpdated, ref} from "vue"
import FormInput from "@/Components/Form/FormInput"
import FunctionStudy from "@/Components/Tools/etude-de-signe"

let root = ref(null),
	circle = ref("(x-5)(x+2)/(x-7)"),
	myParams = ref(false),
	test = ref("(x-5)(x+2)/(x-7)")

let mydata = computed(()=>{
	return circle.value.split("")
})

onUpdated(()=>{

})
</script>

