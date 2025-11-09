import {describe, expect, test} from "vitest"
import {PiChecker, SolutionChecker} from "@/Checkers"
import AsciiMathParser from "@/asciimath2tex.ts"

describe("solution checker", () => {

	describe('contrôle qualité', () => {

		test('il faut des accolades', () => {
			const chk = new SolutionChecker()
			chk.answer = '{2;3}'

			const check = chk.check_quality('2;3')
			expect(check.result).toBe(false)
			expect(check.message).toBe("il faut au moins des accolades dans un intervalle.")
		})

		test('un intervalle contient le même nombre d\'accolade', () => {
			const chk = new SolutionChecker()
			chk.answer = '{2;3}'

			const check = chk.check_quality('{2;3}')
			expect(check.result).toBe(true)

			const checkErr1 = chk.check_quality('{2;3')
			expect(checkErr1.result).toBe(false)
			expect(checkErr1.message).toBe(`il n'y a pas le même nombre d'accolade ouvrante que fermante.`)

			const checkErr2 = chk.check_quality('2;3}')
			expect(checkErr2.result).toBe(false)
			expect(checkErr2.message).toBe(`il n'y a pas le même nombre d'accolade ouvrante que fermante.`)
		})

		test(`pas d'accolade pour les ensembles généraux`, () => {
			const chk = new SolutionChecker()
			const empty = "!!"
			chk.answer = empty

			const checkCorrect = chk.check_quality(empty)
			expect(checkCorrect.result).toBe(true)
			const checkBraces = chk.check_quality(`{${empty}}`)
			expect(checkBraces.result).toBe(false)
			expect(checkBraces.message).toBe(`${new AsciiMathParser().parse(empty)} est déjà un ensemble.`)
		})

		test(`un intervalle commence et se termine par un crochet`, () => {
			const chk = new SolutionChecker()
			chk.answer = "]2;3]"

			const checkCorrect = chk.check_quality(']2;3]')
			expect(checkCorrect.result).toBe(true)

			const checkErr1 = chk.check_quality('[2;3')
			expect(checkErr1.result).toBe(false)
			expect(checkErr1.message).toBe(`Un intervalle commence par un \\( [ \\) ou un \\( ] \\)`)

			const checkErr2 = chk.check_quality('2;3]')
			expect(checkErr2.result).toBe(false)
			expect(checkErr2.message).toBe(`Un intervalle commence par un \\( [ \\) ou un \\( ] \\)`)
		})

	})

	describe('contrôle de cohérence avec la réponse', () => {

		test('realSets vs ensemble / intervalle', () => {
			const chk = new SolutionChecker()
			chk.answer = '!!'

			const check0 = chk.check_coherences('RR')
			expect(check0.result).toBe(true)

			const check1 = chk.check_coherences('{3;2}')
			expect(check1.result).toBe(false)
			expect(check1.message).toBe("Ce n'est pas la bon type de réponse.")

			const check2 = chk.check_coherences('[3;2]')
			expect(check2.result).toBe(false)
			expect(check2.message).toBe("Ce n'est pas la bon type de réponse.")
		})

		test('intervalle vs ensemble', () => {
			const chk = new SolutionChecker()
			chk.answer = '{2;3}'

			const check0 = chk.check_coherences('{-5;4}')
			expect(check0.result).toBe(true)

			const check1 = chk.check_coherences('[3;2]')
			expect(check1.result).toBe(false)
			expect(check1.message).toBe("Ce n'est pas la bon type de réponse.")
		})
	})

	describe("comparaison d'ensembles", () => {
		const chk = new SolutionChecker()
		chk.answer = '{2;3}'

		test('il manque une réponse', () => {

			const result = chk.check_sets('{2}')

			expect(result.result).toBe(false)
			expect(result.message).toBe('Il manque 1 réponse.')
		})

		test('il y a deux réponse en trop', () => {

			const result = chk.check_sets('{2;4;5;3;8}')

			expect(result.result).toBe(false)
			expect(result.message).toContain("Il y a 3 réponses en trop.")
		})

		test('il y a le bon nombre de réponses', () => {

			const result0 = chk.check_sets('{2;3}')
			expect(result0.result).toBe(true)

			const result1 = chk.check_sets('{3;2}')
			expect(result1.result).toBe(true)

			const result3 = chk.check_sets('{2;5}')
			expect(result3.result).toBe(false)
			expect(result3.message).toContain("aucune réponse ne correspond dans les solutions.")


		})

		test('Bonnes réponses, mais mal formatées', () => {

			const result0 = chk.check_sets('{2;6/2}')
			expect(result0.result).toBe(false)
			expect(result0.partial).toBe(true)
			expect(result0.message).toContain("La réponse donnée est juste, mais pas sous la forme attendue.")
			expect(result0.message).toContain("Il faut réduire la fraction.")
		})
	})

	describe("comparaison d'intervalles (un seul intervalle)", () => {
		const chk = new SolutionChecker()
		chk.answer = "[2;4]"

		test("l'intervalle contient deux élèments", () => {
			const result1 = chk.check_interval('[2;3;4]', chk.answer)
			expect(result1.result).toBe(false)
			expect(result1.message).toBe("Un intervalle doit avoir deux bornes.")
		})

		test("l'infini doit être signé", () => {
			const result = chk.check_interval('[3;oo]', chk.answer)
			expect(result.result).toBe(false)
			expect(result.message).toBe("Le signe infini doit être signé: \\(+\\infty\\) ou \\(-\\infty\\)")
		})

		test("l'infini doit être au bon endroit", () => {
			const result = chk.check_interval('[3;-oo]', chk.answer)
			expect(result.result).toBe(false)
			expect(result.message).toBe("les deux bornes sont dans l'ordre croissant.")
		})

		test("l'infini a des crochets ouverts", () => {
			const result1 = chk.check_interval('[3;+oo]', chk.answer)
			expect(result1.result).toBe(false)
			expect(result1.message).toBe("L'infini a toujours un crochet ouvert.")

			const result2 = chk.check_interval('[-oo;3]', chk.answer)
			expect(result2.result).toBe(false)
			expect(result2.message).toBe("L'infini a toujours un crochet ouvert.")
		})

		test("les bornes sont dans l'ordre croissant", () => {
			const result1 = chk.check_interval('[8;3]', chk.answer)
			expect(result1.result).toBe(false)
			expect(result1.message).toBe("les deux bornes sont dans l'ordre croissant.")
		})

		test("la borne avec de l'inifni est fausse", () => {
			const result0 = chk.check_interval(']-oo;4[', chk.answer)
			expect(result0.result).toBe(false)
			expect(result0.message).toBe('La borne inférieure est fausse.')

			const result1 = chk.check_interval(']2;+oo[', chk.answer)
			expect(result1.result).toBe(false)
			expect(result1.message).toBe('La borne supérieure est fausse.')
		})

		test("les bornes ne correspondent pas.", () => {
			const result0 = chk.check_interval("[2;4]", chk.answer)
			expect(result0.result).toBe(true)

			const result1 = chk.check_interval("]2;8/2[", chk.answer)
			expect(result1.result).toBe(false)
			expect(result1.partial).toBe(true)
			expect(result1.message).toContain("La borne supérieure est fausse.")
			expect(result1.message).toContain("La réponse donnée est juste, mais pas sous la forme attendue.")

			const result2 = chk.check_interval("]20/10;4[", chk.answer)
			expect(result2.result).toBe(false)
			expect(result2.partial).toBe(true)
			expect(result2.message).toContain("La borne inférieure est fausse.")
			expect(result2.message).toContain("La réponse donnée est juste, mais pas sous la forme attendue.")
		})

		test("les crochets ne correspondent pas", () => {
			const result0 = chk.check_interval("]2;4]", chk.answer)
			expect(result0.result).toBe(false)
			expect(result0.message).toBe("Il y a une erreur avec les crochets")

			const result1 = chk.check_interval("[2;4[", chk.answer)
			expect(result1.result).toBe(false)
			expect(result1.message).toBe("Il y a une erreur avec les crochets")
		})

		test("passe tous les tests", () => {
			const result = chk.check_interval("[2;4]", chk.answer)
			expect(result.result).toBe(true)
		})
	})

	describe("comparaison d'intervalles (réunion d'intervalles)", () => {
		const chk = new SolutionChecker()
		chk.answer = "]-3;2[uu]5;+oo["

		test("pas le bon nombre d'intervalles", () => {
			const result = chk.check_intervals('[-3;2]')
			expect(result.result).toBe(false)
			expect(result.message).toBe('Il manque un ou plusieurs intervalle(s)')

			const result1 = chk.check_intervals('[-3;2]uu]-5;3[uu[4;5]')
			expect(result1.result).toBe(false)
			expect(result1.message).toBe('Il y a un ou plusieurs intervalle(s) en trop')
		})

		test("un intervalle ok, un intervalle ko", () => {
			const result0 = chk.check_intervals(']-3;2[uu[5;8]')
			expect(result0.result).toBe(false)
			expect(result0.message).toContain("(2) :")
			expect(result0.message).toContain(" n'est pas dans les solutions")
		})
		test("un intervalle ok, un intervalle partiel", () => {
			const result0 = chk.check_intervals(']-3;2[uu[10/2;+oo[')
			expect(result0.result).toBe(false)
			expect(result0.partial).toBe(true)
			expect(result0.message).toContain("(2) :")
			expect(result0.message).toContain("La borne inférieure est fausse")
			expect(result0.message).toContain("La réponse donnée est juste, mais pas sous la forme attendue")
		})
	})

	describe("comparaison d'ensembles avec soustraction", () => {
		const chk = new SolutionChecker()
		chk.answer = "RR_+^**\\\\{3;7}"

		test("l'ensemble de départ doit être un réel.", () => {
			const result = chk.check_realSets('[2;4]')
			expect(result.result).toBe(false)
			expect(result.message).toBe("Les solutions avec une soustraction commencent par des ensembles rééels")
		})

		test("l'ensemble de départ n'est pas le bon.", () => {
			const result = chk.check_realSets('RR')
			expect(result.result).toBe(false)
			expect(result.message).toBe("L'ensemble réel de base est faux.")
		})

		test("il manque le zéro à l'ensemble de départ", () => {
			const result = chk.check_realSets('RR_+\\\\{3;7}')
			expect(result.result).toBe(false)
			expect(result.message).toBe("L'ensemble réel de base est faux.")

			const result0 = chk.check_realSets('RR_+\\\\{0;3;7}')
			expect(result0.result).toBe(false)
			expect(result0.partial).toBe(true)
			expect(result0.message).toBe("Il ne faut pas soustraire zéro, mais mettre une étoile à l'ensemble réel")
		})

		test("Il manque la partie à soustraire", () => {
			const result = chk.check_realSets('RR_+^**')
			expect(result.result).toBe(false)
			expect(result.message).toBe("Il faut soustraire quelques éléments")
		})

		test("La partie à soustraire est en trop", () => {
			chk.answer = "RR_+^**"

			const result = chk.check_realSets('RR_+^**\\\\{3;7}')
			expect(result.result).toBe(false)
			expect(result.message).toBe("Pourquoi avoir soustrait un ensemble ?")
		})

		test("comparaison de la partie à soustraire", () => {
			chk.answer = 'RR_+^**\\\\{3;7}'
			const result = chk.check_realSets('RR_+^**\\\\{3;7}')
			expect(result.result).toBe(true)

			const result1 = chk.check_realSets('RR_+^**\\\\{7;3}')
			expect(result1.result).toBe(true)

			const result2 = chk.check_realSets('RR_+^**\\\\{6/2;7}')
			expect(result2.result).toBe(false)
			expect(result2.partial).toBe(true)
			expect(result2.message).toContain("La partie soustraite est fausse")
			expect(result2.message).toContain("La réponse donnée est juste, mais pas sous la forme attendue.")
		})

	})
})

describe('Exercice specific checking (debug)', () => {
	test('exercice équation trigonométrique élémentaire du premier degré (i) => 1', () => {
		const solChk = new PiChecker('sol,checker:trigo,p')

		const chk1 = solChk.check('{13pi/18+k2pi/3;pi/2+k2pi/3}', '{pi/2+k2pi/3;13pi/18+k2pi/3}')
		expect(chk1.result).toBe(true)

		const chk2 = solChk.check('{-5pi/6+k2pi/3;13pi/18+k2pi/3}', '{pi/2+k2pi/3;13pi/18+k2pi/3}')
		expect(chk2.result).toBe(true)

		const chk3 = solChk.check('{13pi/18+k2pi/3;-5pi/6+k2pi/3}', '{pi/2+k2pi/3;13pi/18+k2pi/3}')
		expect(chk3.result).toBe(true)
	})
})
