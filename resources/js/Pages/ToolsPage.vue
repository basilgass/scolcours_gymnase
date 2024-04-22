<script lang="ts" setup>
import { computed, nextTick, onMounted, PropType, ref } from "vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import { ToolInterface } from "@/types"
import { getModule, MODULE_TYPES } from "@/scolcours"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import { useMenuScrollTo } from "@/Composables/useHelpers"

defineOptions({ layout: LayoutMain })
const toolSlug = ref(null),
    toolSearch = ref(""),
    arraySearch = ref([])

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
	console.log(slug)
	
	// Scroll to top
	useMenuScrollTo()

	// Update the slug
	nextTick(()=>{
		toolSlug.value=slug
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
	<section
		class="scolcours-container"
	>
		<!-- Title -->
		<div
			class="flex justify-between items-baseline mb-4"
		>
			<div>
				<ArticleTitle title="Outils" />
				<Link
					v-if="toolSlug!==''"
					:href="`/tools/${toolSlug}`"
				>
					{{ toolName }}
				</Link>
			</div>

			<button
				v-if="toolSlug"
				@click="toolSlug=''"
			>
				Tous les outils
			</button>
		</div>

		<component :is="toolComponent" />

		<div class="mt-10">
			<filtered-list
				title="outils"
				:list="listOfTools"
				list-class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6"
				@enter="$event.length===1?changeSlug($event[0].slug):''"
			>
				<template #card="{item}:{item: ToolInterface}">
					<div
						class="bg-white border rounded-lg shadow cursor-pointer hover:scale-[102%] h-full transition"
						@click="changeSlug(item.slug)"
					>
						<div class="border-b px-3 py-1 bg-slate-50 rounded-t-lg">
							<h2 class="text-xl">
								{{ item.title }}
							</h2>
							<div class="text-sm text-gray-400">
								{{ item.slug }}
							</div>
						</div>
						<div class="p-3">
							{{ item.body }}
						</div>
					</div>
				</template>
			</filtered-list>
		</div>
	</section>
</template>

