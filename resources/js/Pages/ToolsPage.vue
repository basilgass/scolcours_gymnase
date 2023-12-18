<!--suppress ALL -->
<script lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
    layout: LayoutMain
}
</script>
<script lang="ts" setup>
import {computed, defineAsyncComponent, DefineComponent, onMounted, PropType, ref, resolveComponent} from "vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {ToolInterface} from "@/types"
import {getModule, MODULE_TYPES, ToolsModules} from "@/scolcours"
import FormMaker from "@/Components/Form/FormMaker.vue"

let toolSlug = ref(null),
    toolSearch = ref(""),
    arraySearch = ref([])

const props = defineProps({
    tools: {
        type: Object as PropType<ToolInterface[]>, default: () => {
        }
    },
    tool: {
        type: Object, default: () => {
        }
    }
})
let toolComponent = computed(() => {
    return getModule(toolSlug.value, MODULE_TYPES.TOOLS)
	// const key = `./Components/Tools/${toolSlug.value}.vue`;
	// if(ToolsModules.hasOwnProperty(key)){
	// 	return defineAsyncComponent(ToolsModules[key])
	// }
	// return false
})

let toolName = computed(() => {
    if (toolSlug.value === "") {
        return ""
    }
    for (let tool of props.tools) {
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

let listOfTools = computed(() => {
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

function toolSelect() {
    if (listOfTools.value.length === 1) {
        toolSlug.value = listOfTools.value[0].slug
    }
}

function toolUnselect() {
    toolSearch.value = ""
    toolSlug.value = ""
}
</script>
<template>
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

	<div v-if="!toolSlug">
		<form-maker
			v-model="toolSearch"
			focus
			label="Sélectionner l'outils"
			name="tools"
			@keyup.enter="toolSelect"
		/>

		<!-- List of all tools -->
		<table class="w-full my-5">
			<tr
				v-for="tool of listOfTools"
				:key="tool.slug"
				class="odd:bg-white hover:bg-amber-100  cursor-pointer"
				@click="toolSlug=tool.slug"
			>
				<td class="pl-3 py-2">
					<h2 class="text-lg">
						{{ tool.title }}
					</h2>
					<div class="text-sm text-gray-400">
						{{ tool.slug }}
					</div>
				</td>
				<td class="py-2 align-text-top">
					{{ tool.body }}
				</td>
			</tr>
		</table>
	</div>

	<keep-alive>
		<component
			:is="toolComponent"
			@keyup.esc="toolUnselect"
		/>
	</keep-alive>
</template>

