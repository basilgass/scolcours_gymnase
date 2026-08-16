<script lang="ts" setup>

import {ref} from "vue"
import axios from "axios"
import FormInput from "@/Components/Form/FormInput.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import type {SchoolTimetableInterface} from "@/types/modelInterfaces"

const props = defineProps<{
	timetables: SchoolTimetableInterface[]
}>()

const flash = useStoreFlashMessage()

// Copie locale éditable : le v-model agit dessus, la sauvegarde part au blur.
const rows = ref<SchoolTimetableInterface[]>(props.timetables.map(t => ({...t})))

function save(row: SchoolTimetableInterface) {
	axios.patch(route("api.admin.school.timetables.update", [row.id]), {
		start: row.start,
		end:   row.end,
	}).then(res => {
		row.start = res.data.start
		row.end = res.data.end
		flash.success(`Période ${row.period} mise à jour`)
	}).catch(() => {
		flash.error("Erreur lors de la mise à jour de l'horaire")
	})
}

</script>

<template>
	<div class="bg-content border">
		<table class="w-full text-left">
			<thead class="border-b">
				<tr>
					<th class="px-4 py-2 w-24">
						Période
					</th>
					<th class="px-4 py-2">
						Début
					</th>
					<th class="px-4 py-2">
						Fin
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row of rows"
					:key="row.id"
					class="border-b last:border-b-0"
				>
					<td class="px-4 py-2 font-code">
						{{ row.period }}
					</td>
					<td class="px-4 py-2 w-40">
						<FormInput
							v-model="row.start"
							type="time"
							name="start"
							sm
							@blur="save(row)"
						/>
					</td>
					<td class="px-4 py-2 w-40">
						<FormInput
							v-model="row.end"
							type="time"
							name="end"
							sm
							@blur="save(row)"
						/>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
