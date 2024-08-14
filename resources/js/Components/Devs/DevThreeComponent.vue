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
l=PA->w=2
v1=vPA,2->color=red,w=6
v2=vPB,3,1,0.5
a=arc A,P,B`)

code.value = `A(8,0,0)
B(0,4,0)
C(0,0,10)
p=plane A,B,C,20,15
X(6,6,6)->*,tex=A
P=proj X,p->tex=H
n=PX.->color=red,w=2
Y(2,0,7)
A=proj Y,p->tex=M
v=AX.
d=AP.->dash
a=arc A,X,P`
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
				<FormMaker
					type="code"
					font-code
					sm
					v-model="code"
				/>
			</div>
			
			<PiThreeParser :draw="{ code, parameters }" />
		</div>
	</div>
</template>
