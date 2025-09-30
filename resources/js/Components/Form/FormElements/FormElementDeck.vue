<script lang="ts" setup>
import {onMounted, ref} from "vue"
import {DeckInterface, ThemeInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {FormElementEmits} from "@/Components/Form/FormMakerInterface.ts"
import ScButton from "@/Components/Ui/scButton.vue"

// REFACTOR: transformer en un "suggestion list"
const theValue = defineModel<DeckInterface>()

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

const update = (deck: DeckInterface) => {
	if (theValue.value?.id === deck.id) {
		theValue.value = undefined
		emits('update', undefined)
		return
	}

	theValue.value = deck
	emits('update', deck as DeckInterface)
}

onMounted(() => {
	if (props.focus) focusFn(false)

	// if (props.theme === undefined) {
	// 	selectedTheme.value = theValue.value?.chapter.id ?? 0
	// } else if (typeof props.theme === 'number') {
	// 	selectedTheme.value = props.theme
	// } else if (props.theme?.id) {
	// 	selectedTheme.value = props.theme.id
	// }

	updateAvailableDecks()
})

const showLoading = ref(true)

const availableDecks = ref<DeckInterface[]>([])

function updateAvailableDecks() {
	showLoading.value = true
	if (selectedTheme.value === 0) {
		availableDecks.value = []
		return
	}

	axios.get(route('api.decks.index'))
		.then((res: AxiosResponseModel<DeckInterface[]>) => {
			availableDecks.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
		.finally(() => {
			showLoading.value = false
		})
}

// watch(() => props.theme, () => {
// 	// Hide the items.
// 	updateAvailableChapters()
// })
// watch(selectedTheme, () => {
// 	// Hide the items.
// 	updateAvailableChapters()
// })
</script>

<template>
	<div
		class="w-full @container"
		v-bind="$attrs"
	>
		<h4 class="font-semibold">
			Recherche d'un deck
		</h4>

		<div class="grid grid-cols-1 gap-3">
			<!--			<form-maker-->
			<!--				v-if="theme===undefined"-->
			<!--				class="-mt-5"-->
			<!--				v-model="selectedTheme"-->
			<!--				type="theme"-->
			<!--			/>-->
			<div
				v-if="showLoading"
				class="h-[200px] grid place-items-center"
			>
				<div>Chargement des decks...</div>
			</div>
			<div
				v-else
				class="flex flex-wrap
						gap-3"
			>
				<sc-button
					v-for="deck in availableDecks"
					:key="`deck-${deck.id}`"
					@click="update(deck)"
					:outline="theValue?.id!==deck.id"
					:theme="selectedTheme"
					v-katex.auto="deck.title"
					xs
				/>
			</div>
		</div>
	</div>
</template>
