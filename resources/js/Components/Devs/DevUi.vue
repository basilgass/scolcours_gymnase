<script lang="ts" setup>
import UiSlider from "@/Components/Ui/UiSlider.vue"
import {ref} from "vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"

let value = ref(15),
    vmin = ref(10),
    vmax = ref(40),
    ta = ref(""),
    crtLine = ref("")


// let chk = new ExampleChecker(['trois', 'quatre', 'cinq'])
// console.log(chk.name)
// console.log(chk.description)
// console.log(chk.format)


function updateCrtLine(evt) {
    crtLine.value = evt
}

</script>

<template>
	<form-number
			v-model="vmin"
			name="vmin"
	/>
	<form-number
			v-model="vmax"
			name="vmin"
	/>
	<div>
		<ui-slider
				v-model="value"
				:max="vmax"
				:min="vmin"
		/>
	</div>

	<div>FROM UI COMPONENT: {{ value }}</div>

	<form-textarea
			v-model="ta"
			label="test avec ligne courant"
			name="test"
			@current-line="updateCrtLine"
	/>
	<div
			v-theme.border="'arithmetique'"
			class="border"
	>
		{{ crtLine }}
	</div>

	<div class="bg-white p-10">

		<FormKit
				label="Hello world"
				suffix-icon="avatarMan"
				suffix-icon-class="!p-0"
				type="text"
		/>

		<FormKit
				label="small text"
				prefix-icon="avatarMan"
				sm
				type="text"
		/>

		<FormKit
				label="small variant"
				sm
				type="text"
		/>

	</div>
</template>
