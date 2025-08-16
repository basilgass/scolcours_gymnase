<script setup lang="ts">

import {CourseInterface} from "@/types/modelInterfaces.ts"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

const props = defineProps<{
	course: CourseInterface
}>()

const editMode = useStoreEditMode()
</script>

<template>
	<Card>
		<template #header>
			<div class="flex justify-between">
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
		</template>

		<block-show
			v-if="course.block"
			:block="course.block"
		/>
		<div
			v-else
			class="font-code"
		>
			Il n'y a pas de description pour ce cours... quel dommage !
		</div>

		<template #footer>
			<div class="flex justify-end">
				<sc-button
					xs
					type="primary"
					class="my-3"
					:href="route('students.courses.show', { course: course.slug })"
				>
					Commencer le cours <i class="bi bi-arrow-right" />
				</sc-button>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
