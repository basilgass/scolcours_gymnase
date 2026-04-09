<script
	lang="ts"
	setup
>
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import {CourseInterface, LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import dayjs from "dayjs"

defineOptions({layout: LayoutAdmin})

interface LessonAdminInterface extends LessonInterface {
	calendars: { team_id: number, scheduled_at: string }[]
}

interface CourseAdminInterface extends CourseInterface {
	lessons: LessonAdminInterface[]
}

const props = defineProps<{
	courses: CourseAdminInterface[],
	teams: TeamInterface[]
}>()

function getTeam(id: number): TeamInterface {
	return props.teams.find(team => team.id === id)
}

function CourseTeams(course: CourseAdminInterface) {
	const teams = new Set<string>()

	course.lessons.forEach(lesson => {
		lesson.calendars.forEach(cal => teams.add(getTeam(cal.team_id).name))
	})

	return [...teams].toSorted().join(', ')
}

function nextLessonByTeam(course: CourseAdminInterface): Record<string, string> {
	const arr: Record<string, string> = {}

	course.lessons.forEach(lesson => {
		lesson.calendars
			.forEach(cal => {
				const name = getTeam(cal.team_id).name

				if (!arr[name]) arr[name] = cal.scheduled_at

				if (arr[name] > cal.scheduled_at) arr[name] = cal.scheduled_at
			})
	})

	return arr
}

</script>
<template>
	<section class="flex w-full">
		<article class="flex-1">
			<h2 class="uppercase text-3xl mb-10">
				Cours en cours
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<Card
					v-for="course in courses"
					:key="course.id"
				>
					<template #header>
						<h3
							v-katex.auto="course.title"
							class="font-lg md:font-xl font-semibold"
						/>
					</template>

					<div class="space-y-3">
						<div
							v-for="(scheduled_at, name) in nextLessonByTeam(course)"
							:key="`lesson-${course.id}-${name}`"
							class="flex gap-3 items-baseline"
						>
							<sc-button
								type="primary"
								xs
								:href="route('admin.courses.teams.dashboard', { course: course.id, team: name })"
								class="w-[80px]"
							>
								{{ name }}
							</sc-button>

							{{ dayjs(scheduled_at).format('DD.MM.YYYY à HH[h]mm') }}
						</div>
					</div>

					<template #footer>
						{{ CourseTeams(course) }}
					</template>
				</card>
			</div>
		</article>
	</section>
</template>
