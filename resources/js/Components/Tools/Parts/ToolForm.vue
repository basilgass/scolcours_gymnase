<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import {FormMakerInputsType} from "@/Components/Form/FormMakerInterface"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {useClipboard} from "@vueuse/core"
import {computed, ComputedRef, inject, ref, Ref, watch} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {router} from "@inertiajs/vue3"

export interface IToolForm {
	label: string | ComputedRef<string>
	type?: FormMakerInputsType
	value: Ref<string | boolean | number>
	fromUrl?: string,
	message?: string,
	itemClass?: string,
	inline?: boolean,
	emit?: boolean
}

const toolSlug = inject("toolSlug")

// Define the props
const props = withDefaults(defineProps<{
		forms: IToolForm[],
		formClass?: string,
		active?: number | null,
		store?: boolean,
		generateButton?: boolean
	}>(),
	{
		formClass: "",
		active: null,
		store: true,
		generateButton: false
	}
)

const {storeTool, resetTool} = useToolsStorage()

const link = computed(() => {
	const url = `https://g.scolcours.ch/tools/${toolSlug}`

	const items = props.forms.filter(f => f.fromUrl)

	if (items.length === 0) return url

	const query = new URLSearchParams()
	items.forEach(f => query.append(f.fromUrl, f.value.value as string))

	return url + `?${query.toString()}`
})

const formComponents = ref<InstanceType<typeof FormMaker>[]>([])

function addFormRef(element: InstanceType<typeof FormMaker>) {
	if (formComponents.value.indexOf(element) === -1) {
		formComponents.value.push(element)
	}
}

const {copy, copied} = useClipboard()

// Allow to change the focus based on the active state.
watch(() => props.active, () => {
	if (props.active !== null) {
		formComponents.value[props.active].focus()
	}
})

const showForm = ref(true)

const emits = defineEmits(['updateForm', 'generate'])

function onChange(item: IToolForm) {
	storeTool(props.forms)
	if (item.emit) {
		emits('updateForm')
	}
}

function resetFormTool(){
	resetTool()

	router.reload()
}


</script>

<template>
	<form
		class="border-b -mx-3 px-3 pb-3"
		@submit.prevent
	>
		<div class="flex justify-between">
			<h3>Données</h3>
			<div class="flex gap-3">
				<sc-button
					v-if="generateButton"
					xs
					type="primary"
					@click="emits('generate')"
				>
					générer
				</sc-button>

				<button @click="resetFormTool">
					@
				</button>
				<button>
					<i
						:class="copied ? 'bi-check-lg text-green-600' : 'bi-share text-gray-400'"
						class="bi text-lg"
						@click="copy(link)"
					/>
				</button>

				<button @click="showForm = !showForm">
					<i
						class="text-gray-400"
						:class="{
							'bi bi-code': !showForm,
							'bi bi-x-lg': showForm
						}"
					/>
				</button>
			</div>
		</div>

		<div
			:class="formClass"
			v-show="showForm"
		>
			<form-maker
				v-for="(f, index) in forms"
				:key="`form-${index}`"
				:ref="addFormRef"
				v-model="f.value.value"
				:class="f.itemClass?f.itemClass:''"
				:focus="active === index"
				:from-url="f.fromUrl ?? null"
				:label="(typeof f.label==='string') ? f.label : f.label.value"
				:message="f.message"
				:type="f.type? f.type : 'text'"
				font-code
				message-class="text-xs!"
				:inline-label="f.inline"
				v-bind="$attrs"
				@change="onChange(f)"
			/>
		</div>

		<slot />
	</form>
</template>


