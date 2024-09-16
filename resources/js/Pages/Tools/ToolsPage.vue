<script
	lang="ts"
	setup
>
import { computed, nextTick, onMounted, PropType, provide, ref } from "vue"
import { ToolInterface } from "@/types"
import { getModule, MODULE_TYPES } from "@/scolcours"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import { useMenuScrollTo } from "@/Composables/useHelpers"

defineOptions({ layout: LayoutMain })
const toolSlug = ref(null),
	toolSearch = ref(""),
	arraySearch = ref([])

provide("toolData", toolSlug)
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
		<!-- Title -->
		<div class="flex justify-between items-baseline my-4">
			<h2 class="text-2xl font-extralight">
				{{ toolName }}
			</h2>
		</div>

		<div class="flex gap-3 flex-col md:flex-row">
			<div class="flex-1 bg-white border rounded px-3 py-2">
				<component :is="toolComponent" />
				<div
					v-if="toolComponent === null"
					class="hidden md:grid place-items-center text-xl font-extralight min-h-[60vh]"
				>
					sélectionner un outil
				</div>
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
	</section>
</template>
