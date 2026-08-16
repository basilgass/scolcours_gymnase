import {describe, expect, test} from "vitest"
import {defineComponent, h} from "vue"
import dayjs, {Dayjs} from "dayjs"
import {mountComponent} from "../../support/mountComponent.ts"
import type {LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import type {weekCalendarInterface} from "@/types/lessonInterfaces.ts"

import CourseWeekTimetable from "@/Components/Courses/CourseWeekTimetable.vue"

// Card rend simplement ses slots (header + default) ; LessonTypeIcon est neutralisé.
const Card = defineComponent({
	setup: (_, {slots}) => () => h("div", {class: "card"}, [slots.header?.(), slots.default?.()]),
})
const LessonTypeIcon = defineComponent({setup: () => () => h("span", {class: "lesson-icon"})})

const stubs = {Card, LessonTypeIcon}

// Semaine de référence : lundi 2026-09-07 → vendredi 2026-09-11.
const MONDAY = dayjs("2026-09-07")

function dayOf(weekday: number): Dayjs {
	return MONDAY.add(weekday - 1, "days")
}

/**
 * Construit une leçon minimale : le composant ne lit que id/title/label/homework/
 * deadline (l'icône du lessonable est stubée), donc on caste le reste.
 */
function makeLesson(overrides: Partial<LessonInterface> = {}): LessonInterface {
	return {
		id: 1,
		title: "Leçon",
		homework: false,
		deadline: false,
		...overrides,
	} as unknown as LessonInterface
}

// Équipe A présente lundi (1) et mardi (2) uniquement.
const team: TeamInterface = {
	id: 1,
	name: "A",
	active: true,
	calendar: [
		{id: 1, day: 1, school_timetable_id: 1, time: "08:15"},
		{id: 2, day: 2, school_timetable_id: 1, time: "08:15"},
	],
}

// Jours scolaires : lundi→jeudi actifs, vendredi (5) NON scolaire.
const days = [1, 2, 3, 4, 5].map(weekday => ({
	day: dayOf(weekday),
	active: weekday !== 5,
}))

function calItem(weekday: number, lesson: LessonInterface): weekCalendarInterface {
	return {day: dayOf(weekday), lesson, team}
}

function mountTimetable(calendar: weekCalendarInterface[]) {
	return mountComponent(CourseWeekTimetable, {
		props: {
			week: 1,
			from: MONDAY,
			to: dayOf(5),
			calendar,
			days,
			teams: [team],
		},
		stubs,
	})
}

function cell(wrapper: ReturnType<typeof mountTimetable>, band: string, weekday: number) {
	return wrapper.get(`[data-band="${band}"][data-weekday="${weekday}"]`)
}

// dataTransfer minimal : le drag transporte l'identité de la leçon à déplacer.
function dropOn(cellWrapper: ReturnType<typeof cell>) {
	const source = {lesson_id: 1, team_id: 1}
	return cellWrapper.trigger("drop", {
		dataTransfer: {getData: () => JSON.stringify(source)},
	})
}

describe("CourseWeekTimetable", () => {
	test("route chaque item dans sa bande (devoir / leçon / échéance)", () => {
		const wrapper = mountTimetable([
			calItem(1, makeLesson({id: 10, title: "En classe", homework: false, deadline: false})),
			calItem(1, makeLesson({id: 11, title: "Devoir maison", homework: true, deadline: false})),
			calItem(3, makeLesson({id: 12, title: "À rendre", homework: true, deadline: true})),
		])

		expect(cell(wrapper, "lesson", 1).text()).toContain("En classe")
		expect(cell(wrapper, "lesson", 1).text()).not.toContain("Devoir maison")

		expect(cell(wrapper, "homework", 1).text()).toContain("Devoir maison")
		expect(cell(wrapper, "homework", 1).text()).not.toContain("À rendre")

		expect(cell(wrapper, "deadline", 3).text()).toContain("À rendre")
	})

	test("drop sur la bande échéance émet deadline:true même hors jour de présence", async () => {
		const wrapper = mountTimetable([])

		// Mercredi (3) : jour scolaire mais SANS présence de l'équipe.
		await dropOn(cell(wrapper, "deadline", 3))

		const events = wrapper.emitted("drop")
		expect(events).toHaveLength(1)
		const payload = events![0][0] as {homework: boolean, deadline: boolean, target: Dayjs}
		expect(payload.deadline).toBe(true)
		expect(payload.homework).toBe(true)
		expect(payload.target.format("YYYY-MM-DD")).toBe("2026-09-09")
	})

	test("drop sur devoirs/leçons émet les bons flags sur un jour de présence", async () => {
		const wrapper = mountTimetable([])

		await dropOn(cell(wrapper, "homework", 1))
		await dropOn(cell(wrapper, "lesson", 1))

		const events = wrapper.emitted("drop")!
		expect(events).toHaveLength(2)
		expect(events[0][0]).toMatchObject({homework: true, deadline: false})
		expect(events[1][0]).toMatchObject({homework: false, deadline: false})
	})

	test("un jour non-scolaire refuse tout drop", async () => {
		const wrapper = mountTimetable([])

		// Vendredi (5) = non scolaire → aucune bande ne doit accepter.
		await dropOn(cell(wrapper, "deadline", 5))
		await dropOn(cell(wrapper, "homework", 5))
		await dropOn(cell(wrapper, "lesson", 5))

		expect(wrapper.emitted("drop")).toBeUndefined()
	})

	test("devoirs/leçons refusent un jour scolaire sans présence", async () => {
		const wrapper = mountTimetable([])

		// Mercredi (3) : scolaire mais sans présence → devoir/leçon rejetés.
		await dropOn(cell(wrapper, "homework", 3))
		await dropOn(cell(wrapper, "lesson", 3))

		expect(wrapper.emitted("drop")).toBeUndefined()
	})

	test("une cellule non droppable porte cursor-not-allowed", () => {
		const wrapper = mountTimetable([])

		// Vendredi non scolaire.
		expect(cell(wrapper, "deadline", 5).classes()).toContain("cursor-not-allowed")
		// Mercredi sans présence, bande devoirs.
		expect(cell(wrapper, "homework", 3).classes()).toContain("cursor-not-allowed")
		// Mercredi scolaire, bande échéance → droppable.
		expect(cell(wrapper, "deadline", 3).classes()).not.toContain("cursor-not-allowed")
	})
})
