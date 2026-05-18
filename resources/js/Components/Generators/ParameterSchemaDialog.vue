<script lang="ts" setup>
import {computed, nextTick, ref, useTemplateRef, watch} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import type {GeneratorParameterFormat, GeneratorParameterSchemaEntry} from "@/types/challengeInterfaces.ts"

const isOpen = defineModel<boolean>()

const props = defineProps<{
	paramKey?: string
	entry?: GeneratorParameterSchemaEntry
	existingKeys: string[]
}>()

const emits = defineEmits<{
	save: [paramKey: string, entry: GeneratorParameterSchemaEntry, oldKey?: string]
}>()

const FORMAT_CHOICES: Record<GeneratorParameterFormat, string> = {
	number: 'number',
	string: 'string',
	set: 'set'
}

const KEY_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/

const keyInput = ref('')
const formatInput = ref<GeneratorParameterFormat>('number')
const defaultInput = ref('')
const descriptionInput = ref('')

const isEdit = computed(() => props.paramKey !== undefined)

watch(isOpen, (open) => {
	if (open) {
		keyInput.value = props.paramKey ?? ''
		formatInput.value = props.entry?.format ?? 'number'
		defaultInput.value = props.entry?.default ?? ''
		descriptionInput.value = props.entry?.description ?? ''
		nextTick(() => keyRef.value?.focus?.())
	}
})

const keyError = computed(() => {
	const k = keyInput.value.trim()
	if (!k) return 'la clé est requise'
	if (!KEY_REGEX.test(k)) return 'clé invalide (identifiant JS : lettres, chiffres, _)'
	if (k !== props.paramKey && props.existingKeys.includes(k)) return 'clé déjà utilisée'
	return ''
})

const defaultError = computed(() => {
	if (!defaultInput.value.trim()) return 'valeur par défaut requise'
	return ''
})

const canSave = computed(() => !keyError.value && !defaultError.value)

const keyRef = useTemplateRef<{ focus?: () => void }>('keyRef')
const defaultRef = useTemplateRef<{ focus?: () => void }>('defaultRef')
const descriptionRef = useTemplateRef<{ focus?: () => void }>('descriptionRef')

function save() {
	if (!canSave.value) return
	const newKey = keyInput.value.trim()
	emits('save',
		newKey,
		{
			format: formatInput.value,
			default: defaultInput.value,
			description: descriptionInput.value.trim() || undefined
		},
		isEdit.value && newKey !== props.paramKey ? props.paramKey : undefined
	)
	isOpen.value = false
}

function cancel() {
	isOpen.value = false
}
</script>

<template>
	<dialog-modal
		v-model="isOpen"
		class="w-[500px] max-w-[90vw] p-4"
	>
		<template #header>
			<h3 class="font-semibold text-lg p-3 border-b border-content">
				{{ isEdit ? `édition du paramètre « ${paramKey} »` : 'nouveau paramètre' }}
			</h3>
		</template>

		<div class="flex flex-col gap-3 p-3">
			<div>
				<FormInput
					ref="keyRef"
					v-model="keyInput"
					inline-label
					label="clé"
					label-class="w-[100px]"
					name="paramKey"
					@keydown.enter.prevent="defaultRef?.focus?.()"
				/>
				<p
					v-if="keyError"
					class="text-red-600 text-xs ml-[100px] mt-1"
				>
					{{ keyError }}
				</p>
			</div>

			<FormSelect
				v-model="formatInput"
				:choices="FORMAT_CHOICES"
				inline-label
				label="format"
				label-class="w-[100px]"
				name="paramFormat"
			/>

			<div>
				<FormInput
					ref="defaultRef"
					v-model="defaultInput"
					inline-label
					label="défaut"
					label-class="w-[100px]"
					name="paramDefault"
					@keydown.enter.prevent="descriptionRef?.focus?.()"
				/>
				<p
					v-if="defaultError"
					class="text-red-600 text-xs ml-[100px] mt-1"
				>
					{{ defaultError }}
				</p>
			</div>

			<FormTextarea
				ref="descriptionRef"
				v-model="descriptionInput"
				:rows="2"
				inline-label
				label="description"
				label-class="w-[100px]"
				name="paramDescription"
				@keydown.enter.exact.prevent="save()"
			/>
		</div>

		<template #footer>
			<div class="flex justify-end gap-2 p-3 border-t border-content">
				<sc-button
					type="cancel"
					xs
					@click="cancel"
				>
					annuler
				</sc-button>
				<sc-button
					:disabled="!canSave"
					type="save"
					xs
					@click="save"
				>
					{{ isEdit ? 'enregistrer' : 'ajouter' }}
				</sc-button>
			</div>
		</template>
	</dialog-modal>
</template>
