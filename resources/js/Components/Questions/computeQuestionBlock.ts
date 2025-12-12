import {keyboardEventInterface} from "@/Components/Questions/QuestionInterface.ts"

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

export function replace_ABC_inline(md: string, index, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ... inline
	return md.replaceAll(
		new RegExp(`${key}`, "gm"),
		`<span data-answer-index="${index}" class="border px-3 py-1 inline-block ${color}">${
			answer.raw ?
				answer.raw :
				"< ? >"
		}</span>`)
}

export function replace_ABC_inline_no_div(md: string, index, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ... inline
	return md.replaceAll(
		new RegExp(`_${key}`, "gm"),
		answer.raw ?
			answer.raw :
			`<span data-answer-index="${index}" class="px-3 ${color}">< ? ></span>`
	)
}

export function replace_ABC_without_placeholder(md: string, index, key: string, answer: keyboardEventInterface, color: string): string {
	// @$A, @$B, ...
	return md.replaceAll(
		new RegExp(`@(${key})`, "gm"),
		`\n<div data-answer-index="${index}" class="border px-3 py-1 ${color}">${
			answer.raw
		}\n</div>`)
}
