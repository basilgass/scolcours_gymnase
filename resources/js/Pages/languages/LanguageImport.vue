<script setup lang="ts">
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { useForm } from "@inertiajs/vue3"
import { computed, ref } from "vue"

defineOptions({ layout: LayoutMain })
const traduction = ref(""),
	swapFrForeign = ref(false),
	traductions = computed(() => {
		return traduction.value.split("\n")
			.filter(x => x.trim() !== "" && x.split("\t").length >= 2)
			.map(x => {

				const values = x
					.replaceAll("’", "'")
					.split("\t")
				return {
					fr: values[swapFrForeign.value ? 1 : 0],
					foreign: values[swapFrForeign.value ? 0 : 1],
					definition: values.length >= 3 ? values[2] : "",
					examples: values.length >= 4 ? values[3] : ""
				}
			})
	})
const form = useForm({
		language: "",
		unit: "",
		title: ""
	}),
	importerLesTraductions = function() {
		form
			.transform((data) => {
				return {
					...data,
					translations: traductions.value
				}
			})
			.post(route("translations.create"))


	}

</script>

<template>
	<div>
		<h1 class="py-10 text-xl">
			Importer des vocabulaires
		</h1>


		<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
			<div class="flex w-full gap-3 items-end">
				<button
					:class="form.language==='it'?'is-active':'bg-white'"
					class="btn flex-1"
					@click="form.language='it'"
				>
					it
				</button>
				<button
					:class="form.language==='en'?'is-active':'bg-white'"
					class="btn flex-1"
					@click="form.language='en'"
				>
					en
				</button>
				<button
					:class="form.language==='de'?'is-active':'bg-white'"
					class="btn flex-1"
					@click="form.language='de'"
				>
					de
				</button>
				<button
					:class="form.language==='es'?'is-active':'bg-white'"
					class="btn flex-1"
					@click="form.language='es'"
				>
					es
				</button>
			</div>

			<form-maker
				v-model="form.unit"
				label="unité"
				name="unite"
			/>
			<form-maker
				v-model="form.title"
				label="titre"
				name="titre"
			/>
		</div>

		<div>
			<form-maker
				v-model="traduction"
				catch-tab
				label="traduction"
				name="traduction"
				type="textarea"
				message="français \t langue étrangère \t description \t exemples"
			/>

			<div class="flex gap-3">
				<button
					class="btn btn-primary"
					@click="importerLesTraductions"
				>
					Importer
				</button>

				<form-maker
					v-model="swapFrForeign"
					:label="`inverser FR et ${form.language.toUpperCase()}`"
					name="swapLanguage"
					type="switch"
				/>
			</div>

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
