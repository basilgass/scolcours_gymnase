<script lang="ts" setup>

import FormInput from "@/Components/Form/FormInput.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import FormCodearea from "@/Components/Form/FormCodearea.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormFraction from "@/Components/Form/FormFraction.vue"
import FormVector from "@/Components/Form/FormVector.vue"
import {FormComponentType} from "@/Components/Form/FormMakerInterface"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {useClipboard} from "@vueuse/core"
import {type Component, computed, ComputedRef, inject, onMounted, ref, Ref, watch} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {router} from "@inertiajs/vue3"
import Card from "@/Components/Ui/Card.vue"

const componentMap: Partial<Record<FormComponentType, Component>> = {
	switch: FormSwitch,
	codearea: FormCodearea,
	textarea: FormTextarea,
	fraction: FormFraction,
	vector: FormVector,
}

function resolveFormComponent(type?: FormComponentType): Component {
	return componentMap[type] ?? FormInput
}

export interface IToolForm {
	label: string | ComputedRef<string>
	type?: FormComponentType
	value: Ref<string | boolean | number>
	fromUrl?: string,
	message?: string,
	itemClass?: string,
	inline?: boolean,
	emit?: boolean,
	attributes?: Record<string, unknown>
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
		generateButton: false,
	}
)

const {storeTool, resetTool} = useToolsStorage()

const link = computed(() => {
	const url = `${import.meta.env.VITE_APP_URL}/tools/${toolSlug}`

	const items = props.forms.filter(f => f.fromUrl)

	if (items.length === 0) return url

	const query = new URLSearchParams()
	items.forEach(f => query.append(f.fromUrl, f.value.value as string))

	return url + `?${query.toString()}`
})

const formComponents = ref<{ focus?: () => void }[]>([])

function addFormRef(element: { focus?: () => void }) {
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

function resetFormTool() {
	resetTool()
	router.visit(
		route('tools.show', {tool: toolSlug})
	)
}

function restoreFromUri() {
	// On récupère les données de l'URL si elles existent.
	const urlParams = new URLSearchParams(window.location.search)

	for (const [key, value] of urlParams) {
		const form = props.forms.find(f => f.fromUrl === key)

		if (form) {
			form.value.value = value
		}
	}

	emits('updateForm')
}


onMounted(() => {
	restoreFromUri()
})

// TODO: v-bind="$attrs" ne doit pas trasnmettre la class.

</script>

<template>
	<Card>
		<template #header>
			<div class="flex justify-between">
				<h3
					@click="showForm = !showForm"
					class="cursor-pointer text-xl"
				>
					Données
				</h3>

				<div class="flex gap-3 text-gray-400">
					<sc-button
						v-if="generateButton"
						xs
						type="generate"
						icon
						@click="emits('generate')"
					>
						générer
					</sc-button>

					<button
						@click="resetFormTool"
						class="cursor-pointer"
						title="Réinitialiser les données"
					>
						@
					</button>
					<button class="cursor-pointer">
						<i
							:class="copied ? 'bi-check-lg text-green-600' : 'bi-share'"
							class="bi text-lg "
							@click="copy(link)"
							title="Copier le lien"
						/>
					</button>

					<button
						@click="showForm = !showForm"
						class="cursor-pointer"
						title="Afficher le formulaire"
					>
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
		</template>
		<div
			:class="formClass"
			v-show="showForm"
		>
			<component
				:is="resolveFormComponent(f.type)"
				v-for="(f, index) in forms"
				:key="`form-${index}`"
				:ref="addFormRef"
				v-model="f.value.value"
				:class="f.itemClass?f.itemClass:''"
				:focus="active === index"
				:from-url="f.fromUrl ?? null"
				:label="(typeof f.label==='string') ? f.label : f.label.value"
				:message="f.message"
				:type="f.type"
				font-code
				message-class="text-xs!"
				:inline-label="f.inline"
				@change="onChange(f)"
				v-bind.attr="f.attributes"
			/>
		</div>

		<slot />
	</Card>
</template>


