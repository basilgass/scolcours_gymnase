<template>
	<h1>Test clavier</h1>
	<div class="flex flex-col gap-3">
		<div class="flex justify-between gap-3">
			<button
				v-for="item in choices"
				:key="item"
				class="btn btn-xs"
				:class="keyboard===item?'btn-success':''"
				@click="keyboard=item"
			>
				{{ item }}
			</button>
		</div>
		<div class="flex justify-between">
			<label>validate <input
				v-model="validate"
				type="checkbox"
			></label>
			<label>reset <input
				v-model="reset"
				type="checkbox"
			></label>
			<label>back <input
				v-model="back"
				type="checkbox"
			></label>
			<label>next <input
				v-model="next"
				type="checkbox"
			></label>
			<label>multiple <input
				v-model="multiple"
				type="checkbox"
			></label>
		</div>
		<div>
			<input v-model="letters">
		</div>
	</div>
	<div
		v-katex.display="tex"
		class="katex-block"
	/>
	<Keyboard
		v-model="result"
		v-model:tex="tex"
		:keyboard="keyboard + (letters===''?'':`,${letters}`)"
		math-output
		text-output
		:validate="validate"
		:reset="reset"
		:back="back"
		:next="next"
		:multiple="multiple"
		class="max-w-3xl mx-auto"
	/>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import Keyboard from "@/Components/Ui/Keyboard"
import {keyboards} from "@/keyboards"

import {ref} from "vue"

let keyboard = ref("pow"),
	choices = ref(Object.keys(keyboards)),
	result = ref(""),
	validate=ref(true),
	reset=ref(true),
	next=ref(true),
	back=ref(true),
	multiple=ref(true),
	letters=ref("abcnm"),
	tex = ref("")

</script>
