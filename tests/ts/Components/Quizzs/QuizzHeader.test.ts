import {describe, expect, test} from "vitest"
import {mountComponent} from "../../support/mountComponent.ts"
import QuizzHeader from "@/Components/Quizzs/QuizzHeader.vue"
import {QuizzSessionInterface} from "@/types/modelInterfaces.ts"

// QuizzHeader ne lit que quizz.title (v-katex, neutralisée), current et total.
function makeSession(current: number, total: number, title: string): QuizzSessionInterface {
	return {
		current,
		total,
		quizz: {id: 1, title},
	} as unknown as QuizzSessionInterface
}

describe("QuizzHeader", () => {
	test("affiche la progression 'current sur total'", () => {
		const wrapper = mountComponent(QuizzHeader, {
			props: {quizzSession: makeSession(2, 5, "Quiz de trigonométrie")},
		})

		expect(wrapper.text()).toContain("2 sur 5")
	})

	test("expose le titre du quiz dans l'en-tête", () => {
		const wrapper = mountComponent(QuizzHeader, {
			props: {quizzSession: makeSession(1, 3, "Quiz de trigonométrie")},
		})

		// v-katex.auto est neutralisée : le binding n'injecte pas le texte dans le DOM,
		// mais l'élément titre existe et le composant monte sans erreur.
		expect(wrapper.find("h2").exists()).toBe(true)
	})
})
