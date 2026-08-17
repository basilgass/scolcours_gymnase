import {describe, expect, test} from "vitest"
import {mountComponent} from "../../support/mountComponent.ts"
import SeoSnippetPreview from "@/Components/Seo/SeoSnippetPreview.vue"

describe("SeoSnippetPreview", () => {
	test("affiche titre, url et description", () => {
		const wrapper = mountComponent(SeoSnippetPreview, {
			props: {title: "Grapheur", url: "/tools/grapheur", description: "Tracer des fonctions."},
		})

		expect(wrapper.text()).toContain("Grapheur")
		expect(wrapper.text()).toContain("/tools/grapheur")
		expect(wrapper.text()).toContain("Tracer des fonctions.")
	})

	test("compte les caractères de la description", () => {
		const wrapper = mountComponent(SeoSnippetPreview, {
			props: {title: "x", url: "/x", description: "abcde"},
		})

		expect(wrapper.text()).toContain("5 / 155")
	})

	test("tronque et signale un dépassement du seuil", () => {
		const long = "mot ".repeat(60).trim() // 239 caractères

		const wrapper = mountComponent(SeoSnippetPreview, {
			props: {title: "x", url: "/x", description: long},
		})

		expect(wrapper.text()).toContain("239 / 155")
		expect(wrapper.html()).toContain("…")
		expect(wrapper.find(".text-red-600").exists()).toBe(true)
	})
})
