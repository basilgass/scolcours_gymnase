<script lang="ts" setup>
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import ParameterSchemaDialog from "@/Components/Generators/ParameterSchemaDialog.vue"
import type {GeneratorParameterSchemaEntry} from "@/types/challengeInterfaces.ts"
import ParameterSchemaLabel from "@/Components/Generators/ParameterSchemaLabel.vue"

const schema = defineModel<Record<string, GeneratorParameterSchemaEntry> | null>()

const dialogOpen = ref(false)
const editingKey = ref<string | undefined>(undefined)
const editingEntry = ref<GeneratorParameterSchemaEntry | undefined>(undefined)

const entries = computed(() => Object.entries(schema.value ?? {}))
const existingKeys = computed(() => Object.keys(schema.value ?? {}))

function openCreate() {
	editingKey.value = undefined
	editingEntry.value = undefined
	dialogOpen.value = true
}

function openEdit(key: string, entry: GeneratorParameterSchemaEntry) {
	editingKey.value = key
	editingEntry.value = entry
	dialogOpen.value = true
}

function onSave(key: string, entry: GeneratorParameterSchemaEntry, oldKey?: string) {
	const next = {...(schema.value ?? {})}
	if (oldKey && oldKey !== key) {
		delete next[oldKey]
	}
	next[key] = entry
	schema.value = next
}

function removeParam(key: string) {
	const next = {...(schema.value ?? {})}
	delete next[key]
	schema.value = Object.keys(next).length > 0 ? next : null
}
</script>

<template>
	<div class="bg-content rounded">
		<h3 class="font-semibold border-b border-content p-3 flex justify-between items-center">
			<span>paramètres acceptés</span>
			<sc-button
				type="add"
				xs
				@click="openCreate"
			>
				ajouter
			</sc-button>
		</h3>

		<div class="p-3 flex flex-col gap-2">
			<div
				v-if="entries.length === 0"
				class="text-sm text-gray-500 italic"
			>
				aucun paramètre — ce générateur ne reçoit aucune entrée
			</div>

			<div
				v-for="[key, entry] in entries"
				:key
				class="border border-gray-300 dark:border-gray-600 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
			>
				<div class="flex items-center justify-between gap-2">
					<ParameterSchemaLabel
						:key="key"
						:entry="entry"
						:label="key"
					/>
					<div class="flex items-center gap-1 shrink-0">
						<sc-button
							type="edit"
							xs
							@click="openEdit(key, entry)"
						>
							<i class="bi bi-pencil" />
						</sc-button>
						<confirm-button
							xs
							@confirm="removeParam(key)"
						>
							<i class="bi bi-trash" />
						</confirm-button>
					</div>
				</div>
			</div>
		</div>

		<parameter-schema-dialog
			v-model="dialogOpen"
			:entry="editingEntry"
			:existing-keys="existingKeys"
			:param-key="editingKey"
			@save="onSave"
		/>
	</div>
</template>
