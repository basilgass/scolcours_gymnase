import {expect, test} from "vitest"
import {CoordChecker} from "@/Checkers"

test('detect exact value', () => {
    const config = ''
    const expected = '(2;3)'
    const given = '(2;3)'

    const checker = new CoordChecker(config)
    const result = checker.check(expected, given)

    expect(result.result).toBeTruthy()
})

test('missing parenthesis', () => {
    const config = ''
    const checker = new CoordChecker(config)

    const expected = '(2;3)'
    const wrongValues = ['(2;3', '2;3', '2;3)']
    for (const given in wrongValues) {
        const result = checker.check(expected, given)

        expect(result.result).toBeFalsy()
        expect(result.message).toEqual("des coordonnées commencent et se terminent par des parenthèses")
    }
})

test('wrong number of values', () => {
    const config = ''
    const checker = new CoordChecker(config)

    const expected = '(2;3)'
    const wrongValues = ['(2)', '(2;3;4)']
    for (const given of wrongValues) {
        const result = checker.check(expected, given)

        expect(result.result).toBeFalsy()
        expect([
            "des coordonnées ont au moins deux valeurs, séparées par un \\(;\\)",
            "la dimension de la coordonnées ne correspond pas"]
        ).toContain(result.message)
    }
})

test('should recognize a 2d vector with numbers', () => {
    const config = "nb"
    const checker = new CoordChecker(config)

    const expected = "(2;3)"
    const given = "(2;4)"
    const result = checker.check(expected, given)

    expect(result.result).toBeFalsy()
})
test.todo('should recognize a 2d vector with fractions')
test.todo('should recognize a nth vector with numbers')
test.todo('should recognize a nth vector with fractions')
