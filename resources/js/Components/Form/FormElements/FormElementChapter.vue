<script lang="ts" setup>
import {onMounted, ref, watch} from "vue"
import {ChapterInterface, ThemeInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {AxiosErrorMessage} from "@/types"
import Card from "@/Components/Ui/Card.vue"

// REFACTOR: transformer en un "suggestion list"
const theValue = defineModel<ChapterInterface>()

defineOptions({
	inheritAttrs: false
})

const props = withDefaults(defineProps<{
	theme: ThemeInterface,
	focus?: boolean,
}>(), {
	focus: false,
})

const inp = ref(null)

function focusFn(select: boolean) {
	inp.value.focus()
	if (select === true) {
		inp.value.select()
	}
}

defineExpose({focus: focusFn})

const update = () => {
	// emits("update", theValue.value)
}

onMounted(() => {
	if (props.focus) focusFn(false)

	updateAvailableChapters()
})

const availableChapters = ref<ChapterInterface[]>([])

function updateAvailableChapters() {
	axios.get(route('api.themes.chapters.index', {theme: props.theme.slug}))
		.then((res: { data: ChapterInterface[] }) => {
			console.log(res.data)
			availableChapters.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

watch(() => props.theme, () => {
	updateAvailableChapters()
})

</script>
<template>
	<div>
		Recherche d'un chapitre

		<div
			class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4
				gap-3"
		>
			<Card
				v-for="chapter in availableChapters"
				:key="`chapter-${chapter.id}`"
				@click="theValue=chapter"
				class="p-3 cursor-pointer transition-all hover:shadow"
				:class="{
					'bg-blue-200': theValue?.id===chapter.id
				}"
			>
				<div class="flex justify-between items-baseline">
					<div v-katex.auto="chapter.title" />
					<div class="font-code text-xs">
						id: {{ chapter.id }}
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>
