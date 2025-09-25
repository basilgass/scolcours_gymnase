<script setup lang="ts">
import {onMounted, ref} from "vue"
import axios from "axios"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})
const flash = useStoreFlashMessage()
const content = ref(`\\begin{itemize}
\\item \\(x=5\\)
\\item hello wolrd
\\end{itemize}`)

function makePDF() {
	axios
		.post(route("latex.pdf"), {
			template: "latex.simple",
			title: "test title",
			slug: "test",
			theme: "arithmetique",
			content: content.value,
		})
		.then((res) => {
			flash.success(
				"PDF généré avec succès",
				{
					link: {
						label: "Voir le PDF",
						url: route("latex.download", [res.data.slug]),
						external: true,
					},
					timeout: 5000
				}
			)
		})
		.catch((err) => {
			console.log(err.response)
		})
}

const pdfs = ref([])

function getPDF() {
	axios
		.get(route("latex.links"))
		.then((res) => {
			pdfs.value = res.data
		})
		.catch((err) => {
			console.log(err.response)
		})
}

onMounted(() => {
	getPDF()
})
</script>
<template>
	<!-- Title -->
	<div>
		<textarea
			v-model="content"
			rows="10"
			class="w-full p-3 rounded-sm"
		/>

		<sc-button
			@click="makePDF"
		>
			to pdf
		</sc-button>

		<div>
			<div
				v-for="pdf in pdfs"
				:key="pdf.slug"
			>
				<a :href="route('latex.download', [pdf.slug])">{{
					pdf.slug
				}}</a>
			</div>
		</div>
	</div>
</template>
