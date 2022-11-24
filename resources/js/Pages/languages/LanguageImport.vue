<template>
	<div>
		<h1 class="py-10 text-xl">
			Importer des vocabulaires
		</h1>


		<div class="grid grid-cols-3 gap-3">
			<form-input
				v-model="form.language"
				label="langue"
				name="langue"
			/>
			<form-input
				v-model="form.unit"
				label="unité"
				name="unite"
			/>
			<form-input
				v-model="form.title"
				label="titre"
				name="titre"
			/>
		</div>

		<div class="flex gap-3">
			<button @click="generate('it', key)" class="btn" v-for="(item, key) of vocabulare" :key="key">Italiano {{ key }}</button>
			<button @click="generate('en', key)" class="btn" v-for="(item, key) of vocabulary" :key="key">English {{ key }}</button>
		</div>

		<div>
			<form-textarea
				v-model="traduction"
				label="traduction"
				name="traduction"
			>
				français \t langue étrangère \t description \t exemples
			</form-textarea>

			<button
				class="btn btn-primary"
				@click="importerLesTraductions"
			>
				Importer
			</button>

			<div class="bg-white">
				<table class="w-full">
					<thead>
						<tr class="text-left">
							<th class="p-2">
								français
							</th>
							<th class="p-2">
								langue étrangère
							</th>
							<th class="p-2">
								definition
							</th>
							<th class="p-2">
								exemples
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) of traductions"
							:key="index"
							class="odd:bg-amber-100"
						>
							<td class="p-2">
								{{ item.fr }}
							</td>
							<td class="p-2">
								{{ item.foreign }}
							</td>
							<td class="p-2">
								{{ item.definition }}
							</td>
							<td class="p-2">
								{{ item.examples }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain"

import {vocabulary} from "@/Pages/languages/English/englishUnits";
import {vocabulare} from "@/Pages/languages/Italiano/italianoUnita";

export default {
	layout: LayoutMain
}
</script>

<script setup>
import {useForm} from "@inertiajs/inertia-vue3"
import FormInput from "@/Components/Form/FormInput.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import {computed, ref} from "vue"
import {Inertia} from "@inertiajs/inertia"
import {vocabulare} from "@/Pages/languages/Italiano/italianoUnita";
import {vocabulary} from "@/Pages/languages/English/englishUnits";

let traduction = ref(""),
	traductions = computed(()=>{

		return traduction.value.split("\n")
			.filter(x=>x.trim()!=="")
			.map(x=>{
				const values = x.split("\t")
				return {
					fr: values[0],
					foreign: values.length>=2?values[1]:"",
					definition: values.length>=3?values[2]:"",
					examples: values.length>=4?values[3]:"",
				}
			})
	})
let form = useForm({
		language: "",
		unit: "",
		title: ""
	}),
	importerLesTraductions = function() {
		form
			.transform((data)=>{
				return {
					...data,
					translations: traductions.value
				}
			})
			.post(route("translation.create"))


	},
	generate = function(L, U){
		form.language=L
		let TR = []
		if(L==='it'){
			form.unit = `unità ${U}`
			TR = vocabulare[U].map(x=>{
				return {
					fr: x[1],
					foreign: x[0]
				}
			})
		}else{
			form.unit = `Life ${U}`
			TR = vocabulary[U].map(x=>{
				return {
					fr: x.fr,
					foreign: x.en,
					definition: x.definition,
					examples: x.examples
				}
			})
		}

		form
			.transform((data)=>{
				return {
					...data,
					translations: TR
				}
			})
			.post(route("translation.create"))
	}
</script>
