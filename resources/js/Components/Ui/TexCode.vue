<script setup lang="ts">

import { useClipboard } from "@vueuse/core"
import {inject, ref} from "vue"
import axios from "axios"
import {AxiosErrorMessage, flashInterface} from "@/types"

const flash = inject<flashInterface>("flash")
const props = withDefaults(defineProps<{
	tex: string,
	hide?: boolean,
	title?: string,
	slug?: string
}>(),
	{
		hide: false,
		title: "Code TeX",
		slug: "tools"
	})

const { copy, copied } = useClipboard()

const showTexCode = ref(false)

// TODO: mettre le downloadPDF dans un "useDownloadPDF" avec pleins d'options.
function downladPdf(){
	axios
		.post(route("latex.pdf"), {
			template: "latex.simple",
			title: props.title,
			slug: props.slug,
			theme: "divers",
			content: `\\[ ${ props.tex } \\]`
		})
		.then((res) => {
			flash.success(
				"PDF généré avec succès",
				{
					link: {
						label: "Voir le PDF",
						url: route("latex.download", [res.data.slug]),
						external: true
					},
					timeout: 5000
				}
			)

			document.location.href = route("latex.download", [res.data.slug])
		})
		.catch((err: AxiosErrorMessage) => {
			flash.error(err.response.data.message)
			// console.log(err.response.data.message)
			// pdfError.value = err.response.data.message
		})
}
</script>

<template>
	<div>
		<div class="text-xs opacity-50 mb-2 flex justify-between">
			<div>code TeX</div>

			<div class="flex gap-3">
				<button
					@click="copy(props.tex)"
				>
					<i
						class="bi"
						:class="copied ? 'bi-check-lg text-green-600' : 'bi-clipboard-fill'"
					/>
					<span class="hidden md:inline md:ml-2">{{ copied ? 'copié' : 'copier' }}</span>
				</button>

				<button @click="downladPdf">
					<i class="bi bi-download" />
					<span class="hidden md:inline md:ml-2">télécharger</span>
				</button>

				<button @click="showTexCode = !showTexCode">
					<i
						:class="{
							'bi bi-x-lg': showTexCode,
							'bi bi-code': !showTexCode
						}"
					/>
					<span class="hidden md:inline md:ml-2">{{ showTexCode ? 'cacher' : 'afficher' }}</span>
				</button>
			</div>
		</div>
		<div
			v-show="showTexCode"
			class="relative text-xs text-gray-600 border bg-gray-100 px-3 py-2"
		>
			<div
				class="font-code"
				v-html="props.tex.split('\n').join('<br/>')"
			/>
		</div>
	</div>
</template>


