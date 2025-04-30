import {expect, test} from "vitest"
import {NumberChecker} from "@/Checkers"

test('detect exact value', () => {
    const config = '3'
    const expected = '1.234'
    const given = '1.234'

    const checker = new NumberChecker(config)
    const result = checker.check(expected, given)

    expect(result.result).toBeTruthy()
})

test('detect similar value, not strict', () => {
    const config = '3'
    const expected = '1.230'
    const given = '1.23'

    const checker = new NumberChecker(config)
    const result = checker.check(expected, given)

    expect(result.result).toBeTruthy()
})

test('detect similar value, strict', () => {
    const config = '3,s'
    const expected = '1.230'
    const given = '1.23'
    const given0 = '1.230'

    const checker = new NumberChecker(config)
    const result = checker.check(expected, given)
    const result0 = checker.check(expected, given0)

    expect(result.result).toBeFalsy()
    expect(result0.result).toBeTruthy()
})

test('wrong number of decimals', () => {
    const config = '3'
    const expected = '1.234'
    const given = '1.23'

    const checker = new NumberChecker(config)
    const result = checker.check(expected, given)

    expect(result.result).toBeFalsy()
    expect(result.message).toEqual('Il faut 3 chiffre(s) après la virgule.')
})

test('near answer detection', () => {
    const config = '3'
    const expected = '1.234'
    const given = '1.235'
    const given1 = '1.233'
    const given2 = '1.236'

    const checker = new NumberChecker(config)
    const result = checker.check(expected, given)
    const result1 = checker.check(expected, given1)
    const result2 = checker.check(expected, given2)

    expect(result.result).toBeFalsy()
    expect(result.message).toEqual('Peut être un problème d\'arrondi ?')

    expect(result1.result).toBeFalsy()
    expect(result1.message).toEqual('Peut être un problème d\'arrondi ?')

    expect(result2.result).toBeFalsy()
    expect(result2.message).to.not.equal('Peut être un problème d\'arrondi ?')
})
