import { Dom, ForeignObject, G, SVG, Svg } from "@svgdotjs/svg.js"
import katex from "katex"
import type { Fraction } from "pimath/dist/maths/coefficients/fraction"
import { PiMath } from "pimath"

/**
 * Class to generate a probability tree.
 */

/**
 * Process:
 * 1. Transform a string input to data
 * 2. Generate all _branches
 * 3. Determine the _width and _height of the _svg
 * 4. Generate the _svg output
 */

// TODO: améliorer la génération d'arbre de probabilité avec des config de couleurs (label, chemin, etc...)
	// TODO: améliorer les paramètres
	// TDOD: mettre des commentaires et rendre le code plus clair.

enum ProbabilityTreeBranchResult {
	none,
	simple,
	details
}

enum ProbabilityTreeValue {
	fraction,
	percent,
	value,
	custom
}

interface ProbabilityTreeBranchConfig {
	type: ProbabilityTreeValue
	digits: number
	details?: ProbabilityTreeBranchResult
	values?: string[]
}

interface ProbabilityTreeConfigInterface {
	output: {
		result: ProbabilityTreeBranchConfig
		branch: ProbabilityTreeBranchConfig
	},
	sequence: string[]
}

interface ProbabilityTreeLeafInterface {
	node: string;
	probability: Fraction;
	branchProbability?: Fraction[];
	number?: number;
	leaves?: ProbabilityTreeLeafInterface[];
	result?: string;
	position?: { x: number; y: number };
}

export class ProbabilityTree {
	private _svg: { labels: G, lines: G }
	private _width: number
	private _height: number
	private _graph: Svg
	private _config: ProbabilityTreeConfigInterface
	private _tree: ProbabilityTreeLeafInterface
	private _nodesByDepth: number[]
	private _resultLeafIndex: number

	constructor(root: HTMLElement, data: string, parameters?: string) {
		// Create the wrapper
		const wrapper = document.createElement("DIV")
		wrapper.style.position = "relative"
		wrapper.style.width = "100%"
		wrapper.style.height = "auto"
		root.appendChild(wrapper)
		// Create the SVG element.
		this._graph = SVG().addTo(wrapper).size("100%", "100%")
		this._svg = {
			lines: this._graph.group(),
			labels: this._graph.group()
		}

		// default config
		this._config = {
			output: {
				result: {
					type: ProbabilityTreeValue.fraction,
					digits: 2,
					details: ProbabilityTreeBranchResult.simple
				},
				branch: {
					type: ProbabilityTreeValue.fraction,
					digits: 2
				}
			},
			sequence: []
		}

		// initialisation
		this._width = 800
		this._height = 800

		// Automatically parse the data if it's a string.
		if (typeof data === "string") {
			this.update(data, parameters)
		}
	}

	draw() {
		// Draw the tree using the current this._tree data.
		const { pathes } = this._consolidateTree()
		const pathesNumber = pathes.length

		// Initialise the result leaf index, used to set the custom result value.
		this._resultLeafIndex = 0

		// Draw the pathes
		this._drawLeavesFromRoot(this._tree, 50, this._height / 2, 1, 200, this._height / (pathesNumber + 1), pathesNumber)

		// Add the sequences.
		this._drawSequences()
	}

	update(data: string, parameters?: string) {
		try {
			this._config = this.parseParameters(parameters)
			this._tree = this.parse(data)
			this.draw()
		} catch (e) {
			console.warn("ProbabilityTree: les valeurs données sont erronnées.", data, parameters)
			console.error(e)
		}
	}

	_parseTypeParameter(value: string) {
		const [type, digits, details] = value.split("/")

		// Default value
		const cfg: {
			type: ProbabilityTreeValue,
			digits: number,
			details: ProbabilityTreeBranchResult,
			values: []
		} = {
			type: ProbabilityTreeValue.fraction,
			digits: 2,
			details: ProbabilityTreeBranchResult.simple,
			values: []
		}

		// Type can be p for percent, f for fraction, v for value or c for custom
		cfg.type = type === "p" ?
			ProbabilityTreeValue.percent :
			type === "v" ?
				ProbabilityTreeValue.value :
				type === "c" ?
					ProbabilityTreeValue.custom :
					ProbabilityTreeValue.fraction

		// Digits is the number of digits after the comma
		cfg.digits = digits === undefined ? 2 : +digits

		// Details can be d for details, s for simple or n for none
		cfg.details = details === undefined ? ProbabilityTreeBranchResult.simple : details === "d" ? ProbabilityTreeBranchResult.details : ProbabilityTreeBranchResult.none

		return cfg
	}

	private parse(value: string): ProbabilityTreeLeafInterface {
		// Parse the tree data: two formats are accepted:
		// 1. (name: simple) [rootname\n]A,3,B,2,5[,*] -> A is three times, B is two times, number of throws 5, optional start if reusing
		// 2. (name: custom) [rootname\n]A,3\n B,2\n C,3\n D,4\n E,2\n F,2

		// Split the data into lines
		const lines = value.split("\n").filter(x => x.length > 0)

		// Get the optional root name
		let root: string
		if (!lines[0].includes(",")) root = lines.shift()

		return {
			probability: null,
			node: root === undefined ? "" : root,
			// 1. Simple format
			// 2. Custom format
			leaves: lines.length === 1 ? this._parseSimpleInput(lines[0]) : this._parseCustomInput(lines.join("\n")),
			branchProbability: []
		}

	}

	private _consolidateTree(): { pathes: ProbabilityTreeLeafInterface[][] } {
		// Get the list of all pathes
		const pathes = this._getPathes()

		// The number of pathes determines the height of the tree.
		const pathesNumber = pathes.length
		this._height = pathesNumber * 100

		// The max depth determines the width of the tree.
		const maxDepth = pathes.reduce((accumulator, path) => Math.max(accumulator, path.length), 0)
		// Width offset when there is a result
		let widthOffset = 0
		if (this._config.output.result.details !== ProbabilityTreeBranchResult.none) {
			const showDetails = this._config.output.result.details === ProbabilityTreeBranchResult.details ? 1 : 0
			if (this._config.output.result.type === ProbabilityTreeValue.fraction) {
				widthOffset = showDetails * 50 * (maxDepth) + 50
			} else if (this._config.output.result.type === ProbabilityTreeValue.percent) {
				widthOffset = showDetails * (20 * this._config.output.result.digits + 10) * (maxDepth) + 120
			} else {
				widthOffset = showDetails * (20 * this._config.output.result.digits) * (maxDepth) + 100
			}
		}
		this._width = (maxDepth + 1) * 175 + widthOffset

		// Clean the group
		this._svg.labels.children().forEach(item => item.remove())
		this._svg.lines.children().forEach(item => item.remove())

		// Make the viewbox, depending on the _width and _height
		this._graph.viewbox(0, 0, this._width, this._height + ((this._config.sequence.length > 0) ? 50 : 0))

		// With the depth, get the number of leaves per depth.
		this._nodesByDepth = []
		for (let i = 0; i <= maxDepth; i++) {
			this._nodesByDepth.push(this._getNumberOfPathes(i))
		}

		// Go through each path from pathes.
		// Build the branchProbability.
		// if it's already here, means it was already calculated -> skip it
		pathes.forEach(path => {
			const probabilities: Fraction[] = []
			path.forEach(branch => {
				probabilities.push(branch.probability)
				if (branch.branchProbability === undefined || branch.branchProbability.length === 0) {
					branch.branchProbability = [...probabilities]
				}
			})
		})

		return { pathes }
	}

	private _addNodeLabel(value: string, x: number, y: number, labelClass?: string): ForeignObject {
		if (value === undefined) return
		// Create the foreign object
		const fo = this._graph
			.foreignObject(1, 1)
			.attr("style", "overflow:visible")

		// Add the label
		const html = `<div class="w-fit rounded-full katex-m-0 ${labelClass === undefined ? "" : labelClass}">${katex.renderToString(value, { displayMode: true })}</div>`
		fo.add(html as unknown as Dom)

		// Getting the _width and _height of the HTML element
		const w = fo.node.children[0].clientWidth,
			h = fo.node.children[0].clientHeight

		fo.width(w)
		fo.height(h)

		// Place item after the size is correct !
		fo.center(x, y)

		// add the element
		this._svg.labels.add(fo)
		return fo
	}

	private _addResultLabel(leaf: ProbabilityTreeLeafInterface) {
		if (leaf.branchProbability === undefined) {
			return ""
		}

		if (this._config.output.result.details === ProbabilityTreeBranchResult.none) {
			return ""
		}

		if (this._config.output.result.type === ProbabilityTreeValue.fraction) {
			const details = this._config.output.result.details === ProbabilityTreeBranchResult.details ? `${leaf.branchProbability.map(x => x.tex).join("\\cdot ")} = ` : ""
			return `\\scriptsize ${details}${new PiMath.Fraction().xMultiply(...leaf.branchProbability).tex}`
		} else if (this._config.output.result.type === ProbabilityTreeValue.value) {
			const digit = this._config.output.result.digits
			const details = this._config.output.result.details === ProbabilityTreeBranchResult.details ? `${leaf.branchProbability.map(x => x.value.toFixed(digit)).join("\\cdot ")} = ` : ""
			return `\\scriptsize ${details}${new PiMath.Fraction().xMultiply(...leaf.branchProbability).value.toFixed(digit)}`
		} else if (this._config.output.result.type === ProbabilityTreeValue.percent) {
			const digit = this._config.output.result.digits
			const details = this._config.output.result.details === ProbabilityTreeBranchResult.details ? `${leaf.branchProbability.map(x => (+x.value * 100).toFixed(digit) + "\\%").join("\\cdot ")} = ` : ""
			return `\\scriptsize ${details}${(new PiMath.Fraction().xMultiply(...leaf.branchProbability).value * 100).toFixed(digit)}\\% `
		} else if (this._config.output.result.type === ProbabilityTreeValue.custom) {
			const [v, asText] = this._config.output.result.values[this._resultLeafIndex].split("/T")
			this._resultLeafIndex++
			return v===undefined ? "" : asText!==undefined ? `\\text{ ${v} }`: v
		}
	}

	private _drawLeavesFromRoot(branch: ProbabilityTreeLeafInterface, x: number, y: number, depth: number, deltaX: number, deltaY: number, maxLeaves: number) {
		// Create the root label
		this._addNodeLabel(branch.node, x, y, "bg-white px-3 py-3 min-w-[3em] min-h-[3em]")

		// Adding branches
		if (branch.leaves !== undefined && branch.leaves.length > 0) {
			// Build the next node positions.

			// it's the number of nodes by depth (in a column)
			const pathes = this._nodesByDepth[depth],
				// number of leaves from this branch
				n = branch.leaves.length,
				// current x position
				posX = x + deltaX,
				// vertical distance between two leaves.
				currentDeltaY = this._height / pathes
			let posY: number

			if (n % 2 === 0) {
				// Nombre pair d'éléments dans la colonne
				posY = y - n / 2 * currentDeltaY + currentDeltaY / 2
			} else {
				// Nombre impair d'éléments dans la colonne.
				posY = y - (n - 1) / 2 * currentDeltaY
			}

			for (const leaf of branch.leaves) {
				// Draw the line.
				this._svg.lines.add(this._graph.line(x, y, posX, posY).stroke({ color: "black" }))

				// add the probability, on half way.
				const digits = this._config.output.branch.digits

				if (this._config.output.branch.type === ProbabilityTreeValue.value) {
					this._addNodeLabel(
						`${leaf.probability.value.toFixed(digits)}`,
						(x + posX) / 2, (y + posY) / 2,
						"bg-white text-xs px-2 py-1"
					)
				} else if (this._config.output.branch.type === ProbabilityTreeValue.percent) {
					this._addNodeLabel(`${(leaf.probability.value * 100).toFixed(digits)}\\%`,
						(x + posX) / 2, (y + posY) / 2,
						"bg-white text-xs px-2 py-1"
					)
				} else if (this._config.output.branch.type === ProbabilityTreeValue.fraction) {
					this._addNodeLabel(`${leaf.probability.tex}`,
						(x + posX) / 2, (y + posY) / 2,
						"bg-white text-xs px-2 py-1"
					)
				}

				// Continue with children nodes, at a depth increased by one.
				this._drawLeavesFromRoot(leaf, posX, posY, depth + 1, deltaX, deltaY, maxLeaves)
				posY += currentDeltaY
			}
		} else {
			// No more leaves, adding the result.
			this._addNodeLabel(this._addResultLabel(branch), 0, y)
				.move(x + 40, undefined)
		}
	}

	private _drawSequences() {
		// Draw the sequence only if there are some in the config.
		if (this._config.sequence.length === 0) return

		// For each sequence, add the node label at the bottom.
		const sequence = this._config.sequence
		let x = 60
		for (const seq of sequence) {
			const [v, asText] = seq.split("/T")
			this._addNodeLabel(
				asText!==undefined ? `\\text{ ${v} }` : v,
				x, this._height
			)
			x += 200
		}

	}

	private _getCurrentBranchNumberOfEndings(branch: ProbabilityTreeLeafInterface, maxDepth: number, currentDepth: number) {
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
		for (const leaf of branch.leaves) {
			n += this._getCurrentBranchNumberOfEndings(leaf, maxDepth, currentDepth + 1)
		}
		return n
	}

	private _getNumberOfPathes(depth: number): number {
		let pathes = 0

		for (const leaf of this._tree.leaves) {
			pathes += this._getCurrentBranchNumberOfEndings(leaf, depth, 1)
		}

		return pathes
	}

	private parseParameters(parameters: string): ProbabilityTreeConfigInterface {
		const cfg: ProbabilityTreeConfigInterface = {
			output: {
				result: {
					type: ProbabilityTreeValue.fraction,
					digits: 2,
					details: ProbabilityTreeBranchResult.simple
				},
				branch: {
					type: ProbabilityTreeValue.fraction,
					digits: 2
				}
			},
			sequence: []
		}

		if (parameters === undefined || parameters === null) return cfg

		// Build the parameter array:
		// key=value,key=value,key=[...values],key=[...values]/T
		// R=f/2/s,B=f/2,V=1,2,3,S=1,2,3/T
		const parms = {
			R: "f//s",
			B: "f",
			V: "",
			S: ""
		}
		let key = null
		parameters.split(/,?([A-Z])=/g).filter(x => x !== "").forEach((value, index) => {
			if (index % 2 === 0) {
				key = value
			} else {
				parms[key] = value
			}
		})

		// Get the resulting branch parameter
		cfg.output.result = this._parseTypeParameter(parms["R"])

		// Get the branch parameters
		cfg.output.branch = this._parseTypeParameter(parms["B"])

		// Get the values, if they exist, for the results.
		// parms["V"] = "value1,value2,value3"
		cfg.output.result.values = parms["V"].split(",")

		cfg.sequence = parms["S"] === "" ? [] : parms["S"].split(",")

		return cfg
	}

	private _getPathes(): ProbabilityTreeLeafInterface[][] {
		// Get all the pathes with all the leaves.
		const pathes: ProbabilityTreeLeafInterface[][] = []

		for (const leaf of this._tree.leaves) {
			pathes.push(...this._getPathesFromRoot(leaf, []))
		}
		return pathes
	}

	private _getPathesFromRoot(root: ProbabilityTreeLeafInterface, crtPath: ProbabilityTreeLeafInterface[]): ProbabilityTreeLeafInterface[][] {
		// Get all the pathes from a root
		const pathes = []

		// The root has no leaves, we return the root.
		if (root.leaves === undefined || root.leaves.length === 0) {
			pathes.push([...crtPath, root])
		} else {
			for (const leaf of root.leaves) {
				pathes.push(...this._getPathesFromRoot(leaf, [...crtPath, root]))
			}
		}
		return pathes
	}

	private _parseSimpleInput(value: string): ProbabilityTreeLeafInterface[] {
		// Get all the data
		const data = value.split(",")

		// Last element can be the repeated star trigger
		let repeat = false
		if (data[data.length - 1] === "*") {
			data.pop()
			repeat = true
		}

		// Get the number of throws
		const throws = +data.pop()

		// Throws must be a number, greater than zero and the number of data items must be even
		if (!Number.isSafeInteger(throws) || throws <= 0 || data.length % 2 === 1) return []

		// Get the number of items
		const items: { [label: string]: number } = {}
		for (let i = 0; i < data.length; i += 2) {
			items[data[i]] = +data[i + 1]
		}

		// Build the data output recursively
		return this._parseSimpleInputAddLeaves(items, 1, throws, repeat)
	}

	private _parseSimpleInputAddLeaves(items: {
		[label: string]: number
	}, crtThrow: number, maxThrows: number, repeat: boolean): ProbabilityTreeLeafInterface[] {
		// Get the max number of items
		const maxItems = Object.values(items).reduce((a, b) => a + b)

		// Add the leaves
		const result = []

		for (const key in items) {
			// Prepare items for the next throws
			// if no repeat, remove one item from the list
			const nextItems = { ...items }
			if (!repeat) nextItems[key] -= 1

			// Add the leaf
			result.push({
				node: key,
				number: items[key],
				probability: new PiMath.Fraction(items[key], maxItems),
				leaves: crtThrow < maxThrows ? this._parseSimpleInputAddLeaves(nextItems, crtThrow + 1, maxThrows, repeat) : undefined,
				branchProbability: []
			})
		}

		// Something went wrong - return an empty array
		return result
	}

	private _parseCustomInput(value: string): ProbabilityTreeLeafInterface[] {

		// Not a correct string sequence..
		if (!value.includes("\n")) return

		// Start root leaf
		let rootLeaf: ProbabilityTreeLeafInterface = {
				node: "ROOT",
				leaves: [],
				number: 0,
				probability: new PiMath.Fraction(1),
				branchProbability: []
			},
			crtLevel: number = 0

		// Split the data into lines
		const lines = value.split("\n"),
			branchLeaves = []


		for (const line of lines) {
			const prefix = line.match(/^\s*/)[0] || "",
				level = prefix.length / 3,
				sline = line.split(","),
				node = sline[0].trim(),
				value = sline[1] || 0

			if (level === crtLevel) {
				// Same level -> adding to the current root leaf.
				rootLeaf.leaves.push({
					node, number: +value,
					leaves: [],
					probability: undefined,
					branchProbability: []
				})
			} else if (level > crtLevel) {
				// it's a child node..
				crtLevel = +level
				// Add the current root to the list.
				branchLeaves.push(rootLeaf)
				// The new root leaf is the last child of the previous root.
				rootLeaf = rootLeaf.leaves[rootLeaf.leaves.length - 1]
				// Add the node
				rootLeaf.leaves.push({
					node,
					number: +value,
					leaves: [],
					probability: undefined,
					branchProbability: []
				})
			} else if (level < crtLevel) {
				// Select the new root.
				for (let i = crtLevel - level; i > 0; i--) {
					rootLeaf = branchLeaves.pop()
				}

				// Build the probabilities for all children

				crtLevel = +level
				rootLeaf.leaves.push({
					node,
					number: +value,
					leaves: [],
					probability: undefined,
					branchProbability: []
				})
			}
		}

		// Loop through all leaves and calculate the probability
		this._setProbabilityForLeaves(branchLeaves[0])

		return branchLeaves[0].leaves
	}

	private _setProbabilityForLeaves(root: ProbabilityTreeLeafInterface) {
		if (root.leaves.length === 0) return

		const maxItems = Object.values(root.leaves)
			.map(leaf => leaf.number)
			.reduce((a, b) => a + b)

		root.leaves.forEach(leaf => {
			leaf.probability = new PiMath.Fraction(leaf.number, maxItems)
			this._setProbabilityForLeaves(leaf)
		})
	}
}
