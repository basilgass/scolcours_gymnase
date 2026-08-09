import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {nextTick, ref, type Ref} from "vue"
import {createPinia, setActivePinia} from "pinia"
import {flushPromises} from "@vue/test-utils"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import {mockRoute} from "../../support/mountComponent.ts"
import {makeQuestionScore} from "../../support/questionDataFixture.ts"
import {useQuestionAdmin, type questionsContainerInterface} from "@/Components/Questions/useQuestionAdmin.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"

// axios est appelé directement par le composable : on stub le default export.
vi.mock("axios", () => ({
	default: {
		post: vi.fn(() => Promise.resolve({data: {}})),
		patch: vi.fn(() => Promise.resolve({data: {}})),
		get: vi.fn(() => Promise.resolve({data: []})),
		delete: vi.fn(() => Promise.resolve({data: {}})),
	},
}))

// Mock partiel : on ne remplace que router.visit (spy), le reste d'Inertia est
// conservé pour ne pas casser usePage (non appelé ici, mais importé par le store).
vi.mock("@inertiajs/vue3", async (orig) => {
	const actual = (await orig()) as Record<string, unknown>
	return {...actual, router: {...(actual.router as object), visit: vi.fn()}}
})

const container: questionsContainerInterface = {id: 10, type: "Post"}

function questionsRef(items: Partial<QuestionInterface>[]): Ref<Partial<QuestionInterface>[]> {
	return ref(items)
}

beforeEach(() => {
	setActivePinia(createPinia())
	vi.stubGlobal("route", mockRoute)
	vi.mocked(axios.post).mockResolvedValue({data: {}})
	vi.mocked(axios.patch).mockResolvedValue({data: {}})
	vi.mocked(axios.delete).mockResolvedValue({data: {}})
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.clearAllMocks()
})

describe("displayIf.remove", () => {
	test("met tous les displayIf à null et persiste en batch", async () => {
		const questions = questionsRef([{id: 1, displayIf: "2"}, {id: 2, displayIf: "3"}])
		const {displayIf} = useQuestionAdmin(container, questions)

		displayIf.remove()

		expect(questions.value.every(q => q.displayIf === null)).toBe(true)
		expect(axios.post).toHaveBeenCalledWith(
			"/api.admin.questions.batch.displayIf",
			expect.objectContaining({
				_method: "PATCH",
				updates: [
					{id: 1, display_if: null},
					{id: 2, display_if: null},
				],
			}),
		)
	})
})

describe("displayIf.auto", () => {
	test("chaîne chaque question à la précédente, la première reste libre", () => {
		const questions = questionsRef([{id: 1}, {id: 2}, {id: 3}])
		const {displayIf} = useQuestionAdmin(container, questions)

		displayIf.auto()

		expect(questions.value[0].displayIf).toBeUndefined()
		expect(questions.value[1].displayIf).toBe("1")
		expect(questions.value[2].displayIf).toBe("2")
	})
})

describe("add", () => {
	test("crée la question puis navigue vers son édition", async () => {
		vi.mocked(axios.post).mockResolvedValueOnce({data: {id: 99, answer: "-"}})
		const questions = questionsRef([])
		const {add} = useQuestionAdmin(container, questions)

		add()
		await flushPromises()

		expect(axios.post).toHaveBeenCalledWith(
			"/api.admin.questions.store",
			expect.objectContaining({target_type: "Post", target_id: 10}),
		)
		expect(questions.value).toHaveLength(1)
		expect(router.visit).toHaveBeenCalledWith("/admin.questions.edit/99")
	})
})

describe("updateGrid", () => {
	test("persiste la classe de grille du post", () => {
		const {updateGrid} = useQuestionAdmin(container, questionsRef([]))

		updateGrid("grid-cols-3")

		expect(axios.patch).toHaveBeenCalledWith(
			"/api.admin.posts.questions.grid/10",
			{grid: "grid-cols-3"},
		)
	})
})

describe("answers.reset", () => {
	test("réinitialise uniquement les scores des questions présentes", () => {
		const store = useStoreScore()
		store.scores = [
			makeQuestionScore({id: 100, scoreable_id: 1}),
			makeQuestionScore({id: 200, scoreable_id: 2}),
			makeQuestionScore({id: 300, scoreable_id: 42}),
		]
		const resetSpy = vi.spyOn(store, "reset").mockResolvedValue([])

		const {answers} = useQuestionAdmin(container, questionsRef([{id: 1}, {id: 2}, {id: 99}]))
		answers.reset()

		expect(resetSpy).toHaveBeenCalledWith([100, 200])
	})
})

describe("watch ordre des questions", () => {
	test("réordonner déclenche la sauvegarde d'ordre", async () => {
		const questions = questionsRef([{id: 1}, {id: 2}])
		useQuestionAdmin(container, questions)

		questions.value = [{id: 2}, {id: 1}]
		await nextTick()

		expect(axios.patch).toHaveBeenCalledWith(
			"/api.admin.questions.order/Post/10",
			{order: [{id: 2, order: 1}, {id: 1, order: 2}]},
		)
	})
})
