import {describe, test} from "vitest"
import {FunctionChecker} from "@/Checkers"

describe("function checker", () => {
	test('fonction désordrée à 3 variables', () => {
		const chk = new FunctionChecker('f')
		chk.answer = 'xyz'

		console.log(chk.checkValue('xyz'))
		console.log(chk.checkValue('yzx'))
		console.log(chk.checkValue('zyx'))
	})
})
