<script
	setup
	lang="ts"
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {CourseInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"
import CourseCard from "@/Components/Courses/CourseCard.vue"

defineOptions({layout: LayoutMain})

// TODO: améliorer le dashboard
const props = defineProps<{
	teams: TeamInterface[],
	courses: CourseInterface[],
}>()

const teamsName = computed(() => props.teams.map(team => team.name).join(', '))

</script>
<template>
	<section class="">
		<div class="flex justify-between items-end">
			<div class="flex flex-col mt-2">
				<div class="font-extralight uppercase -mb-1">
					profil de
				</div>
				<div class="text-3xl">
					{{ $page.props.auth.user.fullname }}
				</div>
			</div>
			<sc-button
				v-admin
				type="admin"
				href="/admin/"
				class="hover:underline"
			>
				Administration
			</sc-button>
		</div>

		<div class="flex gap-3">
			<h3 class="font-semibold">
				équipes
			</h3>
			<div>{{ teamsName }}</div>
		</div>

		<div class="mt-24">
			<h3 class="text-xl uppercase font-extralight">
				Liste des cours
			</h3>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				<course-card
					v-for="course in courses"
					:key="`course-${course.id}`"
					:course
				/>
			</div>
		</div>
	</section>
</template>
