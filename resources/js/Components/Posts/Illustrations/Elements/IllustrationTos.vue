<info>
parameters: dx

code: rational fraction
</info>
<template>
	<pi-table-of-signs
		:tos="tableOfSigns"
		:fn="fnName"
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
// Paramètres
//      - <nom>(x)          permet de déterminer le nom de la fonction
//      - min[imal]         n'afficher que la dernière ligne
//      - extream=3|4|5     liste des coord y des extremes pour l'affichage des coordonnées
// Deux modes pour code
// 1.   PiMath.Rational
// 2.   <zero>@<signs>@<croissance>@<extremes>

let props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)


let config = computed(()=>{
		return props.illustration.parameters.split(",")
	}),
	fnName = computed(()=>{
		const name = config.value.filter(x=>x.startsWith("name=")).map(x=>x.split("name=")[1])
		return name.length === 1 ? name[0] : "f(x)"
	}),
	minimal = computed(()=>{
		if(code.value.includes("@")){return true}

		return !!(config.value.includes("minimal") || config.value.includes("min"))

	}),
	extremes = computed(()=>{
		const extremes = config.value.filter(x=>x.startsWith("extrema=")).map(x=>x.split("extrema=")[1])

		if(extremes.length===1){
			return extremes[0].split("|")
		}
		return null
	}),
	tableOfSigns = computed(()=>{
		if(code.value.includes("@")){
			// Building manually
			return makeStudyFromCode(code.value, code.value.split("@").length===4, true)
		}

		let [num, den] = code.value.split("/"),
			p = new PiMath.Rational(num, den || "1")

		const study = p.study("signs" + (params.value?(","+params.value):""))
		if(config.value.includes("dx")){
			return study.derivative
		}else{
			return study.signs
		}
	})

</script>
