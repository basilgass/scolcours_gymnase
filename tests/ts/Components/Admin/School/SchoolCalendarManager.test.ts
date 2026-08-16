import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {defineComponent, h} from "vue"
import {flushPromises, VueWrapper} from "@vue/test-utils"
import axios from "axios"
import {mockRoute, mountComponent} from "../../../support/mountComponent.ts"
import type {SchoolCalendarInterface} from "@/types/modelInterfaces.ts"

vi.mock("axios", () => ({
	default: {
		patch: vi.fn(() => Promise.resolve({data: {}})),
		post:  vi.fn(() => Promise.resolve({data: []})),
	},
}))

import SchoolCalendarManager from "@/Components/Admin/School/SchoolCalendarManager.vue"

// Stub FormInput : input natif portant `data-name`, relayant v-model.
const FormInput = defineComponent({
	props: {modelValue: {default: ""}, name: {default: ""}},
	emits: ["update:modelValue", "blur"],
	setup: (p, {emit}) => () => h("input", {
		"class":     "form-input",
		"data-name": p.name,
		"value":     p.modelValue,
		"onInput":   (e: Event) => emit("update:modelValue", (e.target as HTMLInputElement).value),
	}),
})

// Stub ScButton : bouton natif transmettant `disabled` et émettant `click`.
const ScButton = defineComponent({
	props: {disabled: {type: Boolean, default: false}},
	emits: ["click"],
	setup: (p, {slots, emit}) => () => h("button", {
		class:   "sc-button",
		disabled: p.disabled,
		onClick:  () => emit("click"),
	}, slots.default?.()),
})

// Stub DialogModal : respecte le v-model pour ne rendre les slots que si ouvert.
const DialogModal = defineComponent({
	props: {modelValue: {type: Boolean, default: false}},
	emits: ["update:modelValue"],
	setup: (p, {slots}) => () => p.modelValue
		? h("div", {class: "dialog-modal"}, [slots.default?.(), slots.footer?.()])
		: null,
})

const stubs = {FormInput, ScButton, DialogModal}

function makeDay(overrides: Partial<SchoolCalendarInterface> = {}): SchoolCalendarInterface {
	return {id: 1, week: 1, day: "2025-08-18", school: true, ...overrides}
}

/** Trouve un bouton stubé par son texte exact (après trim). */
function buttonByText(wrapper: VueWrapper<any>, text: string) {
	return wrapper.findAll("button.sc-button").find(b => b.text().trim() === text)
}

beforeEach(() => {
	vi.stubGlobal("route", mockRoute)
	vi.mocked(axios.patch).mockResolvedValue({data: {school: false}})
	vi.mocked(axios.post).mockResolvedValue({data: []})
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.clearAllMocks()
})

describe("SchoolCalendarManager", () => {
	test("groupe les jours par semaine et rend un bouton par jour", () => {
		const wrapper = mountComponent(SchoolCalendarManager, {
			props: {
				calendars: [
					makeDay({id: 1, week: 1, day: "2025-08-18"}),
					makeDay({id: 2, week: 1, day: "2025-08-19"}),
					makeDay({id: 3, week: 2, day: "2025-08-25"}),
				],
			},
			stubs,
		})

		// Deux blocs semaine.
		expect(wrapper.findAll(".font-code").filter(n => n.text().includes("sem."))).toHaveLength(2)
		// Les trois jours sont rendus (dates numériques, indépendantes du locale).
		expect(wrapper.text()).toContain("18.08.2025")
		expect(wrapper.text()).toContain("25.08.2025")
	})

	test("affiche un état vide sans calendrier", () => {
		const wrapper = mountComponent(SchoolCalendarManager, {props: {calendars: []}, stubs})

		expect(wrapper.text()).toContain("Aucun jour dans le calendrier")
	})

	test("basculer un jour appelle l'endpoint toggle", async () => {
		const wrapper = mountComponent(SchoolCalendarManager, {
			props: {calendars: [makeDay({id: 42, day: "2025-08-18", school: true})]},
			stubs,
		})

		const dayButton = wrapper.findAll("button.sc-button").find(b => b.text().includes("18.08.2025"))
		await dayButton!.trigger("click")
		await flushPromises()

		expect(axios.patch).toHaveBeenCalledWith("/api.admin.school.calendars.toggle/42")
	})

	test("ajouter puis retirer une semaine à exclure", async () => {
		const wrapper = mountComponent(SchoolCalendarManager, {props: {calendars: []}, stubs})

		await wrapper.find('input[data-name="excluded"]').setValue("2025-10-13")
		await buttonByText(wrapper, "ajouter l'exclusion")!.trigger("click")

		expect(wrapper.text()).toContain("13.10.2025")

		// Le bouton de retrait (croix) supprime la puce.
		await wrapper.find(".bi-x-lg").trigger("click")
		expect(wrapper.text()).not.toContain("13.10.2025")
	})

	test("le flux de génération confirmé poste la plage et les exclusions", async () => {
		vi.mocked(axios.post).mockResolvedValueOnce({
			data: [makeDay({id: 100, week: 1, day: "2025-09-01", school: true})],
		})

		const wrapper = mountComponent(SchoolCalendarManager, {props: {calendars: []}, stubs})

		await wrapper.find('input[data-name="start"]').setValue("2025-08-18")
		await wrapper.find('input[data-name="end"]').setValue("2025-08-29")
		await wrapper.find('input[data-name="excluded"]').setValue("2025-10-13")
		await buttonByText(wrapper, "ajouter l'exclusion")!.trigger("click")

		// Ouvre la modale de confirmation.
		await buttonByText(wrapper, "générer le calendrier")!.trigger("click")
		expect(wrapper.find(".dialog-modal").exists()).toBe(true)

		// Confirme.
		await buttonByText(wrapper, "générer")!.trigger("click")
		await flushPromises()

		expect(axios.post).toHaveBeenCalledWith("/api.admin.school.calendars.generate", {
			start:    "2025-08-18",
			end:      "2025-08-29",
			excluded: ["2025-10-13"],
		})

		// La réponse remplace la grille et ferme la modale.
		expect(wrapper.text()).toContain("01.09.2025")
		expect(wrapper.find(".dialog-modal").exists()).toBe(false)
	})

	test("le bouton de génération est désactivé tant que les dates sont incomplètes", () => {
		const wrapper = mountComponent(SchoolCalendarManager, {props: {calendars: []}, stubs})

		const generate = buttonByText(wrapper, "générer le calendrier")
		expect(generate!.attributes("disabled")).toBeDefined()
	})
})
