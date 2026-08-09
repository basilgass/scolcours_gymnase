import {describe, expect, test, vi} from "vitest"
import {mountComponent} from "../../support/mountComponent.ts"
import {makeQuestionData, makeValidator} from "../../support/questionDataFixture.ts"
import {PiChecker} from "@/Checkers/PiChecker.ts"

// Court-circuite save() (pas d'app Inertia en test) sans casser les autres exports.
vi.mock("@inertiajs/vue3", async (orig) => ({
	...(await (orig() as Promise<Record<string, unknown>>)),
	usePage: () => ({props: {auth: {user: null}, themes: {}, theme: {slug: "scolcours"}}}),
}))

import QuestionAnswer from "@/Components/Questions/Parts/QuestionAnswer.vue"

function twoAnswersData(showInput: "hide" | "show" | "force" = "show") {
	return makeQuestionData({
		showInput,
		answersValues: ["42", "7"],
		userAnswers: [{input: "", tex: "", raw: ""}, {input: "", tex: "", raw: ""}],
		validators: [makeValidator({answer: "42"}), makeValidator({answer: "7"})],
	})
}

describe("QuestionAnswer", () => {
	test("le toggle passe de 'hide' à 'show' au clic sur 'donner la réponse'", async () => {
		const questionData = makeQuestionData({
			showInput: "hide",
			answersValues: ["42"],
			userAnswers: [{input: "", tex: "", raw: ""}],
			validators: [makeValidator({answer: "42"})],
		})

		const wrapper = mountComponent(QuestionAnswer, {questionData})

		const toggle = wrapper.findAll("button").find(b => b.text().includes("donner la réponse"))
		expect(toggle).toBeTruthy()

		await toggle!.trigger("click")

		expect(questionData.config.showInput.value).toBe("show")
	})

	test("le sélecteur multi-réponses navigue de la réponse 1 à la réponse 2", async () => {
		const questionData = twoAnswersData()
		const wrapper = mountComponent(QuestionAnswer, {questionData})

		expect(wrapper.text()).toContain("Réponse 1 / 2")

		const next = wrapper.findAll("button").find(b => b.find("i.bi-chevron-right").exists())
		expect(next).toBeTruthy()

		await next!.trigger("click")

		expect(questionData.current.id.value).toBe(1)
		expect(wrapper.text()).toContain("Réponse 2 / 2")
	})

	test("affiche le format de réponse issu du checker courant", () => {
		const questionData = twoAnswersData()
		const wrapper = mountComponent(QuestionAnswer, {questionData})

		const expectedFormat = new PiChecker("nb").format
		expect(wrapper.find(".question-keyboard-wrapper > div").text()).toBe(expectedFormat)
	})

	test("émet validate quand le clavier dynamique émet validate", async () => {
		const questionData = twoAnswersData()
		const wrapper = mountComponent(QuestionAnswer, {questionData})

		await wrapper.findAll("button.kbd-stub")[0].trigger("click")

		expect(wrapper.emitted("validate")).toBeTruthy()
		expect(wrapper.emitted("validate")!.length).toBe(1)
	})

	test("expose getKeyboards() indexé par data-index", () => {
		const questionData = twoAnswersData()
		const wrapper = mountComponent(QuestionAnswer, {questionData})

		// defineExpose vit sur l'instance interne (pas sur wrapper.vm en script setup).
		const exposed = wrapper.getCurrentComponent().exposed as {
			getKeyboards: () => Record<number, unknown>
		}
		const keyboards = exposed.getKeyboards()
		expect(Object.keys(keyboards).sort()).toEqual(["0", "1"])
	})
})
