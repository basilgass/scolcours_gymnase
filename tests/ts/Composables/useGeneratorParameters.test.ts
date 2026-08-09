import {describe, expect, test} from "vitest"
import {resolveParameters} from "@/Composables/useGeneratorParameters.ts"
import type {GeneratorParameterSchemaEntry} from "@/types/challengeInterfaces.ts"

type Schema = Record<string, GeneratorParameterSchemaEntry>

describe('resolveParameters — cast par format', () => {
	test('number : default et override castés en Number', () => {
		const schema: Schema = {n: {format: 'number', default: '3'}}
		expect(resolveParameters(schema, null)).toEqual({n: 3})
		expect(resolveParameters(schema, {n: '7'})).toEqual({n: 7})
	})

	test('string : identité', () => {
		const schema: Schema = {s: {format: 'string', default: 'hello'}}
		expect(resolveParameters(schema, null)).toEqual({s: 'hello'})
		expect(resolveParameters(schema, {s: 'world'})).toEqual({s: 'world'})
	})

	test('set : parsé en tableau de nombres', () => {
		const schema: Schema = {d: {format: 'set', default: '-2..2'}}
		expect(resolveParameters(schema, null)).toEqual({d: [-2, -1, 0, 1, 2]})
	})

	test('choices : identité (string brute)', () => {
		const schema: Schema = {c: {format: 'choices', default: 'a', choices: 'a,b,c'}}
		expect(resolveParameters(schema, {c: 'b'})).toEqual({c: 'b'})
	})
})

describe('resolveParameters — format boolean', () => {
	test('default "true" casté en true', () => {
		const schema: Schema = {flag: {format: 'boolean', default: 'true'}}
		expect(resolveParameters(schema, null)).toEqual({flag: true})
	})

	test('default "false" casté en false', () => {
		const schema: Schema = {flag: {format: 'boolean', default: 'false'}}
		expect(resolveParameters(schema, null)).toEqual({flag: false})
	})

	test('override "true" prime sur le default', () => {
		const schema: Schema = {flag: {format: 'boolean', default: 'false'}}
		expect(resolveParameters(schema, {flag: 'true'})).toEqual({flag: true})
	})

	test('toute valeur non "true" est false', () => {
		const schema: Schema = {flag: {format: 'boolean', default: 'xyz'}}
		expect(resolveParameters(schema, null)).toEqual({flag: false})
		expect(resolveParameters(schema, {flag: '1'})).toEqual({flag: false})
		expect(resolveParameters(schema, {flag: ''})).toEqual({flag: false})
	})
})

describe('resolveParameters — sans schéma (legacy)', () => {
	test('overrides passés bruts (strings) sans casting', () => {
		expect(resolveParameters(null, {flag: 'true', n: '3'})).toEqual({flag: 'true', n: '3'})
	})
})
