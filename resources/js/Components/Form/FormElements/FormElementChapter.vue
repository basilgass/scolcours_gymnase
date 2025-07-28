<script lang="ts" setup>
import {onMounted, ref, watch} from "vue"
import {ChapterInterface, ThemeInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {FormElementEmits} from "@/Components/Form/FormMakerInterface.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ScButton from "@/Components/Ui/scButton.vue"

// REFACTOR: transformer en un "suggestion list"
const theValue = defineModel<ChapterInterface>()

defineOptions({
	inheritAttrs: false
})

const props = withDefaults(defineProps<{
	theme?: ThemeInterface | number | undefined,
	focus?: boolean,
}>(), {
	theme: undefined,
	focus: false,
})

const inp = ref(null)

function focusFn(select: boolean) {
	inp.value.focus()
	if (select === true) {
		inp.value.select()
	}
}

const emits = defineEmits<FormElementEmits>()
defineExpose({focus: focusFn})

const selectedTheme = ref<number>()

const update = (chapter: ChapterInterface) => {
	if (theValue.value?.id === chapter.id) {
		theValue.value = undefined
		emits('update', undefined)
		return
	}

	theValue.value = chapter
	emits('update', chapter as ChapterInterface)
}

onMounted(() => {
	if (props.focus) focusFn(false)

	if (props.theme === undefined) {
		selectedTheme.value = theValue.value?.theme_id ?? 0
	} else if (typeof props.theme === 'number') {
		selectedTheme.value = props.theme
	} else if (props.theme?.id) {
		selectedTheme.value = props.theme.id
	}

	updateAvailableChapters()
})

const showLoading = ref(true)

const availableChapters = ref<ChapterInterface[]>([])

function updateAvailableChapters() {
	showLoading.value = true
	if (selectedTheme.value === 0) {
		availableChapters.value = []
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

watch(() => props.theme, () => {
	// Hide the items.
	updateAvailableChapters()
})
watch(selectedTheme, () => {
	// Hide the items.
	updateAvailableChapters()
})
</script>

<template>
	<div
		class="w-full @container"
		v-bind="$attrs"
	>
		<h4 class="font-semibold">
			Recherche d'un chapitre
		</h4>

		<div class="grid grid-cols-1 gap-3">
			<form-maker
				v-if="theme===undefined"
				class="-mt-5"
				v-model="selectedTheme"
				type="theme"
			/>
			<div
				v-if="showLoading"
				class="h-[200px] grid place-items-center"
			>
				<div>Chargement des chapitres...</div>
			</div>
			<div
				v-else
				class="flex flex-wrap
						gap-3"
			>
				<sc-button
					v-for="chapter in availableChapters"
					:key="`chapter-${chapter.id}`"
					@click="update(chapter)"
					:outline="theValue?.id!==chapter.id"
					:theme="selectedTheme"
					v-katex.auto="chapter.title"
					xs
				/>
			</div>
		</div>
	</div>
</template>
