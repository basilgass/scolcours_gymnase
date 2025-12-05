import {expect, test} from "vitest"
import {EquationChecker} from "@/Checkers"

test.todo("should recognize a line in 2d: ax+by+c=0 ")
test.todo("should recognize a line in 2d: y=mx+h")
test.todo("should recognize a quadratic at peak form: y=a(x-s_x)^2+s_y")
test("should recognize a valid circle equation", () => {
	const expectedDeveloped = "x^2+y^2-2x+4y+1=0",
		expectedCentreRadius = "(x-1)^2+(y+2)^2=4"

	const checker = new EquationChecker(["circle"])

	// Si la réponse est un centre-rayon, la donnée doit l'être
	expect(checker.check(expectedDeveloped, expectedCentreRadius).result)
		.toEqual(false)

	expect(checker.check(expectedCentreRadius, expectedCentreRadius).result,)
		.toEqual(true)

	expect(checker.check("x^2+y^2=5", "y^2+x^2=5").result).toEqual(true)
})
test.todo('should recognize a 3d plane: ax+by+cz+d=0')
