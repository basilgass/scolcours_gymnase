import {computed, ref} from "vue"
import {describe, expect, test} from "vitest"
import {PiChecker} from "@/Checkers"
import {questionDataInterface, questionValidatorInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useQuestionValidation} from "@/Components/Questions/useQuestionValidation.ts"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Crée un validator minimal avec un NumberChecker.
 * La config suit le format de PiChecker : "number" ou "number,2" (2 décimales).
 */
function makeValidator(answer: string, checkerConfig = 'number'): questionValidatorInterface {
	return {
		answer,
		checker: {
			checker: new PiChecker(checkerConfig),
			checkerOverride: {},
			name: checkerConfig
		},
		key: '$a',
		keyboard: {component: null, config: {} as any, name: 'basic', parameters: [], values: []}
	}
}

function makeUserAnswers(inputs: string[]): ReturnType<typeof ref<KeyboardInputInterface[]>> {
	return ref(inputs.map(input => ({input, raw: input, tex: input})))
}

/**
 * Construit un questionDataInterface minimal pour les tests.
 * isDynamic:true et id:0 court-circuitent l'appel à save() et évitent
 * de devoir mocker usePage() et useStoreScore().
 */
function makeQuestionData(
	validators: questionValidatorInterface[],
	userInputs: string[],
): questionDataInterface {
	return {
		answers: {
			values: computed(() => validators.map(v => v.answer)),
			variables: computed(() => validators.map((_, i) => `$${String.fromCharCode(97 + i)}`)),
			coherences: computed(() => true)
		},
		block: computed(() => ({} as any)),
		config: {
			animation: false,
			editorMode: false,
			isDynamic: true,
			raw: '',
			showInput: ref('show' as const),
			silent: false,
		},
		current: {
			id: ref(1),
			keyboard: computed(() => ({} as any)),
			checker: computed(() => ({
				checker: new PiChecker('number'),
				checkerOverride: {},
				name: 'number'
			}))
		},
		hasSuccess: computed(() => false),
		question: ref({id: 0, answer: ''} as any),
		user: {
			answer: ref(''),
			answers: makeUserAnswers(userInputs),
			score: ref(undefined as any),
			errors: ref([])
		},
		validators: computed(() => validators)
	}
}

// ─── validateSingle ───────────────────────────────────────────────────────────

describe('validateSingle — réponse standard unique', () => {
	test('bonne réponse exacte', () => {
		const data = makeQuestionData([makeValidator('42')], ['42'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('mauvaise réponse', () => {
		const data = makeQuestionData([makeValidator('42')], ['99'])
		const {validate, result, errors} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
		expect(errors.value.length).toBeGreaterThan(0)
	})

	test('réponse vide — message dédié', () => {
		const data = makeQuestionData([makeValidator('42')], [''])
		const {validate, result, errors} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
		expect(errors.value[0]).toContain('entrer')
	})

	test('réponse avec 2 décimales — correcte', () => {
		const data = makeQuestionData([makeValidator('3.14', 'number,2')], ['3.14'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('réponse avec 2 décimales — nombre de décimales incorrect', () => {
		const data = makeQuestionData([makeValidator('3.14', 'number,2')], ['3.1'])
		const {validate, result, errors} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
		expect(errors.value[0]).toContain('chiffre(s) après la virgule')
	})

	test('plusieurs réponses indépendantes — toutes correctes', () => {
		const validators = [makeValidator('10'), makeValidator('20')]
		const data = makeQuestionData(validators, ['10', '20'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('plusieurs réponses — une incorrecte', () => {
		const validators = [makeValidator('10'), makeValidator('20')]
		const data = makeQuestionData(validators, ['10', '99'])
		const {validate, result, errors} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
		// Avec plusieurs variables, le message est préfixé par "2. ..."
		expect(errors.value[0]).toMatch(/^2\./)
	})
})

// ─── validateMultiple — réponses alternatives (||) ───────────────────────────

describe('validateMultiple — réponses alternatives (||)', () => {
	test('correspond à la première option', () => {
		const data = makeQuestionData([makeValidator('10||20||30')], ['10'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('correspond à la deuxième option', () => {
		const data = makeQuestionData([makeValidator('10||20||30')], ['20'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('correspond à la troisième option', () => {
		const data = makeQuestionData([makeValidator('10||20||30')], ['30'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('aucune option ne correspond', () => {
		const data = makeQuestionData([makeValidator('10||20||30')], ['99'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
	})

	test('correspond malgré des espaces dans la définition', () => {
		const data = makeQuestionData([makeValidator('10 || 20 || 30')], ['20'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})
})

// ─── validateMixed — réponses non ordonnées (@) ──────────────────────────────

describe('validateMixed — réponses non ordonnées (@)', () => {
	test('réponses dans l\'ordre attendu', () => {
		const validators = [makeValidator('@10'), makeValidator('@20')]
		const data = makeQuestionData(validators, ['10', '20'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('réponses dans l\'ordre inverse — doit aussi être accepté', () => {
		const validators = [makeValidator('@10'), makeValidator('@20')]
		const data = makeQuestionData(validators, ['20', '10'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('trois réponses dans un ordre quelconque', () => {
		const validators = [makeValidator('@10'), makeValidator('@20'), makeValidator('@30')]
		const data = makeQuestionData(validators, ['30', '10', '20'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(true)
	})

	test('une réponse incorrecte dans le groupe', () => {
		const validators = [makeValidator('@10'), makeValidator('@20')]
		const data = makeQuestionData(validators, ['10', '99'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
	})

	test('la même valeur ne peut pas être utilisée deux fois', () => {
		// Le pool contient [10, 20]. Si l'utilisateur entre [10, 10],
		// le deuxième "10" ne trouve plus de correspondance (pool épuisé).
		const validators = [makeValidator('@10'), makeValidator('@20')]
		const data = makeQuestionData(validators, ['10', '10'])
		const {validate, result} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
	})
})

// ─── Mode silent ──────────────────────────────────────────────────────────────

describe('mode silent', () => {
	test('les messages d\'erreur ne sont pas affichés en mode silent', () => {
		const data = makeQuestionData([makeValidator('42')], ['99'])
		data.config.silent = true
		const {validate, result, errors} = useQuestionValidation(data)

		validate()

		expect(result.value.result).toBe(false)
		expect(errors.value).toHaveLength(0)
	})
})
