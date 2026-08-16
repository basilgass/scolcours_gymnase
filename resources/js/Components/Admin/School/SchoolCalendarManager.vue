<script lang="ts" setup>

import {computed, ref} from "vue"
import axios from "axios"
import dayjs from "dayjs"
import FormInput from "@/Components/Form/FormInput.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import type {SchoolCalendarInterface} from "@/types/modelInterfaces"

const props = defineProps<{
	calendars: SchoolCalendarInterface[]
}>()

const flash = useStoreFlashMessage()

// Copie locale : mise à jour optimiste des bascules, remplacement complet à la génération.
const rows = ref<SchoolCalendarInterface[]>([...props.calendars])

// --- Formulaire de génération annuelle -------------------------------------

const start = ref("")
const end = ref("")
const excludedInput = ref("")
const excluded = ref<string[]>([])

function addExcluded() {
	const value = excludedInput.value
	if (value === "" || excluded.value.includes(value)) {
		return
	}
	excluded.value.push(value)
	excluded.value.sort()
	excludedInput.value = ""
}

function removeExcluded(date: string) {
	excluded.value = excluded.value.filter(d => d !== date)
}

function weekdayLabel(date: string): string {
	return dayjs(date).locale("fr").format("dddd DD.MM.YYYY")
}

const generating = ref(false)
const showConfirm = ref(false)

const canGenerate = computed(() => start.value !== "" && end.value !== "" && start.value < end.value)

function confirmGenerate() {
	generating.value = true
	axios.post(route("api.admin.school.calendars.generate"), {
		start:    start.value,
		end:      end.value,
		excluded: excluded.value,
	}).then(res => {
		rows.value = res.data
		showConfirm.value = false
		flash.success("Calendrier scolaire généré")
	}).catch(() => {
		flash.error("Erreur lors de la génération du calendrier")
	}).finally(() => {
		generating.value = false
	})
}

// --- Affichage groupé par semaine + bascule --------------------------------

const weeks = computed(() => {
	const map = new Map<number, SchoolCalendarInterface[]>()
	for (const row of rows.value) {
		const week = row.week ?? 0
		if (!map.has(week)) {
			map.set(week, [])
		}
		map.get(week)!.push(row)
	}
	return [...map.entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([week, days]) => ({
			week,
			days: days.sort((a, b) => a.day.localeCompare(b.day)),
		}))
})

function toggleDay(day: SchoolCalendarInterface) {
	const previous = day.school
	day.school = !day.school // optimiste
	axios.patch(route("api.admin.school.calendars.toggle", [day.id]))
		.then(res => {
			day.school = res.data.school
		})
		.catch(() => {
			day.school = previous // rollback
			flash.error("Erreur lors de la bascule du jour")
		})
}

</script>

<template>
	<div class="flex flex-col gap-6">
		<!-- Génération de l'année -->
		<div class="bg-content border p-5 flex flex-col gap-4">
			<h3 class="text-lg">
				Générer une année
			</h3>

			<div class="flex flex-wrap gap-4 items-end">
				<FormInput
					v-model="start"
					type="date"
					name="start"
					label="date de début"
					sm
				/>
				<FormInput
					v-model="end"
					type="date"
					name="end"
					label="date de fin"
					sm
				/>
			</div>

			<div>
				<div class="flex flex-wrap gap-3 items-end">
					<FormInput
						v-model="excludedInput"
						type="date"
						name="excluded"
						label="semaine à exclure (lundi)"
						sm
					/>
					<sc-button
						type="add"
						xs
						@click="addExcluded"
					>
						ajouter l'exclusion
					</sc-button>
				</div>

				<div
					v-if="excluded.length > 0"
					class="flex flex-wrap gap-2 mt-3"
				>
					<span
						v-for="date of excluded"
						:key="date"
						class="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm"
					>
						{{ weekdayLabel(date) }}
						<button
							type="button"
							class="text-red-500"
							@click="removeExcluded(date)"
						>
							<i class="bi bi-x-lg" />
						</button>
					</span>
				</div>
			</div>

			<div>
				<sc-button
					type="primary"
					:disabled="!canGenerate"
					@click="showConfirm = true"
				>
					générer le calendrier
				</sc-button>
			</div>
		</div>

		<!-- Grille des jours -->
		<div
			v-if="weeks.length > 0"
			class="flex flex-col gap-3"
		>
			<div
				v-for="{ week, days } of weeks"
				:key="week"
				class="bg-content border px-4 py-3 flex gap-4 items-center"
			>
				<div class="w-20 shrink-0 font-code">
					sem. {{ week }}
				</div>
				<div class="flex flex-wrap gap-2">
					<sc-button
						v-for="day of days"
						:key="day.id"
						xs
						:active="day.school"
						:outline="!day.school"
						@click="toggleDay(day)"
					>
						{{ weekdayLabel(day.day) }}
					</sc-button>
				</div>
			</div>
		</div>
		<div
			v-else
			class="text-sm italic"
		>
			Aucun jour dans le calendrier. Génère une année ci-dessus.
		</div>
	</div>

	<dialog-modal
		v-model="showConfirm"
		title="Confirmer la génération"
		class="w-120"
	>
		<div class="p-5">
			<p>
				Cette opération <strong>efface le calendrier existant</strong>
				et le régénère depuis les dates fournies.
			</p>
			<p class="mt-2 text-sm">
				Les jours désactivés manuellement seront perdus.
			</p>
		</div>
		<template #footer>
			<div class="flex gap-3 justify-end px-5 py-3">
				<sc-button
					type="primary"
					:disabled="generating"
					@click="confirmGenerate"
				>
					{{ generating ? "génération…" : "générer" }}
				</sc-button>
				<sc-button
					type="cancel"
					@click="showConfirm = false"
				>
					annuler
				</sc-button>
			</div>
		</template>
	</dialog-modal>
</template>
