<template>
	<div>
		<draggable
			v-model="sortableItems"
			class="grid grid-cols-1 gap-3 my-5"
			v-bind="{
				animation: 200,
			}"
			item-key="id"
			@update="changeEvent"
		>
			<template #item="{ element }">
				<button
					v-katex.auto="element.label"
					class="btn bg-white"
				/>
			</template>
		</draggable>
	</div>
</template>

<script setup>

import {ref} from "vue"
import {PiMath} from "pimath/esm"
import {useKeyboard} from "@/Composables/useKeyboard"

let props = defineProps({
	options: {type: String},
	answer: {type: String}
})

let emits = defineEmits(["change", "validate"]),
	changeEvent = function () {
		// On compte le nombre de réponses au bon endroit...
		let errors = 0
		for(let i=1; i<=sortableItems.value.length; i++){
			if(sortableItems.value[i-1].id!==i){
				errors++
			}
		}

		emits("change", {
			value: {
				input: "",
				tex: "",
				raw: sortableItems.value.map(el=>`- ${el.label}`).join("\n")
			},
			validation: {
				result: errors===0,
				message: errors>0?`Il y a ${errors} erreur${errors>1?"s":""}`:""
			}
		})
	}

// Liste des élèments qui sont à réordrer.
let randomizeItems = ()=> {
	return PiMath.Random.shuffle(
		props.options.split("\n").map((element, index) => {
			return {
				id: index + 1,
				label: element
			}
		})
	)
}
let sortableItems = ref(randomizeItems())

let {loadAnswerToKeyboard} = useKeyboard(props)
let reset = () => sortableItems.value = randomizeItems()
defineExpose({
	reset,
	loadAnswer: (value)=>{
		loadAnswerToKeyboard(value, reset, changeEvent, (value)=>{
			sortableItems.value = props.options.split("\n").map((element, index)=>{
				return {id: index+1, label: element}
			})
		})
	}
})


</script>
