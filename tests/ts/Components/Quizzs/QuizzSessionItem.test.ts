import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {defineComponent, h} from "vue"
import {flushPromises} from "@vue/test-utils"
import axios from "axios"
import {mountComponent, mockRoute} from "../../support/mountComponent.ts"
import type {QuizzSessionInterface} from "@/types/modelInterfaces.ts"

vi.mock("axios", () => ({
	default: {patch: vi.fn(() => Promise.resolve({data: {}}))},
}))

// Le <Link> d'Inertia est résolu par son nom interne ("Link"), pas par l'alias
// local : on remplace donc l'export du module par une ancre stub déterministe.
vi.mock("@inertiajs/vue3", async (orig) => {
	const actual = (await orig()) as Record<string, unknown>
	const {defineComponent: dc, h: hh} = await import("vue")
	const Link = dc({
		props: {href: {type: String, default: ""}},
		setup: (p, {slots}) => () => hh("a", {class: "inertia-link", href: p.href}, slots.default?.()),
	})
	return {...actual, Link}
})

import QuizzSessionItem from "@/Components/Quizzs/QuizzSessionItem.vue"

const FormSwitch = defineComponent({
	props: {modelValue: {type: Boolean, default: false}},
	emits: ["update:modelValue", "update"],
	setup: (p, {emit}) => () => h("button", {
		class: "form-switch",
		onClick: () => {
			emit("update:modelValue", !p.modelValue)
			emit("update")
		},
	}),
})
const FormInput = defineComponent({setup: () => () => h("div", {class: "form-input"})})
const ConfirmButton = defineComponent({
	emits: ["confirm"],
	setup: (_, {slots, emit}) => () => h("button", {class: "confirm-btn", onClick: () => emit("confirm")}, slots.default?.()),
})

const stubs = {FormSwitch, FormInput, ConfirmButton}

function makeSession(overrides: Partial<QuizzSessionInterface> = {}): QuizzSessionInterface {
	return {
		id: 1,
		shortcode: "ABC",
		status: "intro",
		current: 2,
		total: 5,
		enable: false,
		users: [],
		...overrides,
	} as unknown as QuizzSessionInterface
}

beforeEach(() => {
	vi.stubGlobal("route", mockRoute)
	vi.mocked(axios.patch).mockResolvedValue({data: {}})
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.clearAllMocks()
})

describe("QuizzSessionItem", () => {
	test("les liens projection/dashboard portent l'href par shortcode (filet Wayfinder)", () => {
		const wrapper = mountComponent(QuizzSessionItem, {props: {session: makeSession()}, stubs})

		const links = wrapper.findAll("a.inertia-link")
		expect(links[0].attributes("href")).toBe("/admin.quizzes.sessions.projection/ABC")
		expect(links[1].attributes("href")).toBe("/admin.quizzes.sessions.dashboard/ABC")
	})

	test("basculer l'activation persiste la nouvelle valeur", async () => {
		const wrapper = mountComponent(QuizzSessionItem, {props: {session: makeSession({enable: false})}, stubs})

		await wrapper.find("button.form-switch").trigger("click")
		await flushPromises()

		expect(axios.patch).toHaveBeenCalledWith(
			"/api.admin.quizzes.sessions.enable/1",
			{enable: true},
		)
	})

	test("le bouton de suppression émet destroy", async () => {
		const wrapper = mountComponent(QuizzSessionItem, {props: {session: makeSession()}, stubs})

		await wrapper.find("button.confirm-btn").trigger("click")

		expect(wrapper.emitted("destroy")).toBeTruthy()
	})

	test("affiche les informations de session", () => {
		const wrapper = mountComponent(QuizzSessionItem, {
			props: {session: makeSession({id: 7, shortcode: "XYZ", status: "question", users: [{}, {}] as never})},
			stubs,
		})

		const text = wrapper.text()
		expect(text).toContain("(7): XYZ")
		expect(text).toContain("question")
		expect(text).toContain("2") // nombre d'utilisateurs
	})
})
