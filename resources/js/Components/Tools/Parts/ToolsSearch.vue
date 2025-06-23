<script lang="ts" setup>

import {ToolInterface} from "@/types/modelInterfaces.ts"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {computed, onMounted, ref, useTemplateRef} from "vue"
import axios from "axios"
import {AxiosErrorMessage} from "@/types"
import {router} from "@inertiajs/vue3"

const toolSearch = ref<string>('')
const listOfTools = computed(() => {
	let foundTools = []
	if (toolSearch.value.trim() === "") {
		foundTools = [...availableTools.value]
	} else {
		const search = toolSearch.value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")

		// TODO: availableTools devrait avoir un mapping concernant la recherche pour enlever les aceents.

		foundTools = availableTools.value.filter(tool =>
			tool.slug.includes(search) ||
			tool.title.includes(search) ||
			tool.body.includes(search)
		)
	}

	foundTools.sort((a, b) => b.title < a.title ? 1 : 0)
	return foundTools
})

const availableTools = ref<ToolInterface[]>([])

async function getTools() {
	axios.get(route('api.tools.index'))
		.then((res) => {
			availableTools.value = res.data as ToolInterface[]
		})
		.catch((res: AxiosErrorMessage) => {
			console.log(res.response.data.message)
		})
}

function goToTool(slug: string | false): string {
	if (slug === false) return route('tools.index')

	return route('tools.show', {slug})
}

onMounted(() => {
	getTools()
})

// TODO: make the typing correctly for useTemplateRef <InstanceType<typeof FilteredList>>
const filterListRef = useTemplateRef('filterListRef')
defineExpose({
	focus: ()=>filterListRef.value.focus()
})

</script>

<template>
	<div>
		<filtered-list
			v-if="availableTools.length>0"
			ref="filterListRef"
			:list="listOfTools"
			focus
			list-class="columns-1 md:columns-3 lg:columns-4 xl:columns-5 space-y-5"
			no-title
			search="rechercher un outil"
			@enter="router.visit(goToTool($event.length===1 ? $event[0].slug : false))"
		>
			<template #card="{ item }: { item: ToolInterface }">
				<InertiaLink
					:href="goToTool(item.slug)"
					as="div"
					class="bg-white dark:bg-gray-900 rounded
						border border-slate-300 dark:border-slate-700
						min-h-[6em]
						hover:scale-105 transition-all
						break-inside-avoid-column cursor-pointer"
				>
					<header
						v-theme.bg.text="item.theme_id ?? 0"
						class="border-b border-slate-300 dark:border-slate-700 font-semibold px-3 py-2"
					>
						{{ item.title }}
					</header>
					<div class="px-3 py-2 font-extralight text-sm">
						{{ item.body }}
					</div>
				</InertiaLink>
			</template>
		</filtered-list>
		<div
			v-else
			class="grid place-items-center h-[90vh] text-2xl font-code"
		>
			<div>Chargement des outils</div>
		</div>
	</div>
</template>

<style scoped>

</style>
