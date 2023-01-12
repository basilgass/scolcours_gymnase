parameters: dx

code: rational fraction
<template>
	<pi-table-of-signs
		:tos="tableOfSigns"
		:fn="study.name"
		:minimal="minimal"
		:extremes="extremes"
	/>
</template>
<script setup>
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"

let props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)

let study = computed(()=>{
		let [num, den] = code.value.split("/"),
			p = new PiMath.Rational(num, den),
			cfg = params.value?params.value.split(","):[]
		return p.study("signs" + (params.value?(","+params.value):""))
	}),
	minimal = computed(()=>{
		return params.value?params.value.includes("minimal"):false
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
		if(params.value.split(",").includes("dx")){
			return study.value.derivative
		}else{
			return study.value.signs
		}
	})

</script>
