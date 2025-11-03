<script lang="ts" setup>

import {CourseInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import dayjs from "dayjs"
import {computed} from "vue"
import {router} from "@inertiajs/vue3"

const props = defineProps<{
	course: CourseInterface,
	team?: TeamInterface
}>()

const editMode = useStoreEditMode()

const scheduledAt_formated = computed<string>(() => {
	return props.course.scheduled_at ? dayjs(props.course.scheduled_at).format('dddd DD MMMM YYYY à HH:mm') : null
})

</script>

<template>
	<Card
		:class="{
			'opacity-40 hover:opacity-100': course.status==='not yet started'
		}"
		class="transition-all"
	>
		<template
			v-if="editMode.enable"
			#header
		>
			<div class="flex justify-between items-baseline">
				<div class="font-code text-xs">
					id: {{ course.id }}
				</div>
				<div
					v-admin="editMode.enable"
					class="flex gap-3"
				>
					<sc-button
						v-if="team"
						:href="route('admin.courses.dashboard', {course: course.slug, team: team.name})"
						type="primary"
						xs
					>
						voir la leçon
					</sc-button>
					<sc-button
						:href="route('admin.courses.edit', {course: course.slug})"
						icon
						type="edit"
						xs
					>
						éditer le cours
					</sc-button>
				</div>
			</div>
		</template>
		<div
			class="flex justify-between py-2 cursor-pointer"
			@click="router.visit(route('students.courses.show', {course: course.slug}))"
		>
			<h1
				v-katex.auto="course.title"
				class="text-lg md:text-xl lg:text-2xl"
			/>
		</div>

		<template #footer>
			<div class="text-xs text-slate-500 py-1 flex justify-between">
				<div v-if="course.status==='finished'">
					terminé le {{ scheduledAt_formated }}
				</div>
				<div v-else-if="course.status==='not yet started'">
					le cours n'a pas encore commencé
				</div>
				<div v-else>
					prochaine échéance : {{ scheduledAt_formated }}
				</div>
				<div>{{ course.lessons.length }} leçons</div>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
