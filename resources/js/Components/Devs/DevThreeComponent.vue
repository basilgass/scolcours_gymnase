<script setup lang="ts">
import { ref } from 'vue'
import PiThreeParser from '../Pi/PiThreeParser.vue'
import FormMaker from '../Form/FormMaker.vue'

const parameters = ref('grid,axis')
const code = ref(`A(6,2,2)
B(3,8,3)
C(1,1,10)->*
p=plane A,B,C
O(0,0,6)->*
P=proj O,p
v1=vPA,2
v2=vPB,3,1,0.5
a=arc A,P,B`)
</script>
<template>
	<!-- Title -->
	<div ref="root">
		<h1 class="text-2xl">
			Test de Three.js avec composant
		</h1>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			<div class="flex flex-col gap-2">
				<FormMaker font-code sm v-model="parameters" />
				<FormMaker type="code" font-code sm v-model="code" />
			</div>
			<PiThreeParser :draw="{ code, parameters }" />
		</div>
	</div>
</template>
