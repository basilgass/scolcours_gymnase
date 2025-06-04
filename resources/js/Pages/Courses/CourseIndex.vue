<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CourseInterface} from "@/types/modelInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})

defineProps<{
	courses: CourseInterface[]
}>()
</script>

<template>
	<div>
		<Card
			v-for="course in courses"
			:key="course.id"
		>
			<template #header>
				<h1
					class="text-lg md:text-xl lg:text-2xl"
					v-katex.auto="course.title"
				/>
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

			<template
				#footer
			>
				<div class="flex justify-end">
					<sc-button
						xs
						type="primary"
						class="my-3"
						:href="route('courses.show', {course: course.slug})"
					>
						Commencer le cours <i class="bi bi-arrow-right" />
					</sc-button>
				</div>
			</template>
		</Card>
	</div>
</template>

<style scoped>

</style>
