<script
	setup
	lang="ts"
	generic="T extends { id: number, title: string }"
>
import {computed, onMounted, onUnmounted, ref, useTemplateRef} from "vue"
import type {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import FormInput from "@/Components/Form/FormInput.vue"
import {AxiosErrorMessage} from "@/types"
import axios from "axios"
import {watchDebounced} from "@vueuse/core"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	fetch?: string
	list?: string[]
	labelMap?: (element: T) => string
	dynamic?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	labelMap: (element: T) => element.title,
	fetch: undefined,
	list: undefined,
	dynamic: false
})

const theValue = defineModel<T>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {errors, expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const open = ref(false)
const searchValue = ref("")
const choices = ref<T[]>([])

function onSelect(selection: T) {
	theValue.value = selection
	searchValue.value = labelCache.value.get(selection.id)
	errors.value = []
	emits('errors', errors.value)
	emits('update', theValue.value as unknown as Record<string, string>)
	open.value = false
}

function loadChoices() {
	if (props.list) {
		choices.value = props.list.map((title, id) => ({id, title})) as T[]
		return
	}
	if (props.fetch) {
		axios.get(props.fetch + (searchValue.value.length > 0 ? '?search=' + searchValue.value : ''))
			.then(res => { choices.value = res.data })
			.catch((err: AxiosErrorMessage) => {
				errors.value.push("Il y a un problème de chargement...")
				errors.value.push(err.response.data.message)
			})
	}
}

function normalize(str: string): string {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

const filteredChoices = computed(() => {
	if (props.dynamic || searchValue.value === "") return choices.value
	const search = normalize(searchValue.value)
	return choices.value.filter(item => normalize(item.title).includes(search))
})

const labelCache = computed(() => {
	const map = new Map<number, string>()
	for (const c of choices.value as T[]) {
		map.set(c.id, props.labelMap(c))
	}
	return map
})

function clickOutsideEvent(event: MouseEvent) {
	if (open.value && !(inputRef.value === event.target || inputRef.value?.contains(event.target as Node))) {
		open.value = false
	}
}

onMounted(() => {
	if (props.dynamic) {
		watchDebounced(searchValue, loadChoices, {debounce: 300, maxWait: 1000})
	} else {
		loadChoices()
	}
	document.body.addEventListener('click', clickOutsideEvent)
})
onUnmounted(() => document.body.removeEventListener('click', clickOutsideEvent))
</script>

<template>
	<div
		ref="input"
		class="relative"
		:class="{ 'opacity-50 pointer-events-none select-none': props.disabled }"
	>
		<form-input
			v-model="searchValue"
			:disabled="props.disabled"
			@focus="!props.disabled && (open = true)"
			@keyup.enter="emits('enter', searchValue)"
		/>
		<div
			v-show="open"
			class="select-menu absolute right-0 left-0 top-full mt-1 max-h-[300px] overflow-y-scroll shadow bg-content border rounded"
		>
			<div
				v-for="choice in filteredChoices"
				:key="`choice-${choice.id}`"
				v-katex.auto="labelCache.get(choice.id)"
				class="hover:bg-slate-100 px-2 py-3 cursor-pointer transition-all"
				@click="onSelect(choice as T)"
			/>
		</div>
	</div>
</template>
