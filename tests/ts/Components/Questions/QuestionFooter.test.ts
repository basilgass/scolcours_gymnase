import {describe, expect, test} from "vitest"
import {mountComponent} from "../../support/mountComponent.ts"
import {makeQuestionData, makeQuestionScore} from "../../support/questionDataFixture.ts"
import QuestionFooter from "@/Components/Questions/Parts/QuestionFooter.vue"

describe("QuestionFooter", () => {
	test("liste les réponses précédentes issues du score", () => {
		const wrapper = mountComponent(QuestionFooter, {
			questionData: makeQuestionData({
				score: makeQuestionScore({data: {answers: ["x=1", "x=2"]}}),
			}),
		})

		expect(wrapper.text()).toContain("vos réponses:")
		expect(wrapper.text()).toContain("x=1")
		expect(wrapper.text()).toContain("x=2")
	})

	test("émet loadAnswers au clic sur une réponse précédente", async () => {
		const wrapper = mountComponent(QuestionFooter, {
			questionData: makeQuestionData({
				score: makeQuestionScore({data: {answers: ["x=1", "x=2"]}}),
			}),
		})

		await wrapper.findAll(".cursor-pointer")[0].trigger("click")

		expect(wrapper.emitted("loadAnswers")).toEqual([
			[{show: true, value: "x=1"}],
		])
	})

	test("émet loadAnswers sans valeur au clic sur le bouton révéler (hasSuccess)", async () => {
		const wrapper = mountComponent(QuestionFooter, {
			questionData: makeQuestionData({hasSuccess: true, answer: "réponse correcte"}),
		})

		await wrapper.find("button").trigger("click")

		expect(wrapper.emitted("loadAnswers")).toEqual([
			[{show: true, value: undefined}],
		])
	})

	test("n'affiche ni réponses ni bouton révéler sans score ni succès", () => {
		const wrapper = mountComponent(QuestionFooter, {
			questionData: makeQuestionData({score: undefined, hasSuccess: false}),
		})

		expect(wrapper.text()).not.toContain("vos réponses:")
		expect(wrapper.find("button").exists()).toBe(false)
	})
})
