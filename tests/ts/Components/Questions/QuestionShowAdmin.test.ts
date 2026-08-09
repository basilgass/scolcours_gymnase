import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {defineComponent, h} from "vue"
import {flushPromises} from "@vue/test-utils"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import {mountComponent, mockRoute} from "../../support/mountComponent.ts"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"

vi.mock("axios", () => ({
	default: {
		post: vi.fn(() => Promise.resolve({data: {}})),
		delete: vi.fn(() => Promise.resolve({data: {}})),
	},
}))

vi.mock("@inertiajs/vue3", async (orig) => {
	const actual = (await orig()) as Record<string, unknown>
	return {...actual, router: {...(actual.router as object), visit: vi.fn()}}
})

import QuestionShowAdmin from "@/Components/Questions/QuestionShowAdmin.vue"

// Stubs en fonctions de rendu (pas de template string : vue runtime-only en test).
const EditLink = defineComponent({
	props: {href: {type: String, default: ""}, label: {type: [String, Number], default: ""}, inline: {type: Boolean, default: false}},
	setup: (p) => () => h("a", {class: "edit-link", href: p.href}, String(p.label)),
})
const DropdownMenu = defineComponent({
	setup: (_, {slots}) => () => h("div", {class: "dropdown"}, [slots.default?.(), slots.footer?.()]),
})
const MoveItemTo = defineComponent({setup: () => () => h("div", {class: "move-item"})})
const ConfirmButton = defineComponent({
	emits: ["confirm"],
	setup: (_, {slots, emit}) => () => h("button", {class: "confirm-btn", onClick: () => emit("confirm")}, slots.default?.()),
})
const ScButton = defineComponent({
	emits: ["click"],
	setup: (_, {slots, emit}) => () => h("button", {class: "sc-btn", onClick: () => emit("click")}, slots.default?.()),
})

const stubs = {EditLink, DropdownMenu, MoveItemTo, ConfirmButton, ScButton}

function makeProps(displayIf: string | null = "3,5") {
	const question = {
		id: 1,
		displayIf,
		block: {id: 1, title: "Q", body: "", illustration: null},
		answer: "42",
		keyboard: "",
		order: 1,
	} as unknown as QuestionInterface
	const questions = [{id: 3}, {id: 5}, {id: 1}] as Partial<QuestionInterface>[]
	return {question, questions}
}

beforeEach(() => {
	vi.stubGlobal("route", mockRoute)
	vi.mocked(axios.post).mockResolvedValue({data: {}})
	vi.mocked(axios.delete).mockResolvedValue({data: {}})
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.clearAllMocks()
})

describe("QuestionShowAdmin", () => {
	test("le lien d'édition porte l'href de la route d'édition (filet Wayfinder)", () => {
		const wrapper = mountComponent(QuestionShowAdmin, {props: makeProps(), stubs})

		expect(wrapper.find("a.edit-link").attributes("href")).toBe("/admin.questions.edit/1")
	})

	test("displayIfIds coche les questions listées dans displayIf", () => {
		const wrapper = mountComponent(QuestionShowAdmin, {props: makeProps("3,5"), stubs})

		const boxes = wrapper.findAll("input[type=checkbox]")
		// q=1 est la question courante (pas d'input) -> seules 3 et 5 rendent une case.
		expect(boxes).toHaveLength(2)
		expect(boxes.every(b => (b.element as HTMLInputElement).checked)).toBe(true)
	})

	test("toggleDisplayId retire un id et persiste la nouvelle condition", async () => {
		const wrapper = mountComponent(QuestionShowAdmin, {props: makeProps("3,5"), stubs})

		// Première case = q=3 ; la décocher retire 3 -> reste "5".
		await wrapper.findAll("input[type=checkbox]")[0].trigger("input")
		await flushPromises()

		expect(axios.post).toHaveBeenCalledWith(
			"/api.admin.questions.displayIf/1",
			expect.objectContaining({_method: "PATCH", displayIf: "5"}),
		)
	})

	test("le bouton « toujours » remet la condition à null", async () => {
		const wrapper = mountComponent(QuestionShowAdmin, {props: makeProps("3,5"), stubs})

		const always = wrapper.findAll("button").find(b => b.text().includes("toujours"))
		await always!.trigger("click")
		await flushPromises()

		expect(axios.post).toHaveBeenCalledWith(
			"/api.admin.questions.displayIf/1",
			expect.objectContaining({_method: "PATCH", displayIf: null}),
		)
	})

	test("dupliquer crée une copie puis navigue vers son édition", async () => {
		vi.mocked(axios.post).mockResolvedValueOnce({data: {id: 77}})
		const wrapper = mountComponent(QuestionShowAdmin, {props: makeProps(), stubs})

		await wrapper.find("button.sc-btn").trigger("click")
		await flushPromises()

		expect(axios.post).toHaveBeenCalledWith("/api.admin.questions.duplicate/1")
		expect(router.visit).toHaveBeenCalledWith("/admin.questions.edit/77")
	})

	test("supprimer appelle l'API destroy et émet removed", async () => {
		const wrapper = mountComponent(QuestionShowAdmin, {props: makeProps(), stubs})

		await wrapper.find("button.confirm-btn").trigger("click")
		await flushPromises()

		expect(axios.delete).toHaveBeenCalledWith("/api.admin.questions.destroy/1")
		expect(wrapper.emitted("removed")).toBeTruthy()
	})
})
