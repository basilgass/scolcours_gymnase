import {describe, expect, test} from "vitest"
import {defineComponent, h} from "vue"
import {mountComponent} from "../../support/mountComponent.ts"
import type {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"

import LessonDrops from "@/Components/Courses/LessonDrops.vue"

// Stub de l'item : expose l'id en attribut pour asserter l'appartenance à un encadré.
const LessonDrop = defineComponent({
	props: {lesson: {type: Object, required: true}, course: {type: Object, default: () => ({})}},
	setup: (p) => () => h("div", {class: "lesson-drop", "data-id": (p.lesson as LessonInterface).id}),
})

const stubs = {LessonDrop}

function makeLesson(overrides: Partial<LessonInterface> = {}): LessonInterface {
	return {
		id: 1,
		title: "Leçon",
		homework: false,
		deadline: false,
		scheduled_at: "2026-09-07T08:15",
		...overrides,
	} as unknown as LessonInterface
}

function mountDrops(lessons: LessonInterface[]) {
	return mountComponent(LessonDrops, {
		props: {course: {} as CourseInterface, lessons},
		stubs,
	})
}

function idsIn(wrapper: ReturnType<typeof mountDrops>, selector: string): number[] {
	return wrapper.get(selector)
		.findAll("[data-id]")
		.map(el => Number(el.attributes("data-id")))
}

describe("LessonDrops", () => {
	const lessons = [
		makeLesson({id: 10, homework: false, deadline: false}), // leçon en classe
		makeLesson({id: 11, homework: true, deadline: false}),  // devoir
		makeLesson({id: 12, homework: true, deadline: true}),   // échéance
	]

	test("le devoir est dans l'encadré orange, sous l'inter-titre", () => {
		const wrapper = mountDrops(lessons)
		const orange = wrapper.get(".border-orange-400")
		expect(orange.text()).toContain("Devoirs")
		expect(idsIn(wrapper, ".border-orange-400")).toEqual([11])
	})

	test("l'échéance est dans l'encadré vert, sous l'inter-titre", () => {
		const wrapper = mountDrops(lessons)
		const green = wrapper.get(".border-green-400")
		expect(green.text()).toContain("Échéance")
		expect(green.findAll("[data-id]").map(el => Number(el.attributes("data-id")))).toEqual([12])
	})

	test("la leçon en classe n'est dans aucun encadré coloré", () => {
		const wrapper = mountDrops(lessons)
		expect(idsIn(wrapper, ".border-orange-400")).not.toContain(10)
		expect(idsIn(wrapper, ".border-green-400")).not.toContain(10)
		// Mais elle est bien rendue quelque part.
		expect(wrapper.findAll("[data-id]").map(el => Number(el.attributes("data-id")))).toContain(10)
	})

	test("les encadrés colorés n'apparaissent pas sans contenu", () => {
		const wrapper = mountDrops([makeLesson({id: 20, homework: false, deadline: false})])
		expect(wrapper.find(".border-orange-400").exists()).toBe(false)
		expect(wrapper.find(".border-green-400").exists()).toBe(false)
	})
})
