<template>
	<!-- Title -->
	<div ref="root">
		<vue-slider
			v-model="vitesse"
			:min="0"
			:max="20"
			:interval="0.00001"
			:marks="{'8.482300164692441': '32', '16.964600329384883':'16'}"
			class="min-h-[30px] mb-10"
		/>

		<div class="grid grid-cols-2">
			<div class="grid grid-cols-1 place-items-center">
				<img
					ref="roue"
					src="/images/roue.png"
					height="300"
					width="300"
				>
			</div>

			<div>
				<table>
					<tr>
						<td class="pr-4 font-semibold">
							images par seconde
						</td>
						<td class="pr-4">
							{{ imageParSecondes }}
						</td>
					</tr>
					<tr>
						<td class="pr-4 font-semibold">
							vitesse
						</td>
						<td class="pr-4">
							{{ (+vitesse).toFixed(3) }}km/h = {{ (vitesse / 3.6).toFixed(3) }} m/s
						</td>
					</tr>
					<tr>
						<td class="pr-4 font-semibold">
							angle par image
						</td>
						<td class="pr-4">
							{{ (+angleAjout).toFixed(3) }}°
						</td>
					</tr>
				</table>
			</div>
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



import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import {computed, onMounted, ref, watch} from "vue"
import VueSlider from "vue-slider-component/dist/vue-slider-component.umd.min"
import "vue-slider-component/theme/material.css"

let vitesse = ref("0"),
	diametre = ref(1),
	roue = ref(null),
	angle = ref(0),
	imageParSecondes = ref(24),
	angleAjout = computed(()=>{
		// v = a/360*pi*d /t => a = v * t * 360 / pi / d
		return vitesse.value * (1/imageParSecondes.value) * 360 /(Math.PI*diametre.value) / 3.6
	}),
	timer

watch(vitesse, (oldValue, newValue)=>{
	angle.value = 0
	if(timer) {
		clearInterval(timer)
	}

	timer = setInterval(()=>{
		roue.value.style.transform = `rotate(${angle.value}deg)`
		angle.value += +angleAjout.value
	}, (1/imageParSecondes.value)*1000)

})

onMounted(()=>{
	vitesse.value = "0"
})
</script>

