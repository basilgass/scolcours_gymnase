import {describe, expect, test} from "vitest"
import {defineComponent} from "vue"
import {mountComponent} from "../../support/mountComponent.ts"
import QuizzIntro from "@/Components/Quizzs/QuizzIntro.vue"
import QuizzIconWait from "@/Components/Quizzs/QuizzIconWait.vue"
import {QuizzInterface} from "@/types/modelInterfaces.ts"

// Stub qui capture la prop `block` transmise à BlockShow, pour vérifier
// l'effet de bord `intro.title = quizz.title` du composant.
const BlockShowStub = defineComponent({
	name: "BlockShow",
	props: {block: {type: Object, required: true}},
	template: "<div class=\"block-show-stub\" />",
})

function makeQuizz(title: string): QuizzInterface {
	return {
		id: 1,
		title,
		intro: {id: 10, title: "titre d'origine intro", body: ""},
		outro: {id: 11, title: "", body: ""},
	} as unknown as QuizzInterface
}

describe("QuizzIntro", () => {
	test("propage le titre du quiz dans le bloc d'intro", () => {
		const wrapper = mountComponent(QuizzIntro, {
			props: {quizz: makeQuizz("Introduction au quiz")},
			stubs: {BlockShow: BlockShowStub},
		})

		const block = wrapper.findComponent(BlockShowStub).props("block") as {title: string}
		expect(block.title).toBe("Introduction au quiz")
	})

	test("affiche l'indicateur d'attente (QuizzIconWait rendu)", () => {
		const wrapper = mountComponent(QuizzIntro, {
			props: {quizz: makeQuizz("Introduction au quiz")},
			stubs: {BlockShow: BlockShowStub},
		})

		expect(wrapper.findComponent(QuizzIconWait).exists()).toBe(true)
		expect(wrapper.text()).toContain("Merci de patienter")
	})
})
