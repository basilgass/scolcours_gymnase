import {describe, expect, test} from "vitest"
import {blockTemplate} from "@/helpers/blockTemplate.ts"

describe('block Template tests', () => {
	test('no value given', ()=>{
		const template = blockTemplate('')

		expect(template.grid).toEqual('grid gap-3 grid-cols-1')
		expect(template.block).toEqual('')
		expect(template.illustration).toEqual('')
	})

	test('one value given: bi', ()=>{
		const template = blockTemplate('bi')

		expect(template.grid).toEqual('grid gap-3 grid-cols-1')
		expect(template.block).toEqual('col-span-1 order-first')
		expect(template.illustration).toEqual('col-span-1 order-last')
	})

	test('one value given: ib', ()=>{
		const template = blockTemplate('ib')

		expect(template.grid).toEqual('grid gap-3 grid-cols-1')
		expect(template.block).toEqual('col-span-1 order-last')
		expect(template.illustration).toEqual('col-span-1 order-first')
	})

	test('one value given: 2b+3i', ()=>{
		const template = blockTemplate('2b+3i')

		expect(template.grid).toEqual('grid gap-3 grid-cols-5')
		expect(template.block).toEqual('col-span-2 order-first')
		expect(template.illustration).toEqual('col-span-3 order-last')
	})

	test('one value given: 3i+2b', ()=>{
		const template = blockTemplate('3i+2b')

		expect(template.grid).toEqual('grid gap-3 grid-cols-5')
		expect(template.block).toEqual('col-span-2 order-last')
		expect(template.illustration).toEqual('col-span-3 order-first')
	})

	test('one value given: bi,md:3i+2b', ()=>{
		const template = blockTemplate('bi,md:3i+2b')

		expect(template.grid).toEqual('grid gap-3 grid-cols-1 md:grid-cols-5')
		expect(template.block).toEqual('col-span-1 order-first md:col-span-2 md:order-last')
		expect(template.illustration).toEqual('col-span-1 order-last md:col-span-3 md:order-first')
	})
})
