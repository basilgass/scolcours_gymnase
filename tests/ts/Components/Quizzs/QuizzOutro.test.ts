import {describe, expect, test} from "vitest"
import {defineComponent} from "vue"
import {mountComponent} from "../../support/mountComponent.ts"
import QuizzOutro from "@/Components/Quizzs/QuizzOutro.vue"
import {QuestionInterface, QuizzInterface, QuizzSessionInterface} from "@/types/modelInterfaces.ts"

const BlockShowStub = defineComponent({
	name: "BlockShow",
	props: {block: {type: Object, required: true}},
	template: "<div class=\"block-show-stub\" />",
})

const QuestionsIndexStub = defineComponent({
	name: "QuestionsIndex",
	props: {container: {type: Object, required: true}, questions: {type: Array, required: true}},
	template: "<div class=\"questions-index-stub\" />",
})

function makeQuizz(): QuizzInterface {
	return {
		id: 1,
		title: "Fin du quiz",
		intro: {id: 10, title: "", body: ""},
		outro: {id: 11, title: "titre d'origine outro", body: ""},
	} as unknown as QuizzInterface
}

function makeSession(questions: QuestionInterface[]): QuizzSessionInterface {
	return {questions} as unknown as QuizzSessionInterface
}

const stubs = {BlockShow: BlockShowStub, QuestionsIndex: QuestionsIndexStub}

describe("QuizzOutro", () => {
	test("affiche QuestionsIndex quand la session porte des questions", () => {
		const wrapper = mountComponent(QuizzOutro, {
			props: {
				quizz: makeQuizz(),
				quizzSession: makeSession([{id: 1} as unknown as QuestionInterface]),
			},
			stubs,
		})

		expect(wrapper.findComponent(QuestionsIndexStub).exists()).toBe(true)
	})

	test("masque QuestionsIndex quand la session n'a aucune question", () => {
		const wrapper = mountComponent(QuizzOutro, {
			props: {quizz: makeQuizz(), quizzSession: makeSession([])},
			stubs,
		})

		expect(wrapper.findComponent(QuestionsIndexStub).exists()).toBe(false)
	})

	test("masque QuestionsIndex en l'absence de session", () => {
		const wrapper = mountComponent(QuizzOutro, {
			props: {quizz: makeQuizz()},
			stubs,
		})

		expect(wrapper.findComponent(QuestionsIndexStub).exists()).toBe(false)
	})
})
