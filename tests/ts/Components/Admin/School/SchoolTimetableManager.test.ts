import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {defineComponent, h} from "vue"
import {flushPromises} from "@vue/test-utils"
import axios from "axios"
import {mockRoute, mountComponent} from "../../../support/mountComponent.ts"
import type {SchoolTimetableInterface} from "@/types/modelInterfaces.ts"

vi.mock("axios", () => ({
	default: {patch: vi.fn(() => Promise.resolve({data: {}}))},
}))

import SchoolTimetableManager from "@/Components/Admin/School/SchoolTimetableManager.vue"

// Stub FormInput : input natif portant `data-name`, relayant v-model et le blur.
const FormInput = defineComponent({
	props: {modelValue: {default: ""}, name: {default: ""}},
	emits: ["update:modelValue", "blur"],
	setup: (p, {emit}) => () => h("input", {
		"class":     "form-input",
		"data-name": p.name,
		"value":     p.modelValue,
		"onInput":   (e: Event) => emit("update:modelValue", (e.target as HTMLInputElement).value),
		"onBlur":    () => emit("blur"),
	}),
})

const stubs = {FormInput}

function makeTimetable(overrides: Partial<SchoolTimetableInterface> = {}): SchoolTimetableInterface {
	return {id: 1, period: 1, start: "08:00", end: "08:45", ...overrides}
}

beforeEach(() => {
	vi.stubGlobal("route", mockRoute)
	vi.mocked(axios.patch).mockResolvedValue({data: {start: "08:00", end: "08:45"}})
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.clearAllMocks()
})

describe("SchoolTimetableManager", () => {
	test("affiche une ligne par période", () => {
		const wrapper = mountComponent(SchoolTimetableManager, {
			props: {timetables: [makeTimetable({id: 1, period: 1}), makeTimetable({id: 2, period: 2})]},
			stubs,
		})

		expect(wrapper.findAll("tbody tr")).toHaveLength(2)
	})

	test("le blur persiste l'horaire courant", async () => {
		const wrapper = mountComponent(SchoolTimetableManager, {
			props: {timetables: [makeTimetable({id: 7, start: "08:00", end: "08:45"})]},
			stubs,
		})

		await wrapper.find('input[data-name="start"]').trigger("blur")
		await flushPromises()

		expect(axios.patch).toHaveBeenCalledWith(
			"/api.admin.school.timetables.update/7",
			{start: "08:00", end: "08:45"},
		)
	})

	test("l'édition d'une heure part dans la charge utile", async () => {
		const wrapper = mountComponent(SchoolTimetableManager, {
			props: {timetables: [makeTimetable({id: 3, start: "08:00", end: "08:45"})]},
			stubs,
		})

		await wrapper.find('input[data-name="start"]').setValue("09:30")
		await wrapper.find('input[data-name="start"]').trigger("blur")
		await flushPromises()

		expect(axios.patch).toHaveBeenCalledWith(
			"/api.admin.school.timetables.update/3",
			{start: "09:30", end: "08:45"},
		)
	})

	test("l'échec de sauvegarde n'interrompt pas le composant", async () => {
		vi.mocked(axios.patch).mockRejectedValueOnce(new Error("boom"))
		const wrapper = mountComponent(SchoolTimetableManager, {
			props: {timetables: [makeTimetable({id: 9})]},
			stubs,
		})

		await wrapper.find('input[data-name="end"]').trigger("blur")
		await flushPromises()

		expect(axios.patch).toHaveBeenCalledOnce()
		expect(wrapper.findAll("tbody tr")).toHaveLength(1)
	})
})
