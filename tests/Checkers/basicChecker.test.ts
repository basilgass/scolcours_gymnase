import { EquationChecker } from "@/Checkers/Basic/EquationChecker.ts"
import { describe, expect, test } from "vitest"

describe.todo("cartesian equation checker", ()=>{
	test.todo("should recognize a line in 2d: ax+by+c=0 ")
	test.todo("should recognize a line in 2d: y=mx+h")
	test.todo("should recognize a quadratic at peak form: y=a(x-s_x)^2+s_y")
	test("should recognize a valid circle equation", () => {
		const expectedDeveloped = "x^2+y^2-2x+4y+1=0",
			expectedCentreRadius = "(x-1)^2+(y+2)^2=4"

		const checker = new EquationChecker(["circle"])

		expect(checker.check(expectedCentreRadius, expectedDeveloped).result)
			.toBe(false)
		expect(checker.check(expectedCentreRadius, expectedCentreRadius).result,)
			.toBe(true)
		expect(checker.check("x^2+y^2=5", "y^2+x^2=5").result).toBe(true)
	})
	test.todo('should recognize a 3d plane: ax+by+cz+d=0')
})
describe.todo("coordinates checker", ()=>{
	test.todo('should recognize a 2d vector with numbers')
	test.todo('should recognize a 2d vector with fractions')
	test.todo('should recognize a nth vector with numbers')
	test.todo('should recognize a nth vector with fractions')
})
describe.todo("equation checker", ()=>{
	// TODO: overlap with cartesian checker !
})
describe.todo("exact checker", ()=>{
	test.todo('should recognize same value, but in different form')
})
describe.todo("exponential checker")
describe.todo("fraction checker")
describe.todo("function checker")
describe.todo("input checker")
describe.todo("logarithm checker")
describe.todo("number checker")
describe.todo("polynom checker")
describe.todo("primitive checker")
describe.todo("rational checker")
describe.todo("scientific checker")
describe.todo("solution checker")
describe.todo("string checker")
describe.todo("vector checker")

describe.todo("order checker")
describe.todo("qcm checker")
describe.todo("study checker")
describe.todo("table of signs checker")
describe.todo("type checker")


