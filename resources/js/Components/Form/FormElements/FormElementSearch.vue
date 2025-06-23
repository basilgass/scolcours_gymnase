<script
	setup
	lang="ts"
	generic="T extends
	{
		id: number,
		title: string
	}"
>
import {computed, onMounted, onUnmounted, ref, useTemplateRef} from "vue"
import type {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {AxiosErrorMessage} from "@/types"
import axios from "axios"
import {watchDebounced} from "@vueuse/core"

defineOptions({
	inheritAttrs: false
})

const theValue = defineModel<T>()
const input = useTemplateRef<HTMLDivElement>('input')
const errors = ref<string[]>([])

const props = withDefaults(defineProps<FormMakerPropsNewType & {
		fetch?: string
		list?: string[],
		labelMap?: (element: T) => string,
		dynamic?: boolean
	}>(),
	{
		labelMap: (element: T) => {
			return element.title
		},
		fetch: undefined,
		list: undefined,
		dynamic: false
	})

defineExpose<FormElementExpose>({
	focus: () => input.value?.focus(),
	validate
})

const emits = defineEmits<FormElementEmits>()

function validate(): string[] {
	return []
}

function onChange() {
	errors.value = validate()
	emits('errors', errors.value)
	emits('update', theValue.value as unknown as Record<string, string>)
}

const open = ref<boolean>(false)

function onSelect(selection: T) {

	theValue.value = selection
	searchValue.value = labelCache.value.get(selection.id)

	onChange()

	open.value = false
}

const searchValue = ref<string>("")
const choices = ref<T[]>([])

function loadChoices() {
	if(props.list){
		choices.value = props.list.map((title, id) => ({ id, title })) as T[]
		return
	}

	if(props.fetch) {
		axios.get(props.fetch + (searchValue.value.length > 0 ? '?search=' + searchValue.value : ''))
			.then(res => {
				choices.value = res.data
			})
			.catch((err: AxiosErrorMessage) => {
				errors.value.push("Il y a un problème de chargement...")
				errors.value.push(err.response.data.message)
			})
	}

	return []
}

function normalize(str: string): string {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}
const filteredChoices = computed(()=>{
	if(props.dynamic || searchValue.value===""){
		return choices.value
	}

	const search = normalize(searchValue.value)
	return choices.value.filter(item =>
		normalize(item.title).includes(search)
	)
})


const labelCache = computed(() => {
	const map = new Map<number, string>()

	for (const c of choices.value as T[]) {
		map.set(c.id, props.labelMap(c))
	}
	return map
})


function clickOutsideEvent(event: MouseEvent) {
	if (open.value && !(input.value === event.target || input.value.contains(event.target as Node))) {
		open.value = false
	}
}

onMounted(() => {
	if(props.dynamic) {
		watchDebounced(searchValue, loadChoices, {debounce: 300, maxWait: 1000})
	}else {
		loadChoices()
	}
	document.body.addEventListener('click', clickOutsideEvent)
})

onUnmounted(() => {
	document.body.removeEventListener('click', clickOutsideEvent)
})

</script>

<template>
	<div
		class="relative"
		ref="input"
	>
		<form-maker
			type="text"
			v-model="searchValue"
			@focus="open=true"
			@keyup.enter="emits('enter', searchValue)"
		/>
		<div
			v-show="open"
			class="select-menu
						absolute right-0 left-0 top-full
						mt-1
						max-h-[300px] overflow-y-scroll
						shadow bg-content border rounded"
		>
			<div
				v-for="choice in filteredChoices"
				:key="`choice-${choice.id}`"
				class="hover:bg-slate-100 px-2 py-3 cursor-pointer transition-all"
				@click="onSelect(choice as T)"
				v-katex.auto="labelCache.get(choice.id)"
			/>
		</div>
	</div>
</template>
