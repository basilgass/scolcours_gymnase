import {Fraction} from "pimath/esm/maths/coefficients/fraction"
import {SVG} from "@svgdotjs/svg.js"
import katex from "katex"

// TODO: améliorer la génération d'arbre de probabilité avec des options de couleurs (label, chemin, etc...)


export class ProbabilityTree {
	constructor(root, data) {
		this.svg = null
		this.width = 800
		this.height = 800

		const wrapper = document.createElement("DIV")
		wrapper.style.position = "relative"
		wrapper.style.width = "100%"
		wrapper.style.height = "auto"
		root.appendChild(wrapper)

		// Create the SVG element.
		this.graph = SVG().addTo(wrapper).size("100%", "100%")
		this.graph.viewbox(0, 0, this.width, this.height)
		this.svg = this.graph.group()

		this.depth = 0
		this.branches = []

		this.config = {
			output: {
				result: {
					type: ["fraction", "percent", "value"][0],
					digits: 1
				},
				branch: {
					type: ["fraction", "percent", "value"][1],
					digits: 1
				}
			}
		}

		if (data !== undefined) {
			this.update(data)
		}
	}

	_addNodeLabel(value, x, y, labelClass) {
		const fo = this.svg
			.foreignObject(1, 1)
			.attr("style", "overflow:visible")
			.add(`<div class="w-fit rounded-full katex-m-0 ${labelClass === undefined ? "" : labelClass}">${katex.renderToString(value, {displayMode: true})}</div>`)

		// Getting the width and height of the HTML element
		const w = fo.node.children[0].clientWidth,
			h = fo.node.children[0].clientHeight

		fo.width(w)
		fo.height(h)

		// Place item after the size is correct !
		fo.center(x, y)

		// add the element
		this.svg.add(fo)
		return fo
	}

	_drawLeavesFromRoot(branch, x, y, depth, deltaX, deltaY, maxLeaves) {
		// Root node
		// this.svg.add(this.svg.circle(60).center(x, y).fill("white"))
		this._addNodeLabel(branch.node, x, y, "bg-white px-3 py-3 min-w-[3em] min-h-[3em]")

		// Adding branches
		if (branch.leaves !== undefined && branch.leaves.length > 0) {
			// Build the next node positions.
			let pathes = this._getNumberOfPathes(depth), n = branch.leaves.length, posX = x + deltaX, posY,
				currentDeltaY = this.height / pathes


			if (n % 2 === 0) {
				// Nombre pair d'éléments dans la colonne
				posY = y - n / 2 * currentDeltaY + currentDeltaY / 2
			} else {
				// Nombre impair d'éléments dans la colonne.
				posY = y - (n - 1) / 2 * currentDeltaY
			}

			for (let leaf of branch.leaves) {
				// Draw the line.
				this.svg.add(this.svg.line(x, y, posX, posY).stroke({color: "black"}))

				// add the probability, on half way.
				let digits = this.config.output.branch.digits
				if (this.config.output.branch.type === "value") {
					this._addNodeLabel(`${leaf.probability.value.toFixed(digits)}`, (x + posX) / 2, (y + posY) / 2, "bg-white text-xs px-2 py-1")
					// foText = this.svg.foreignObject(40, 40).add(SVG(`<div class="bg-white text-center">\\(${leaf.probability.value.toFixed(digits)}\\)</div>`))
				} else if (this.config.output.branch.type === "percent") {
					this._addNodeLabel(`${leaf.probability.value.toFixed(digits)}\\%`, (x + posX) / 2, (y + posY) / 2, "bg-white text-xs px-2 py-1")
					// foText = this.svg.foreignObject(40, 40).add(SVG(`<div class="bg-white text-xs text-center">\\(${leaf.probability.value.toFixed(digits)}\\% \\)</div>`))
				} else {
					this._addNodeLabel(`${leaf.probability.tex}`, (x + posX) / 2, (y + posY) / 2, "bg-white text-xs px-2 py-1")
					// foText = this.svg.foreignObject(40, 40).add(SVG(`<div class="bg-white text-center">\\(${leaf.probability.tex}\\)</div>`))
				}

				// Add the ending node
				// this.svg.add(this.svg.circle(60).center(posX, posY).fill("white"))
				// this.svg.add(this.svg.text(leaf.node).font({"anchor": "middle"})
				// 	.center(posX, posY))
				this._addNodeLabel(leaf.node, posX, posY)

				this._drawLeavesFromRoot(leaf, posX, posY, depth + 1, deltaX, deltaY, maxLeaves)
				posY += currentDeltaY
			}
		} else {
			this._addNodeLabel(branch.result, x + 100, y)
			// this.svg.add(this.svg.foreignObject(200, 30).add(SVG()).center(x + 140, y).x(x + 40))
		}
	}

	_generateFromString(data, throws, root) {
		// Parse the tree data
		let items = {}

		for (let i = 0; i < data.length; i += 2) {
			items[data[i]] = +data[i + 1]
		}

		this._tree = {
			node: root === undefined ? "" : root, leaves: [], branchProbability: []
		}

		this._tree.leaves = this._generateFromString_LeavesFromRoot(items, throws, 1, [])
	}

	_generateFromArray(items, root) {
		// Build from an array
		// [
		//	{ node, value, leaves }
		// ]

		this._tree = {
			node: root === undefined ? "" : root, leaves: [], branchProbability: []
		}

		this._tree.leaves = this._generateFromArray_LeavesFromRoot(items, [])
	}

	_generateFromArray_LeavesFromRoot(items, branchProbability) {
		// Get the number of items in all children.
		const maxItems = Object.values(items).reduce((accumulator, a) => +a.value + accumulator, 0)

		let leaves = []

		for (let item of items) {
			let L = {
				node: item.node,
				probability: new Fraction(+item.value, maxItems),
				branchProbability: [...branchProbability, new Fraction(+item.value, maxItems)]
			}

			if (item.leaves !== undefined && item.leaves.length > 0) {
				L.leaves = this._generateFromArray_LeavesFromRoot(item.leaves, L.branchProbability)
			} else {
				L.result = this._consolidateTreeBranchResult(L.branchProbability)
			}

			leaves.push(L)
		}

		return leaves
	}

	// _consolidateTree(){
	// 	// TODO: maybe run a consolidate over a custom value ?
	// 	// Each element from the tree is.
	// 	// {node, probability, branchProbability, leaves?, result?}
	// 	//
	// 	// Go through each items and fill the blank if needed.
	// 	for(let leaf of this._tree.leaves){
	// 		// Build the children leaves.
	// 		this._consolidateTreeFromRoot(leaf)
	// 	}
	// }
	//
	// _consolidateTreeNode(leaf){
	// 	if(leaf.node===undefined){leaf.node = ""}
	// 	if(leaf.probability===undefined){leaf.probability = new Fraction().zero()}
	// 	if(leaf.branchProbability===undefined){
	// 		leaf.branchProbability=[leaf.probability]
	// 	}else{
	// 		leaf.branchProbability = [...leaf.branchProbability, leaf.probability]
	// 	}
	// 	if(leaf.leaves===undefined || leaf.leaves.length===0){leaf.result = this._consolidateTreeBranchResult(leaf.branchProbability)}
	// }
	//
	// _consolidateTreeFromRoot(root){
	// 	// Consolidate the current node value
	// 	this._consolidateTreeNode(root)
	//
	// 	// Consolidate each leaves...
	// 	if(root.leaves!==undefined && root.leaves.length>0){
	// 		for(let leaf of root.leaves){
	// 			this._consolidateTreeNode(leaf)
	// 		}
	// 	}
	// }

	_consolidateTreeBranchResult(branchProbability) {
		if (this.config.output.result.type === "fraction") {
			return `\\scriptsize ${branchProbability.map(x => x.tex).join("\\cdot ")} = ${new Fraction().xMultiply(...branchProbability).tex}`
		} else if (this.config.output.result.type === "value") {
			const digit = this.config.output.result.digits
			return `\\scriptsize ${branchProbability.map(x => x.value.toFixed(digit)).join("\\cdot ")} = ${new Fraction().xMultiply(...branchProbability).value.toFixed(digit)}`
		} else if (this.config.output.result.type === "percent") {
			const digit = this.config.output.result.digit
			return `\\scriptsize ${branchProbability.map(x => (+x.value * 100).toFixed(digit) + "\\%").join("\\cdot ")} = ${(new Fraction().xMultiply(...branchProbability).value * 100).toFixed(digit)}\\% `
		}
	}

	_generateFromString_LeavesFromRoot(items, throws, crtThrow, branchProbability) {
		const maxItems = Object.values(items).reduce((a, b) => a + b)

		let leaves = []

		for (let key in items) {
			let L = {
				node: key,
				probability: new Fraction(items[key], maxItems),
				branchProbability: [...branchProbability, new Fraction(items[key], maxItems)]
			}

			if (crtThrow < throws) {
				// If we don't push the ball again inside...
				let newItems = {}
				for (let k in items) {
					newItems[k] = k === key ? Math.max(0, items[k] - 1) : items[k]
				}

				L.leaves = this._generateFromString_LeavesFromRoot(newItems, throws, crtThrow + 1, [...L.branchProbability])
			} else {
				// L.result = "done"
				L.result = this._consolidateTreeBranchResult(L.branchProbability)
			}

			leaves.push(L)
		}
		return leaves
	}

	_getAllBranches() {
		let result = []
		for (let leaf of this._tree.leaves) {
			if (leaf.leaves === undefined || leaf.leaves.length === 0) {
				continue
			}
			for (let branch of this._getAllBranchesFromRoot(leaf)) {
				result.push([{node: leaf.node, probability: leaf.probability}, ...branch])
			}
		}
		return result
	}

	_getAllBranchesFromRoot(root) {
		let result = [], probabilities = []
		for (let leaf of root.leaves) {
			if (leaf.leaves === undefined || leaf.leaves.length === 0) {
				// We reached an end.
				result.push([{node: leaf.node, probability: leaf.probability}])
			} else {
				for (let branch of this._getAllBranchesFromRoot(leaf)) {
					result.push([{node: leaf.node, probability: leaf.probability}, ...branch])
				}
			}
		}

		return result
	}

	_getCurrentBranchDepth(depth, branch) {
		if (branch.leaves !== undefined && branch.leaves.length > 0) {
			let leafDepth = 0
			for (let leaf of branch.leaves) {
				leafDepth = Math.max(this._getCurrentBranchDepth(depth + 1, leaf), leafDepth)
			}
			return leafDepth
		} else {
			return depth
		}
	}

	_getCurrentBranchNumberOfEndings(branch, maxDepth, currentDepth) {
		// We are above the maxdepth - do not count any more !
		if (currentDepth > maxDepth) {
			return 0
		}

		// If there is no leaves, just add one.
		if (branch.leaves === undefined || branch.leaves.length === 0 || branch.result) {
			return 1
		}

		// We reached the number of allowed depth - do not get the child leaves.
		if (currentDepth === maxDepth) {
			return 1
		}

		// Count child leaves.
		let n = 0
		for (let leaf of branch.leaves) {
			n += this._getCurrentBranchNumberOfEndings(leaf, maxDepth, currentDepth + 1)
		}
		return n
	}

	_getNumberOfPathes(depth) {
		// TODO: Rewrite to use the branches array.
		let pathes = 0, maxDepth = (depth === undefined || depth === 0) ? this.depth : depth

		for (let leaf of this._tree.leaves) {
			pathes += this._getCurrentBranchNumberOfEndings(leaf, maxDepth, 1)
		}

		return pathes
	}

	_load() {
		// Clean the group
		this.svg.children().forEach(item => item.remove())

		const pathes = this._getNumberOfPathes(), w = this.width, h = this.height,
			deltaX = (w - 100 - 200) / this.depth, deltaY = h / (pathes + 1)

		let x = 50, y = h / 2

		this._drawLeavesFromRoot(this._tree, x, y, 1, deltaX, deltaY, pathes)

		// Go through each element and move the lines to the back.
		for (let a of this.svg.children()) {
			if (a.type === "line") {
				a.back()
			}
			if (a.type === "text") {
				a.front()
			}
		}
		return this
	}

	_preprocess(data) {
		// Generate all branches
		this.branches = this._getAllBranches()
		this.depth = this.branches.reduce((accumulator, b) => Math.max(accumulator, b.length), 0)

		this._load()
	}

	_validateUserInput(input) {
		if (input === undefined) {
			// Default display.
			this._generateFromString("U,3,P,2", 3)
		} else if (input.data !== undefined && input.throws !== undefined) {
			// From string and number of throws
			this._generateFromString(input.data, input.throws)
		} else {
			// It's an array of objects
			// [ {node, probability, leaves[]} ]
			this._generateFromArray(input)
		}

		return true
	}

	update(data) {
		// Build the tree
		this._validateUserInput(data)

		// Prepare and build the svg output
		this._preprocess()
	}

	branchOutput(key, value) {
		if (["fraction", "percent", "value"].includes(key)) {
			this.config.output.branch.type = key
		}
		if (Number.isSafeInteger(+value)) {
			this.config.output.branch.digits = value
		}
	}

	resultOutput(key, value) {
		if (["fraction", "percent", "value"].includes(key)) {
			this.config.output.result.type = key
		}
		if (Number.isSafeInteger(+value)) {
			this.config.output.result.digits = value
		}
	}
}
