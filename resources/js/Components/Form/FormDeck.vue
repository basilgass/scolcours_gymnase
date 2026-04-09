<script lang="ts" setup>
import {onMounted, ref, useTemplateRef} from "vue"
import {DeckInterface, ThemeInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	theme?: ThemeInterface | number | undefined
}

const props = withDefaults(defineProps<Props>(), {theme: undefined})
const theValue = defineModel<DeckInterface>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const showLoading = ref(true)
const availableDecks = ref<DeckInterface[]>([])

function update(deck: DeckInterface) {
	if (props.disabled) return
	if (theValue.value?.id === deck.id) {
		theValue.value = undefined
		emits('update', undefined)
		return
	}
	theValue.value = deck
	emits('update', deck)
}

onMounted(() => {
	if (props.focus) inputRef.value?.focus()
	showLoading.value = true
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
})
</script>

<template>
	<div
		ref="input"
		class="w-full @container"
		:class="{ 'opacity-50 pointer-events-none select-none': props.disabled }"
		v-bind="$attrs"
	>
		<h4 class="font-semibold">Recherche d'un deck</h4>
		<div class="grid grid-cols-1 gap-3">
			<div
				v-if="showLoading"
				class="h-[200px] grid place-items-center"
			>
				<div>Chargement des decks...</div>
			</div>
			<div
				v-else
				class="flex flex-wrap gap-3"
			>
				<sc-button
					v-for="deck in availableDecks"
					:key="`deck-${deck.id}`"
					:outline="theValue?.id !== deck.id"
					v-katex.auto="deck.title"
					xs
					@click="update(deck)"
				/>
			</div>
		</div>
	</div>
</template>
