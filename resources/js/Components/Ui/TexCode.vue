<script setup lang="ts">

import {useClipboard} from "@vueuse/core"
import {ref} from "vue"
import {usePdf} from "@/Composables/useDownloadPdf.ts"

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

const {copy, copied} = useClipboard()

const showTexCode = ref(false)

const pdf = usePdf()

function downloadPdf() {
	pdf.LaTeX(props.title, props.slug, props.tex)
}
</script>

<template>
	<div>
		<div class="text-xs opacity-50 flex justify-between">
			<div>code TeX</div>

			<div class="flex gap-3">
				<button
					@click="copy(props.tex)"
					class="cursor-pointer hover:underline"
				>
					<i
						class="bi"
						:class="copied ? 'bi-check-lg text-green-600' : 'bi-clipboard-fill'"
					/>
					<span class="hidden md:inline md:ml-2">{{ copied ? 'copié' : 'copier' }}</span>
				</button>

				<button
					@click="downloadPdf"
					class="cursor-pointer  hover:underline"
				>
					<i class="bi bi-download" />
					<span class="hidden md:inline md:ml-2">télécharger</span>
				</button>

				<button
					@click="showTexCode = !showTexCode"
					class="cursor-pointer hover:underline"
				>
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
			class="relative text-xs text-gray-600 border bg-gray-100 px-3 mt-2 py-2"
		>
			<div
				class="font-code"
				v-html="props.tex.split('\n').join('<br/>')"
			/>
		</div>
	</div>
</template>


