<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import { FormMakerInputsType } from "@/Components/Form/FormMakerInterface"
import { computed, ComputedRef, inject, PropType, ref, Ref, watch } from "vue"
import { useClipboard } from "@vueuse/core"

export interface IToolForm {
	label: string | ComputedRef<string>
	type?: FormMakerInputsType
	value: Ref<string | boolean | number>
	fromUrl?: string,
	message?: string,
	itemClass?: string,
	inline?: boolean
}

// Define the props
const props = defineProps({
	forms: { type: Object as PropType<IToolForm[]>, required: true },
	formClass: { type: String, default: "" },
	active: { type: Number, default: null }
})

const tool = inject<Ref<string>>("toolData", ref(""))
const link = computed(() => {
	const url = `https://g.scolcours.ch/tools/${tool.value}`

	const items = props.forms.filter(f => f.fromUrl)

	if(items.length=== 0) return url

	const query = new URLSearchParams()
	items.forEach(f => query.append(f.fromUrl, f.value.value as string))
	
	return url + `?${query.toString()}`
})

const formComponents = ref<Array<InstanceType<typeof FormMaker>>>([])

function addFormRef(element: InstanceType<typeof FormMaker>) {
	if (formComponents.value.indexOf(element) === -1) {
		formComponents.value.push(element)
	}
}

const { copy, copied } = useClipboard()

// Allow to change the focus based on the active state.
watch(() => props.active, () => {
	if (props.active !== null) {
		formComponents.value[props.active].focus()
	}
})

</script>

<template>
	<form
		class="border-b -mx-3 px-3 pb-3"
		@submit.prevent
	>
		<div class="flex justify-between">
			<h3>Données</h3>
			<button>
				<i
					:class="copied ? 'bi-check-lg text-green-600' : 'bi-share text-gray-400'"
					class="bi text-lg"
					@click="copy(link)"
				/>
			</button>
		</div>

		<div :class="formClass">
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
				message-class="text-xs"
				:inline-label="f.inline"
			/>
		</div>

		<slot />
	</form>
</template>

<style scoped>

</style>
