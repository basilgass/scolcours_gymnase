import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {defineComponent, h} from "vue"
import {flushPromises} from "@vue/test-utils"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import {mountComponent, mockRoute} from "../../../support/mountComponent.ts"
import type {ToolInterface} from "@/types/modelInterfaces.ts"

vi.mock("axios", () => ({
	default: {get: vi.fn(() => Promise.resolve({data: []}))},
}))

vi.mock("@inertiajs/vue3", async (orig) => {
	const actual = (await orig()) as Record<string, unknown>
	return {...actual, router: {...(actual.router as object), visit: vi.fn()}}
})

import ToolsSearch from "@/Components/Tools/Parts/ToolsSearch.vue"

const focusSpy = vi.fn()

// FilteredList n'apparaît qu'après chargement (v-if) : le stub rend le slot #card
// pour le premier item et expose focus() pour vérifier la délégation.
const FilteredList = defineComponent({
	props: {list: {type: Array, default: () => []}},
	emits: ["enter"],
	setup: (p, {slots, emit, expose}) => {
		expose({focus: focusSpy})
		return () => h("div", {class: "filtered-list"}, [
			p.list.length ? slots.card?.({item: p.list[0]}) : null,
			h("button", {class: "enter-btn", onClick: () => emit("enter", p.list)}),
		])
	},
})
const InertiaLink = defineComponent({
	props: {href: {type: String, default: ""}},
	setup: (p, {slots}) => () => h("a", {class: "inertia-link", href: p.href}, slots.default?.()),
})

const stubs = {FilteredList, InertiaLink}

function makeTool(overrides: Partial<ToolInterface> = {}): ToolInterface {
	return {
		id: 1,
		slug: "calc",
		title: "Calculatrice",
		body: "un outil",
		theme_id: 2,
		parameters: "",
		updated_at: "2026-01-01",
		...overrides,
	}
}

beforeEach(() => {
	vi.stubGlobal("route", mockRoute)
	vi.mocked(axios.get).mockResolvedValue({data: [makeTool()]})
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.clearAllMocks()
})

describe("ToolsSearch", () => {
	test("charge la liste des outils au montage", async () => {
		const wrapper = mountComponent(ToolsSearch, {stubs})
		await flushPromises()

		expect(axios.get).toHaveBeenCalledWith("/api.tools.index")
		expect(wrapper.find(".filtered-list").exists()).toBe(true)
	})

	test("la carte pointe vers la page de l'outil (filet Wayfinder)", async () => {
		const wrapper = mountComponent(ToolsSearch, {stubs})
		await flushPromises()

		expect(wrapper.find("a.inertia-link").attributes("href")).toBe("/tools.show/calc")
	})

	test("enter navigue vers l'outil unique, ou vers l'index si ambigu", async () => {
		vi.mocked(axios.get).mockResolvedValue({data: [makeTool({slug: "calc"})]})
		const wrapper = mountComponent(ToolsSearch, {stubs})
		await flushPromises()

		await wrapper.find("button.enter-btn").trigger("click")
		expect(router.visit).toHaveBeenLastCalledWith("/tools.show/calc")
	})

	test("enter avec plusieurs résultats renvoie vers l'index des outils", async () => {
		vi.mocked(axios.get).mockResolvedValue({data: [makeTool({id: 1, slug: "a"}), makeTool({id: 2, slug: "b"})]})
		const wrapper = mountComponent(ToolsSearch, {stubs})
		await flushPromises()

		await wrapper.find("button.enter-btn").trigger("click")
		expect(router.visit).toHaveBeenLastCalledWith("/tools.index")
	})

	test("expose focus() qui délègue à la liste filtrée", async () => {
		const wrapper = mountComponent(ToolsSearch, {stubs})
		await flushPromises()

		const exposed = wrapper.getCurrentComponent().exposed as {focus: () => void}
		exposed.focus()

		expect(focusSpy).toHaveBeenCalled()
	})
})
