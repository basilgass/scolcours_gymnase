<info>
parameters: dx

code: rational fraction
</info>
<template>
	<pi-table-of-signs
		:tos="tableOfSigns"
		:fn="study.name"
		:minimal="minimal"
		:extremes="extremes"
		class="max-w-lg mx-auto"
	/>
</template>

<script setup>
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import {makeStudyFromCode} from "@/Composables/useTos"

let props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)

let study = computed(()=>{
		if(code.value.includes("@")){
			let name = "f"
			for(let param of params.value.split(",")){
				if(param.includes("(x)")){
					name = param.split("(x)")[0]
				}
			}

			return {
				name
			}
		}

		let [num, den] = code.value.split("/"),
			p = new PiMath.Rational(num, den || "1")

		return p.study("signs" + (params.value?(","+params.value):""))

	}),
	minimal = computed(()=>{
		if(code.value.includes("@")){return true}
		if(params.value.includes("minimal")||params.value.includes("min")){return true}
		return false
	}),
	extremes = computed(()=>{
		if(params.value){
			if(params.value.includes("extrema=")){
				return params.value.split("extrema=")[1].split(",")[0].split("|").join(",")
			}
		}
		return null
	}),
	tableOfSigns = computed(()=>{
		if(code.value.includes("@")){
			// Building manually
			return makeStudyFromCode(code.value, code.value.split("@").length===4, true)
		}

		if(params.value.split(",").includes("dx")){
			return study.value.derivative
		}else{
			return study.value.signs
		}
	})

</script>
