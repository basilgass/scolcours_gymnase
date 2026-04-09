<script lang="ts" setup>
import {onMounted, ref, useTemplateRef, watch} from "vue"
import {ChapterInterface, ThemeInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import FormTheme from "@/Components/Form/FormTheme.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	theme?: ThemeInterface | number | undefined
}

const props = withDefaults(defineProps<Props>(), {theme: undefined})
const theValue = defineModel<ChapterInterface>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const selectedTheme = ref<number>()
const showLoading = ref(true)
const availableChapters = ref<ChapterInterface[]>([])

function update(chapter: ChapterInterface) {
	if (props.disabled) return
	if (theValue.value?.id === chapter.id) {
		theValue.value = undefined
		emits('update', undefined)
		return
	}
	theValue.value = chapter
	emits('update', chapter)
}

function updateAvailableChapters() {
	showLoading.value = true
	if (!selectedTheme.value || selectedTheme.value === 0) {
		availableChapters.value = []
		showLoading.value = false
		return
	}
	axios.get(route('api.themes.chapters.index', {theme: selectedTheme.value}))
		.then((res: AxiosResponseModel<ChapterInterface[]>) => {
			availableChapters.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
		.finally(() => {
			showLoading.value = false
		})
}

onMounted(() => {
	if (props.focus) inputRef.value?.focus()
	if (props.theme === undefined) {
		selectedTheme.value = theValue.value?.theme_id ?? 0
	} else if (typeof props.theme === 'number') {
		selectedTheme.value = props.theme
	} else if (props.theme?.id) {
		selectedTheme.value = props.theme.id
	}
	updateAvailableChapters()
})

watch(() => props.theme, updateAvailableChapters)
watch(selectedTheme, updateAvailableChapters)
</script>

<template>
	<div
		ref="input"
		class="w-full @container"
		:class="{ 'opacity-50 pointer-events-none select-none': props.disabled }"
		v-bind="$attrs"
	>
		<h4 class="font-semibold">Recherche d'un chapitre</h4>
		<div class="grid grid-cols-1 gap-3">
			<form-theme
				v-if="theme === undefined"
				v-model="selectedTheme"
			/>
			<div
				v-if="showLoading"
				class="h-[200px] grid place-items-center"
			>
				<div>Chargement des chapitres...</div>
			</div>
			<div
				v-else
				class="flex flex-wrap gap-3"
			>
				<sc-button
					v-for="chapter in availableChapters"
					:key="`chapter-${chapter.id}`"
					:outline="theValue?.id !== chapter.id"
					:theme="selectedTheme"
					v-katex.auto="chapter.title"
					xs
					@click="update(chapter)"
				/>
			</div>
		</div>
	</div>
</template>
