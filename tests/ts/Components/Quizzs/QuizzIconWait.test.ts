import {describe, expect, test} from "vitest"
import {mountComponent} from "../../support/mountComponent.ts"
import QuizzIconWait from "@/Components/Quizzs/QuizzIconWait.vue"

describe("QuizzIconWait", () => {
	test("affiche le message d'attente statique", () => {
		const wrapper = mountComponent(QuizzIconWait)

		expect(wrapper.text()).toContain("Merci de patienter")
	})
})
