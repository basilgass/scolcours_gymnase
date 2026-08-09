import {Component, computed, defineComponent, h, ref} from "vue"
import {questionDataInterface, questionValidatorInterface} from "@/Components/Questions/QuestionInterface.ts"
import {QuestionInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import {KeyboardCheckerInterface, KeyboardInputInterface, KeyboardInterface} from "@/types/keyboardInterfaces.ts"
import {IllustrationInterface} from "@/types/blockInterfaces.ts"
import {KeyboardObjectType} from "@/Composables/keyboardConfig.ts"
import {PiChecker} from "@/Checkers/PiChecker.ts"

/**
 * Fabriques de fixtures pour le contexte `questionData` (provide/inject).
 *
 * La factory est typée sur l'interface RÉELLE (`questionDataInterface`) : si le
 * contrat évolue, vue-tsc casse ici — la fixture est donc auto-vérifiée.
 * Les Question Parts simples (Header, Footer) ne lisent qu'un sous-ensemble des
 * champs ; les orchestrateurs (Block, Answer) reçoivent des valeurs plus riches
 * via les overrides ci-dessous (body, illustration, validators, ...).
 */

/** Construit un ScoreInterface de question (score.data.answers pilote previousAnswers). */
export function makeQuestionScore(
	overrides: Partial<ScoreInterface<ScoreQuestionDataInterface>> = {},
): ScoreInterface<ScoreQuestionDataInterface> {
	return {
		attempts: 1,
		data: {answers: []},
		id: 1,
		is_resolved: false,
		score: 0,
		scoreable_id: 1,
		scoreable_type: "Question",
		updated_at: "2026-01-01T00:00:00Z",
		user_id: 1,
		...overrides,
	}
}

/**
 * Stub de clavier dynamique pour le montage « coquille » de QuestionAnswer.
 * Émet `validate` au clic (test de propagation) et expose l'API attendue par
 * QuestionShow.loadAnswers (setInput/parameters/reset), sans logique CodeMirror.
 */
export const KeyboardStub = defineComponent({
	name: "KeyboardStub",
	props: {
		keyboard: {type: Object, required: false, default: () => ({})},
		reference: {type: String, required: false, default: ""},
	},
	emits: ["change", "validate"],
	setup(_, {emit, expose}) {
		expose({
			parameters: "",
			reset: () => {},
			setInput: async (): Promise<KeyboardInputInterface> => ({input: "", tex: "", raw: ""}),
		})
		return () => h("button", {class: "kbd-stub", onClick: () => emit("validate")}, "clavier")
	},
})

/**
 * Fabrique un validator RÉALISTE : un vrai `PiChecker` fournit la hiérarchie
 * imbriquée (`checker.checker.checkFormat`, `.type`, `format`) que QuestionAnswer
 * traverse sans garde. Le composant clavier est stubé par défaut.
 */
export function makeValidator(
	overrides: {
		answer?: string
		key?: string
		checkerCode?: string
		keyboardName?: string
		component?: Component | null
	} = {},
): questionValidatorInterface {
	const checkerCode = overrides.checkerCode ?? "nb"
	const checker: KeyboardCheckerInterface = {
		name: overrides.keyboardName ?? "Basic",
		checker: new PiChecker(checkerCode),
		checkerOverride: {},
	}
	const keyboard: KeyboardInterface = {
		name: overrides.keyboardName ?? "Basic",
		parameters: [],
		values: [],
		config: {} as KeyboardObjectType,
		component: overrides.component === undefined ? KeyboardStub : overrides.component,
	}
	return {
		answer: overrides.answer ?? "42",
		key: overrides.key ?? "$a",
		checker,
		keyboard,
	}
}

interface QuestionDataOverrides {
	order?: number
	title?: string
	answer?: string
	score?: ScoreInterface<ScoreQuestionDataInterface> | undefined
	hasSuccess?: boolean
	body?: string
	illustration?: IllustrationInterface | null
	css?: string
	variables?: string[]
	answersValues?: string[]
	coherences?: boolean
	userAnswers?: KeyboardInputInterface[]
	currentId?: number
	validators?: questionValidatorInterface[]
	editorMode?: boolean
	showInput?: "hide" | "show" | "force"
	silent?: boolean
	animation?: boolean
}

export function makeQuestionData(overrides: QuestionDataOverrides = {}): questionDataInterface {
	const question = ref<QuestionInterface>({
		answer: overrides.answer ?? "42",
		block: {
			body: overrides.body ?? "",
			id: 1,
			illustration: overrides.illustration ?? null,
			title: overrides.title ?? "Titre de la question",
		},
		keyboard: "",
		user: makeQuestionScore({is_resolved: overrides.hasSuccess ?? false}),
		css: overrides.css ?? "",
		displayIf: null,
		id: 1,
		order: overrides.order ?? 1,
	})

	const score = ref<ScoreInterface | undefined>(overrides.score)
	const currentId = ref(overrides.currentId ?? 0)
	const validators = computed(() => overrides.validators ?? [])

	// current.keyboard / current.checker sont dérivés des validators, comme dans
	// useQuestion. Sans validator (Parts simples), on retombe sur des objets neutres.
	const emptyKeyboard = {} as unknown as KeyboardInterface
	const emptyChecker = {} as unknown as KeyboardCheckerInterface
	const currentKeyboard = computed(() => validators.value[currentId.value]?.keyboard ?? emptyKeyboard)
	const currentChecker = computed(() => validators.value[currentId.value]?.checker ?? emptyChecker)

	return {
		answers: {
			values: computed(() => overrides.answersValues ?? []),
			variables: computed(() => overrides.variables ?? []),
			coherences: computed(() => overrides.coherences ?? true),
		},
		block: computed(() => question.value.block),
		config: {
			animation: overrides.animation ?? false,
			editorMode: overrides.editorMode ?? false,
			isDynamic: false,
			raw: "",
			showInput: ref(overrides.showInput ?? "hide"),
			silent: overrides.silent ?? false,
		},
		current: {
			id: currentId,
			keyboard: currentKeyboard,
			checker: currentChecker,
		},
		hasSuccess: computed(() => overrides.hasSuccess ?? false),
		question,
		user: {
			answer: ref(""),
			answers: ref(overrides.userAnswers ?? []),
			score,
			errors: ref([]),
		},
		validators,
	}
}
