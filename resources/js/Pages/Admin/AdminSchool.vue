<script lang="ts" setup>

import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import SchoolTimetableManager from "@/Components/Admin/School/SchoolTimetableManager.vue"
import SchoolCalendarManager from "@/Components/Admin/School/SchoolCalendarManager.vue"
import type {SchoolCalendarInterface, SchoolTimetableInterface} from "@/types/modelInterfaces"

defineOptions({layout: LayoutAdmin})

const props = defineProps<{
	timetables: SchoolTimetableInterface[],
	calendars: SchoolCalendarInterface[]
}>()

</script>

<template>
	<main class="scolcours-container">
		<article-title title="école" />

		<section class="mb-10">
			<h2 class="text-xl mb-3">
				Horaires des périodes
			</h2>
			<school-timetable-manager :timetables="props.timetables" />
		</section>

		<section>
			<h2 class="text-xl mb-3">
				Calendrier scolaire
			</h2>
			<school-calendar-manager :calendars="props.calendars" />
		</section>
	</main>
</template>
