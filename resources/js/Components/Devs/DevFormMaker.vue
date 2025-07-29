<script setup lang="ts">

import {ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {FormElementType} from "@/Components/Form/FormMakerInterface.ts"

const withIcon = ref('')
const withButton = ref(false)
const clearable = ref(false)
const inlineLabel = ref(false)
const message = ref("")
const label = ref("my label")
const currentLine = ref("")
const mathMode = ref(false)

const inputTypes: FormElementType[] = ['text', 'number', 'fraction', 'vector', 'switch', 'codearea', 'select']
const type = ref<FormElementType>('text')

const value = ref("something written here")

const json = ref({
	hello: 'world',
	foo: 5
})

function updateJson(value){
	console.log(value)
	console.log(json.value)
}
</script>

<template>
	<article class="scolcours-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<Card>
			<template #header>
				<div class="font-code text-xs">
					{{ type }}
				</div>
			</template>

			<form-maker
				:label
				:icon="withIcon"
				:btn="withButton"
				:inline-label="inlineLabel"
				:clearable
				output="Le vecteur entré est \(\overrightarrow{v} = $VALUE$\)"
				:type
				v-model="value"
				@current-line="currentLine = $event"
				@math-mode="mathMode = $event"
			/>
			<form-maker
				:label
				:icon="withIcon"
				:btn="withButton"
				:inline-label="inlineLabel"
				:clearable
				output="Le vecteur entré est \(\overrightarrow{v} = $VALUE$\)"
				:type
				v-model="value"
				@current-line="currentLine = $event"
				@math-mode="mathMode = $event"
				xl
			/>
			<form-maker
				:label
				:icon="withIcon"
				:btn="withButton"
				:inline-label="inlineLabel"
				:clearable
				output="Le vecteur entré est \(\overrightarrow{v} = $VALUE$\)"
				:type
				v-model="value"
				@current-line="currentLine = $event"
				@math-mode="mathMode = $event"
				sm
			/>
			<form-maker
				:label
				:icon="withIcon"
				:btn="withButton"
				:inline-label="inlineLabel"
				:clearable
				output="Le vecteur entré est \(\overrightarrow{v} = $VALUE$\)"
				:type
				v-model="value"
				@current-line="currentLine = $event"
				@math-mode="mathMode = $event"
				xs
			/>
		</Card>

		<Card class="col-span-2 max-w-2xl mx-auto mt-10">
			<template #header>
				configuration
			</template>
			<div class="flex gap-3">
				<button
					v-for="t in inputTypes"
					:key="t"
					class="border rounded hover:bg-gray-200 px-2"
					@click="type=t"
					:class="type===t?'bg-blue-200':''"
				>
					{{ t }}
				</button>
			</div>

			<div class="flex gap-3">
				<button
					class="border rounded hover:bg-gray-200 px-2"
					@click="withIcon=withIcon ? '': 'bi bi-card-text'"
					:class="withIcon?'bg-blue-200':''"
				>
					withIcon
				</button>
				<button
					class="border rounded hover:bg-gray-200 px-2"
					@click="withButton=!withButton"
					:class="withButton?'bg-blue-200':''"
				>
					withButton
				</button>
				<button
					class="border rounded hover:bg-gray-200 px-2"
					@click="inlineLabel=!inlineLabel"
					:class="inlineLabel?'bg-blue-200':''"
				>
					inlineLabel
				</button>
				<button
					class="border rounded hover:bg-gray-200 px-2"
					@click="clearable=!clearable"
					:class="clearable?'bg-blue-200':''"
				>
					clearable
				</button>
			</div>

			<div class="flex flex-col gap-3 mt-5">
				<div class="flex gap-2">
					<label class="w-[100px]">label </label>
					<input
						v-model="label"
						class="border flex-1"
					>
				</div>
				<div class="flex gap-2">
					<label class="w-[100px]">message </label>
					<input
						v-model="message"
						class="border flex-1"
					>
				</div>
			</div>

			<div class="mt-4 font-code border p-3 bg-gray-100 border-gray-600 text-xs min-h-[3rem]">
				{{ value }}
			</div>

			<div class="mt-4 font-code border p-3 bg-gray-100 border-gray-600 text-xs min-h-[3rem]">
				<div>current line</div>
				<div>{{ currentLine }}</div>
				<div>Curseur dans environnement math : {{ mathMode }}</div>
			</div>
		</Card>

		<Card>
			<form-maker
				type="json"
				:map="{
					hello: 'text',
					foo: 'number'
				}"
				v-model="json"
				@update="updateJson"
			/>
		</Card>
	</article>
</template>
