<script
	lang="ts"
	setup
>
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {useMenuScrollTo} from "@/Composables/useHelpers"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {getModule, MODULE_TYPES} from "@/scolcours"

import {ToolInterface} from "@/types/modelInterfaces.ts"
import {computed, nextTick, onMounted, PropType, provide, ref} from "vue"
import {setActivePinia} from "pinia"

defineOptions({layout: LayoutMain})
const toolSlug = ref(null),
	toolSearch = ref(""),
	arraySearch = ref([])

provide("toolData", toolSlug)

const {resetTools} = useToolsStorage()


const props = defineProps({
	tools: {
		type: Object as PropType<ToolInterface[]>, default: () => {
		}
	},
	tool: {
		type: Object as PropType<ToolInterface>, default: () => {
		}
	}
})

function changeSlug(slug: string) {
	// Scroll to top
	useMenuScrollTo()

	// Update the slug
	nextTick(() => {
		toolSlug.value = slug
	})

}

const toolComponent = computed(() => {
	return getModule(toolSlug.value, MODULE_TYPES.TOOLS)
})

const toolName = computed(() => {
	if (toolSlug.value === "") return ""

	for (const tool of props.tools) {
		if (tool.slug === toolSlug.value) {
			return tool.title
		}
	}
	return ""
})

onMounted(() => {
	if (props.tool !== null && props.tool.slug !== "") {
		toolSlug.value = props.tool.slug
	}

	arraySearch.value = props.tools.map(tool => {
		return {
			...tool,
			search: {
				slug: tool.slug.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
				title: tool.title.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
				body: tool.body.normalize("NFD").replace(/\p{Diacritic}/gu, "")
			}
		}
	})

})

const listOfTools = computed(() => {
	let foundTools = []
	if (toolSearch.value.trim() === "") {
		foundTools = [...props.tools]
	} else {
		const search = toolSearch.value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
		foundTools = arraySearch.value.filter(tool =>
			tool.search.slug.includes(search) ||
			tool.search.title.includes(search) ||
			tool.search.body.includes(search)
		)
	}

	foundTools.sort((a, b) => b.title < a.title ? 1 : 0)
	return foundTools
})

</script>
<template>
	<section class="scolcours-container">
		<div
			v-if="toolComponent"
		>
			<!-- Title -->
			<div class="flex justify-between items-baseline my-4">
				<h2 class="text-2xl font-extralight">
					{{ toolName }}
				</h2>
				<button @click="resetTools">
					<i class="bi bi-c-circle" />
				</button>
			</div>

			<div class="flex gap-3 flex-col md:flex-row">
				<div class="flex-1 bg-white border rounded-sm px-3 py-2">
					<component :is="toolComponent" />
				</div>

				<div class="md:max-w-[200px]">
					<filtered-list
						:list="listOfTools"
						list-class="grid grid-cols-1 gap-2"
						no-title
						search="rechercher un outil"
						@enter="$event.length === 1 ? changeSlug($event[0].slug) : ''"
					>
						<template #card="{ item }: { item: ToolInterface }">
							<InertiaLink
								:class="item.slug === toolSlug ? 'font-semibold' : ''"
								:href="route('tools.tool', [item.slug])"
								as="div"
								class="cursor-pointer hover:pl-2 transition-all text-sm"
							>
								{{ item.title }}
							</InertiaLink>
						</template>
					</filtered-list>
				</div>
			</div>
		</div>


		<filtered-list
			v-else
			:list="listOfTools"
			list-class="columns-1 md:columns-3 lg:columns-4 xl:columns-5 space-y-5"
			no-title
			search="rechercher un outil"
			@enter="$event.length === 1 ? changeSlug($event[0].slug) : ''"
			focus
		>
			<template #card="{ item }: { item: ToolInterface }">
				<InertiaLink
					as="div"
					class="bg-white dark:bg-gray-900 rounded
					border border-slate-300 dark:border-slate-700
					min-h-[6em]
					hover:scale-105 transition-all
					break-inside-avoid-column cursor-pointer"
					:href="route('tools.tool', [item.slug])"
				>
					<header
						class="border-b border-slate-300 dark:border-slate-700 font-semibold px-3 py-2 bg-slate-100 dark:bg-slate-700"
						v-theme.bg.text="item.theme_id ?? 0"
					>
						{{ item.title }}
					</header>
					<div class="px-3 py-2 font-extralight text-sm">
						{{ item.body }}
					</div>
				</InertiaLink>
			</template>
		</filtered-list>
	</section>
</template>
