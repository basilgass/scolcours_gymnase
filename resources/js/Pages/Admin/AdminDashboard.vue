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
	const team = props.teams.find(team => team.id === id)
	if (!team) throw new Error(`Team ${id} introuvable dans props.teams`)
	return team
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


interface IAdminCard {
	label: string,
	href: string,
}

const cards: IAdminCard[] = [
	{label: "utilisateurs", href: route('admin.users.index')},
	{label: "équipes", href: route('admin.teams.index')},
	{label: "cours", href: route('admin.courses.index')},
	{label: "agenda", href: route('admin.agenda')},
	{label: "générateurs", href: route('admin.generators.index')},
	{label: "challenges", href: route('admin.challenges.index')},
	{label: "quizz", href: route('admin.quizzes.index')},
	{label: "évaluations", href: route('admin.evaluations.index')},
]
</script>
<template>
	<section>
		<article
			v-if="courses.length>0"
		>
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
								class="w-20"
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

		<article
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto"
		>
			<template
				v-for="card in cards"
				:key="card.label"
			>
				<sc-button
					class="w-full aspect-4/3 text-3xl!"
					:href="card.href"
					type="card"
				>
					{{ card.label }}
				</sc-button>
			</template>
		</article>
	</section>
</template>
