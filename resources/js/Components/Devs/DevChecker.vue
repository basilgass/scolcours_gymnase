<template>
	<!-- Title -->
	<div ref="root">
		<div class="grid grid-cols-1 gap-3">
			<form-textarea
				v-model="code"
				label="code"
				name="code"
			/>
			<div class="font-code">
				checker@options<br>
				expected answer<br>
				given answer
			</div>

			<div
				class="border-b py-3"
				v-text="format"
			/>
			<div v-text="`réponse: ${check.result}`" />
			<div v-text="check.message" />
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
import {computed, onMounted, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {PiMath} from "pimath/esm"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import {useCheckers} from "@/Composables/useCheckers"

let root = ref(null),
	code = ref("rational@r\nx-1/x^2\nx^2-x/x^3")


const format = computed(()=>{
	let data = code.value.split("\n")
	return useCheckers(data[0]).format()
})
const check = computed(()=>{
	let data = code.value.split("\n")
	if(data.length!==3){return "code à revoir..."}

	let checker = useCheckers(data.shift())
	return checker.check(...data)

	// try {
	// 	let checker = useCheckers(data.shift())
	// 	return checker.check(...data)
	// }catch(e){
	// 	return e
	// }

})
</script>

