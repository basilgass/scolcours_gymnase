import {describe, expect, test} from "vitest"
import {mountComponent} from "../../support/mountComponent.ts"
import {makeQuestionData, makeQuestionScore} from "../../support/questionDataFixture.ts"
import QuestionHeader from "@/Components/Questions/Parts/QuestionHeader.vue"

describe("QuestionHeader", () => {
	test("affiche le numéro d'ordre quand order>0 et showNumber (défaut)", () => {
		const wrapper = mountComponent(QuestionHeader, {
			questionData: makeQuestionData({order: 3}),
		})

		expect(wrapper.text()).toContain("3")
	})

	test("masque le numéro d'ordre quand order vaut 0", () => {
		const wrapper = mountComponent(QuestionHeader, {
			questionData: makeQuestionData({order: 0}),
		})

		// Aucun badge d'ordre : le premier div de l'en-tête n'affiche pas de numéro.
		expect(wrapper.find("header").text()).not.toContain("0")
	})

	test("masque le numéro d'ordre quand showNumber=false", () => {
		const wrapper = mountComponent(QuestionHeader, {
			props: {showNumber: false},
			questionData: makeQuestionData({order: 7}),
		})

		expect(wrapper.find("header").text()).not.toContain("7")
	})

	test("affiche l'icône de succès quand un score existe", () => {
		const wrapper = mountComponent(QuestionHeader, {
			questionData: makeQuestionData({score: makeQuestionScore({score: 1})}),
		})

		expect(wrapper.find("i.bi-check-circle").exists()).toBe(true)
		expect(wrapper.find("i.bi-ban").exists()).toBe(false)
	})

	test("affiche l'icône d'échec quand aucun score n'existe", () => {
		const wrapper = mountComponent(QuestionHeader, {
			questionData: makeQuestionData({score: undefined}),
		})

		expect(wrapper.find("i.bi-ban").exists()).toBe(true)
		expect(wrapper.find("i.bi-check-circle").exists()).toBe(false)
	})
})
