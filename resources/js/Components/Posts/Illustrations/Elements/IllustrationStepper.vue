<template>
	<div>
		STEPPER COMPONENT
	</div>
</template>
<info>
parameters: ???

code: ???
</info>
<script setup>
import {ref} from "vue"

let props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)

// code are the various steps.
/*
STEP
the question as markdown with math katex enabled
@keyboard
#Qcm
keyboard parameters

*/
</script>
