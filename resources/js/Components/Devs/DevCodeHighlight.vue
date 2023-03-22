<template>
	<div>
		<form-codearea
			v-model="code"
			name="test"
			label="éditeur de script"
			focus
			language="latex"
			wrap
		/>
	</div>
</template>
<script setup>

import FormCodearea from "@/Components/Form/FormCodearea.vue"
import {ref} from "vue"

let code = ref("a='Hello world'")
</script>
