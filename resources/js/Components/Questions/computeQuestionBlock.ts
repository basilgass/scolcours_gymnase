import {computed} from "vue"
import {keyboardEventInterface, questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function makeKey(i: number): string {
	return `\\$${alphabet[i]}`
}

export function replace_abc_toTex(md: string, index: number, key: string, answer: keyboardEventInterface, color: string): string {
	// $a, $b, ...
	// console.log(md)
	// console.log(key)
	// console.log(answer)
	// console.log(color)
	// const r = new RegExp(`${key.toLowerCase()}`, "gm")
	// console.log(r)
	//
	// console.log('MATCH', md.match(r))
	return md.replaceAll(
		new RegExp(`${key.toLowerCase()}`, "gm"),
		`\\htmlData{answer-index=${index}}{\\textcolor{${color}}{${
			answer.tex ?
				answer.tex :
				"<\\;?>"
		}}}`)
}

export function replace_ABC_toBlock(md: string, index: number, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ...
	return md.replaceAll(
		new RegExp(`\n${key}`, "gm"),
		`\n<div data-answer-index="${index}" class="border p-3 ${color}">\n\n${
			answer.raw ?
				answer.raw :
				"< ? >"

		}\n\n</div>`)
}

export function replace_ABC_inline(md: string, index: number, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ... inline
	return md.replaceAll(
		new RegExp(`${key}`, "gm"),
		`<span data-answer-index="${index}" class="border px-3 py-1 inline-block ${color}">${
			answer.raw ?
				answer.raw :
				"< ? >"
		}</span>`)
}

export function replace_ABC_inline_no_div(md: string, index: number, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ... inline
	return md.replaceAll(
		new RegExp(`_${key}`, "gm"),
		answer.raw ?
			answer.raw :
			`<span data-answer-index="${index}" class="px-3 ${color}">< ? ></span>`
	)
}

export function replace_ABC_without_placeholder(md: string, index: number, key: string, answer: keyboardEventInterface, color: string): string {
	// @$A, @$B, ...
	return md.replaceAll(
		new RegExp(`@(${key})`, "gm"),
		`\n<div data-answer-index="${index}" class="border px-3 py-1 ${color}">${
			answer.raw
		}\n</div>`)
}

/**
 * Composable extrayant les computed `body` et `illustration` depuis questionData.
 * Pipeline d'application (ordre important) :
 *   1. replace_abc_toTex    — $a/$b en TeX (lowercase)
 *   2. replace_ABC_toBlock  — $A/$B en bloc (commence une ligne)
 *   3. replace_ABC_without_placeholder — @$A/@$B sans placeholder
 *   4. replace_ABC_inline_no_div       — _$A/_$B inline sans div
 *   5. replace_ABC_inline              — $A/$B inline
 */
export function useQuestionBlock(questionData: questionDataInterface) {
	const body = computed(() => {
		if (!questionData.answers.coherences.value) {
			return questionData.block.value.body +
				"\n\n Il manque des réponses {.text-xs .text-center .text-red-500 .bg-red-100 .py-2 .font-code}"
		}

		let md = questionData.block.value.body

		for (let i = 0; i < questionData.answers.variables.value.length; i++) {
			const key = makeKey(i)
			const answer: keyboardEventInterface = questionData.user.answers.value[i]

			const texColor = i === questionData.current.id.value ? "cornflowerblue" : "red"
			const rawColor = i === questionData.current.id.value ? "border-blue-600" : "border-red-600"
			const rawTextColor = i === questionData.current.id.value ? "text-blue-600" : "text-red-600"

			md = replace_abc_toTex(md, i, key, answer, texColor)
			md = replace_ABC_toBlock(md, i, key, answer, rawColor)
			md = replace_ABC_without_placeholder(md, i, key, answer, rawColor)
			md = replace_ABC_inline_no_div(md, i, key, answer, rawTextColor)
			md = replace_ABC_inline(md, i, key, answer, rawColor)
		}
		return md
	})

	const illustration = computed(() => {
		let code = questionData.block.value.illustration.code
		for (let i = 0; i < questionData.answers.variables.value.length; i++) {
			const key = makeKey(i)
			const answer: keyboardEventInterface = questionData.user.answers.value[i]
			const texColor = i === questionData.current.id.value ? "cornflowerblue" : "red"
			code = replace_abc_toTex(code, i, key, answer, texColor)
		}
		return { ...questionData.block.value.illustration, code }
	})

	return { body, illustration }
}
