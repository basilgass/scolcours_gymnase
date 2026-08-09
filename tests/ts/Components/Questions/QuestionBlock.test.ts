import {describe, expect, test} from "vitest"
import {mountComponent} from "../../support/mountComponent.ts"
import {makeQuestionData} from "../../support/questionDataFixture.ts"
import {IllustrationInterface} from "@/types/blockInterfaces.ts"
import QuestionBlock from "@/Components/Questions/Parts/QuestionBlock.vue"

// Stub qui renvoie le body reçu dans le DOM (vérifie la prop transmise).
const mdEchoStub = {props: ["text"], template: '<div class="md-stub">{{ text }}</div>'}
// Stub minimal d'illustration (présence/absence uniquement).
const illusStub = {props: ["illustration"], template: '<div class="illus-stub" />'}

const illustration = {code: "circle", id: 1} as unknown as IllustrationInterface

describe("QuestionBlock", () => {
	test("transmet le body calculé à MarkdownIt", () => {
		const wrapper = mountComponent(QuestionBlock, {
			questionData: makeQuestionData({body: "Bonjour le monde"}),
			stubs: {MarkdownIt: mdEchoStub, IllustrationShow: illusStub},
		})

		expect(wrapper.find(".md-stub").text()).toContain("Bonjour le monde")
	})

	test("n'affiche pas l'illustration quand elle est absente", () => {
		const wrapper = mountComponent(QuestionBlock, {
			questionData: makeQuestionData({illustration: null}),
			stubs: {MarkdownIt: mdEchoStub, IllustrationShow: illusStub},
		})

		expect(wrapper.find(".illus-stub").exists()).toBe(false)
	})

	test("affiche l'illustration quand elle est présente", () => {
		const wrapper = mountComponent(QuestionBlock, {
			questionData: makeQuestionData({illustration}),
			stubs: {MarkdownIt: mdEchoStub, IllustrationShow: illusStub},
		})

		expect(wrapper.find(".illus-stub").exists()).toBe(true)
	})

	test("un clic sur [data-answer-index] met à jour current.id", async () => {
		const questionData = makeQuestionData({})
		const clickStub = {template: '<span class="answer-target" data-answer-index="2">x</span>'}

		const wrapper = mountComponent(QuestionBlock, {
			questionData,
			stubs: {MarkdownIt: clickStub, IllustrationShow: illusStub},
		})

		await wrapper.find(".answer-target").trigger("click")

		expect(questionData.current.id.value).toBe(2)
	})

	test("inverse la direction flex quand css contient i-bottom", () => {
		const wrapper = mountComponent(QuestionBlock, {
			questionData: makeQuestionData({css: "i-bottom"}),
			stubs: {MarkdownIt: mdEchoStub, IllustrationShow: illusStub},
		})

		expect(wrapper.find("main").classes()).toContain("flex-col-reverse")
	})

	test("garde la direction flex normale sans i-bottom", () => {
		const wrapper = mountComponent(QuestionBlock, {
			questionData: makeQuestionData({css: ""}),
			stubs: {MarkdownIt: mdEchoStub, IllustrationShow: illusStub},
		})

		expect(wrapper.find("main").classes()).toContain("flex-col")
	})
})
