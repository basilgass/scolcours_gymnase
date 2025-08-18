<script setup lang="ts">

import {CourseInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import dayjs from "dayjs"
import {computed} from "vue"
import {router} from "@inertiajs/vue3"

const props = defineProps<{
	course: CourseInterface
}>()

const editMode = useStoreEditMode()

const scheduledAt_formated = computed<string>(() => {
	return props.course.scheduled_at ? dayjs(props.course.scheduled_at).format('dddd DD MMMM YYYY à HH:mm') : null
})

</script>

<template>
	<Card
		class="transition-all"
		:class="{
			'opacity-40 hover:opacity-100': course.status==='not yet started'
		}"
	>
		<div
			class="flex justify-between py-4 cursor-pointer"
			@click="router.visit(route('students.courses.show', {course: course.slug}))"
		>
			<h1
				class="text-lg md:text-xl lg:text-2xl"
				v-katex.auto="course.title"
			/>
			<sc-button
				v-admin="editMode.enable"
				type="edit"
				icon
				xs
				:href="route('admin.courses.edit', {course: course.slug})"
			>
				éditer le cours
			</sc-button>
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

			<!--			<div class="flex justify-end">-->
			<!--				<sc-button-->
			<!--					xs-->
			<!--					type="primary"-->
			<!--					class="my-3"-->
			<!--					:href="route('students.courses.show', { course: course.slug })"-->
			<!--				>-->
			<!--					Commencer le cours <i class="bi bi-arrow-right" />-->
			<!--				</sc-button>-->
			<!--			</div>-->
		</template>
	</Card>
</template>

<style scoped>

</style>
