<script setup lang="ts">
import { ref } from 'vue'
import PiThreeParser from '../Pi/PiThreeParser.vue'
import FormMaker from '../Form/FormMaker.vue'

const parameters = ref('')
const code = ref('')
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
