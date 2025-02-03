interface blockTemplateInterface {
	grid: string 			// wrapper grid class
	block: string			// block class
	illustration: string	// illustration class

}

export function blockTemplate(value: string): blockTemplateInterface {

	// Empty, null or undefined value.
	if (!value) {
		return {
			grid: "grid gap-3 grid-cols-1",
			block: "",
			illustration: ""
		}
	}

	// Split the values
	const values = value
		.split(",")
		.filter((x) => x !== "")

	const grid: string[] = ['grid gap-3']
	const block: string[] = []
	const illustration: string[] = []

	values.forEach(value => {
		const data = blockTemplate_for_breakpoint(value)

		grid.push(data.grid)
		block.push(data.block)
		illustration.push(data.illustration)
	})

	return {
		grid: grid.join(' '),
		block: block.join(' '),
		illustration: illustration.join(' ')
	}
}

function blockTemplate_for_breakpoint(value: string): blockTemplateInterface {
	let media = ''
	let data: string

	if (value.includes(':')) {
		[media, data] = value.split(':')
		media = media + ':'
	} else {
		data = value
	}

	// possible values
	// bi | ib (block over | under illustration)
	// <#>b+<#>i (block left | right of illustration)
	if (data.includes('+')) {
		const [left, right] = data.split('+')
		// left can be: b | i | #b | #i
		const leftClass = blockTemplate_element_class(left)
		const rightClass = blockTemplate_element_class(right)

		const gridSize = leftClass.size + rightClass.size
		const blockClass = leftClass.element === 'b' ? leftClass : rightClass
		const illustrationClass = leftClass.element === 'i' ? leftClass : rightClass

		// 3b+2i => B: order-1, I: order-4
		return {
			grid: `${media}grid-cols-${gridSize}`,
			block: `${media}${blockClass.css} ${media}order-${leftClass.element === 'b' ? 'first' : 'last'}`,
			illustration: `${media}${illustrationClass.css} ${media}order-${leftClass.element === 'i' ? 'first' : 'last'}`
		}
	}

	// Block and Illustration are one over the other.
	return {
		grid: 'grid-cols-1',
		block: data[0] === 'b' ? "col-span-1 order-first" : "col-span-1 order-last",
		illustration: data[0] === 'i' ? "col-span-1 order-first" : "col-span-1 order-last"
	}
}

function blockTemplate_element_class(value: string): { element: 'b' | 'i', size: number, css: string } {
	// can be: b | i | #b | #i
	if (value.length === 1) {
		return {
			element: value === 'i' ? 'i' : 'b',
			size: 1,
			css: 'col-span-1'
		}
	}

	const key = value[value.length - 1]

	const element = key === 'i' ? 'i' : 'b'

	const size = +value.substring(0, value.length - 1)

	const css = size === 0 ? 'hidden' : `col-span-${size}`

	return {element, size, css}
}
