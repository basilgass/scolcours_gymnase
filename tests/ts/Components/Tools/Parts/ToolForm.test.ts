import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {defineComponent, h, markRaw, ref} from "vue"
import {router} from "@inertiajs/vue3"
import {mountComponent, mockRoute} from "../../../support/mountComponent.ts"
import type {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"

const {copySpy, storeToolSpy, resetToolSpy} = vi.hoisted(() => ({
	copySpy: vi.fn(),
	storeToolSpy: vi.fn(),
	resetToolSpy: vi.fn(),
}))

vi.mock("@vueuse/core", async () => {
	const {ref: r} = await import("vue")
	return {useClipboard: () => ({copy: copySpy, copied: r(false)})}
})

vi.mock("@/Composables/useToolsStorage.ts", () => ({
	useToolsStorage: () => ({storeTool: storeToolSpy, resetTool: resetToolSpy}),
}))

vi.mock("@inertiajs/vue3", async (orig) => {
	const actual = (await orig()) as Record<string, unknown>
	return {...actual, router: {...(actual.router as object), visit: vi.fn()}}
})

import ToolForm from "@/Components/Tools/Parts/ToolForm.vue"

// Card doit rendre header + default : le formulaire vit dans default, les boutons
// (reset « @ », partage) dans header.
const Card = defineComponent({
	setup: (_, {slots}) => () => h("div", {class: "card"}, [slots.header?.(), slots.default?.()]),
})
const ScButton = defineComponent({
	emits: ["click"],
	setup: (_, {slots, emit}) => () => h("button", {class: "sc-btn", onClick: () => emit("click")}, slots.default?.()),
})
const FormInput = defineComponent({setup: () => () => h("div", {class: "stub-input"})})
const FormSwitch = defineComponent({setup: () => () => h("div", {class: "stub-switch"})})
const FormCodearea = defineComponent({setup: () => () => h("div", {class: "stub-codearea"})})
const FormTextarea = defineComponent({setup: () => () => h("div", {class: "stub-textarea"})})
const FormFraction = defineComponent({setup: () => () => h("div", {class: "stub-fraction"})})
const FormVector = defineComponent({setup: () => () => h("div", {class: "stub-vector"})})

const stubs = {Card, ScButton, FormInput, FormSwitch, FormCodearea, FormTextarea, FormFraction, FormVector}

function mountToolForm(forms: IToolForm[], slug = "mytool") {
	// markRaw : en prod les props sont shallowReactive et le Ref de `value` survit.
	// test-utils rend les props réactives en profondeur et déballerait le Ref ;
	// markRaw préserve le contrat `f.value.value` (cf. piège pimath/Vue reactivity).
	const rawForms = forms.map(f => markRaw(f))
	return mountComponent(ToolForm, {props: {forms: rawForms}, provide: {toolSlug: slug}, stubs})
}

beforeEach(() => {
	vi.stubGlobal("route", mockRoute)
	vi.stubEnv("VITE_APP_URL", "http://test.local")
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.unstubAllEnvs()
	vi.clearAllMocks()
})

describe("ToolForm", () => {
	test("resolveFormComponent mappe le type sur le bon composant, sinon FormInput", () => {
		const forms: IToolForm[] = [
			{label: "A", type: "switch", value: ref(false)},
			{label: "B", value: ref("")},
		]
		const wrapper = mountToolForm(forms)

		expect(wrapper.find(".stub-switch").exists()).toBe(true)
		expect(wrapper.find(".stub-input").exists()).toBe(true)
	})

	test("le lien de partage encode les champs fromUrl dans la query", async () => {
		const forms: IToolForm[] = [
			{label: "X", value: ref("5"), fromUrl: "a"},
			{label: "Y", value: ref("7"), fromUrl: "b"},
		]
		const wrapper = mountToolForm(forms, "mytool")

		await wrapper.find("i.bi-share").trigger("click")

		expect(copySpy).toHaveBeenCalledWith("http://test.local/tools/mytool?a=5&b=7")
	})

	test("restoreFromUri peuple les valeurs depuis l'URL et émet updateForm", () => {
		history.replaceState({}, "", "/?a=hello")
		const forms: IToolForm[] = [{label: "X", value: ref(""), fromUrl: "a"}]

		const wrapper = mountToolForm(forms)

		expect(forms[0].value.value).toBe("hello")
		expect(wrapper.emitted("updateForm")).toBeTruthy()

		history.replaceState({}, "", "/")
	})

	test("réinitialiser vide le stockage et renavigue vers l'outil", async () => {
		const forms: IToolForm[] = [{label: "X", value: ref("5")}]
		const wrapper = mountToolForm(forms, "mytool")

		const reset = wrapper.findAll("button").find(b => b.text().trim() === "@")
		await reset!.trigger("click")

		expect(resetToolSpy).toHaveBeenCalled()
		expect(router.visit).toHaveBeenCalledWith("/tools.show/mytool")
	})
})
