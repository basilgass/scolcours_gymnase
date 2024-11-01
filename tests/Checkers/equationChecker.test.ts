import { expect, test } from "vitest"
import { EquationChecker } from "../../resources/js/Checkers/Basic/EquationChecker"

// TODO: Checkers

test("should recognize a valid circle equation", () => {
	const expectedDevelopped = "x^2+y^2-2x+4y+1=0",
		expectedCentreRadius = "(x-1)^2+(y+2)^2=4"

	const checker = new EquationChecker(["circle"])

	expect(checker.check(expectedCentreRadius, expectedDevelopped).result).toBe(
		false,
	)
	expect(
		checker.check(expectedCentreRadius, expectedCentreRadius).result,
	).toBe(true)
	expect(checker.check("x^2+y^2=5", "y^2+x^2=5").result).toBe(true)
})
