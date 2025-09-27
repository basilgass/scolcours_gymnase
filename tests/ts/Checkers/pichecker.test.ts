import {expect, test} from "vitest"
import {CHECKERS} from "@/Checkers/checker.config.ts"
import {checkersList, PiChecker} from "@/Checkers/PiChecker.ts"

test('PiChecker should parse a single checker', () => {
    const config = 'number,2'

    const checker = new PiChecker(config).checker

    expect(checker.type).toBe(CHECKERS.NUMBER)
    expect(checker.config).toHaveLength(1)
    expect(checker.config[0]).toBe('2')

})

test('PiChecker should parse a checker with a secondary checker', () => {
    const config = 'coord,checker:fraction'

    const checker = new PiChecker(config)

    expect(checker.checker.type).toBe(CHECKERS.COORDINATES)
    expect(checker.secondaryChecker?.type).toBe(CHECKERS.FRACTION)
})

test('Every checkers should match answer=given', () => {
    const pichecker = new PiChecker()
    const list = checkersList()

    const answer = 'hello'
    const given = 'hello'

    Object.values(list).forEach((checkerClass) => {
        pichecker.checker = new checkerClass()

        expect(pichecker.check(given, answer).result).toBeTruthy()
    })
})
