import {
	Bezier,
	BEZIERCONTROL,
	COORDINATE_SYSTEM,
	DOMAIN,
	IBezierConfig,
	IBezierPointInterface,
	Line,
	Path,
	PiGraph,
	Plot,
	Point,
	XY
} from "pidraw"
import katex from "katex"
import {Line as mLine, NumExp} from "pimath"

export interface studyConfigInterface {
	buttons: {
		available: studyButtonsKeysType[],
		auto: boolean,
		live: boolean
	}
	draw: {
		config: studyDrawConfigInterface
	},
	plot: {
		enable: boolean,
		fx: string
	},
	show: {
		fx: string[],			// affichage un graph durant l'initialisation.
		graph: boolean,
		raw: boolean
	},
}

export interface studyDrawConfigInterface {
	ppu: number
	xMax: number,
	xMin: number,
	xUnit: number,
	yMax: number,
	yMin: number,
	yUnit: number,
}

export const studyButtonKeys = ["av", "ah", "ao", "!", "p", "z", "o", "t", "m", "M", "_"] as const
export type studyButtonsKeysType = typeof studyButtonKeys[number]

export interface studyItemType {
	display: string
	key: string,
}

export enum ITEM_TYPES {
	POINT = "point",
	AO = "ao",
	AV = "av",
	AH = "ah",
	TRACE = "trace"
}

export const STUDY_CONTROLS_KEYS = ["LT", "RT", "LB", "RB"]

export interface ASYMPTOTES_CONTROLS {
	"LB": Point
	"LT": Point
	"RB": Point
	"RT": Point
}

interface BEZIER_CONTROL_POINT {
	control: BEZIERCONTROL
	point: Point,
}

export interface BEZIER_CONTROLS {
	"LB": BEZIER_CONTROL_POINT[]
	"LT": BEZIER_CONTROL_POINT[]
	"RB": BEZIER_CONTROL_POINT[]
	"RT": BEZIER_CONTROL_POINT[]
}

export enum POINT_TYPES {
	MIN = "m",
	MAX = "M",
	REPLAT = "_",
	TROU = "t",
	ZERO = "z",
	ORDONNEE = "o",
	QUELCONQUE = "p"
}

export interface itemGraphInterface {
	bezier?: BEZIER_CONTROLS
	beziercontrol?: BEZIERCONTROL
	controls: ASYMPTOTES_CONTROLS | { bar: Path } // Record<string, Point>
	element: Point | Path | Line
	id: string,
	kind?: POINT_TYPES
	type: ITEM_TYPES
}


export interface studyButtonType {
	description: string,
	group: string,
	label: string,
}

export const kbrdStudyButtons: Record<studyButtonsKeysType, studyButtonType> = {
	"ah": {
		label: "AH", description: "asymptote verticale", group: 'asymptotes'
	},
	"av": {
		label: "AV", description: "asymptote horizontale", group: 'asymptotes'
	},
	"ao": {
		label: "AO", description: "asymptote oblique", group: 'asymptotes'
	},
	"!": {
		label: "rien", description: "aucune asymptote", group: 'asymptotes'
	},
	"p": {
		label: "point", description: "point quelconque", group: 'points'
	},
	"z": {
		label: "zéro", description: "zéro", group: 'points'
	},
	"o": {
		label: "ordonnée", description: "ordonnée à l'origine", group: 'points'
	},
	"t": {
		label: "trou", description: "trou", group: 'points'
	},
	"m": {
		label: "min", description: "minimum", group: 'dérivées'
	},
	"M": {
		label: "max", description: "maximum", group: 'dérivées'
	},
	"_": {
		label: "replat", description: "replat", group: 'dérivées'
	}
}

export class StudyGraph extends PiGraph {
	protected _loadControls: boolean
	protected _size: number

	constructor(el: HTMLElement, loadControls: boolean) {
		super(el, {
			tex: (value: string) => katex.renderToString(value, {throwOnError: false})
		})

		this._size = 2 * this.toPixels(1) / 3

		this._loadControls = loadControls
		this.addEnvTracePoints()
	}

	get BBox(): { x: DOMAIN, y: DOMAIN } {
		if (this.config.system !== COORDINATE_SYSTEM.CARTESIAN_2D) {
			return null
		}

		return {
			x: {
				min: (0 - this.config.origin.x) / this.config.axis.x.x,
				max: (this.config.width - this.config.origin.x) / this.config.axis.x.x
			},
			y: {
				min: (0 - this.config.origin.y) / (-this.config.axis.y.y),
				max: (this.config.height - this.config.origin.y) / (-this.config.axis.y.y)
			}
		}
	}

	protected _items: itemGraphInterface[] = []

	get items(): itemGraphInterface[] {
		return this._items
	}

	protected _plots: Bezier[] = []

	get plots(): (Bezier | Plot)[] {
		return this._plots
	}

	addAH(value: string): itemGraphInterface {
		const y = (new NumExp(value)).evaluate({})
		const x = this.BBox.x
		const posY = this.toPixels({x: 0, y}).y

		const p = this.makeLine({x: 0, y: posY}, {x: 1, y: 0})
		p.stroke('green')

		const el = {
			id: `y=${value}`,
			type: ITEM_TYPES.AH,
			kind: null,
			element: p,
			controls: this.addControls([
				[x.min + 0.5, y + 0.5],//LT
				[x.max - 0.5, y + 0.5],//RT
				[x.min + 0.5, y - 0.5],//LB
				[x.max - 0.5, y - 0.5]//RB
			]),
			bezier: this.addBezierControls([
				[x.min, y + 0.1, x.min - 10, y + 0.05],//LT
				[x.max, y + 0.1, x.max + 10, y + 0.05],//RT
				[x.min, y - 0.1, x.min - 10, y - 0.05],//LB
				[x.max, y - 0.1, x.max + 10, y - 0.05]//RB
			])
		}

		// control à changer.
		// TODO: controles à modifier
		el.bezier.LT[1].control = BEZIERCONTROL.RIGHT
		el.bezier.LB[1].control = BEZIERCONTROL.RIGHT
		el.bezier.RT[1].control = BEZIERCONTROL.RIGHT
		el.bezier.RB[1].control = BEZIERCONTROL.RIGHT

		el.bezier.LT[0].control = BEZIERCONTROL.RIGHT
		el.bezier.LB[0].control = BEZIERCONTROL.RIGHT
		el.bezier.RT[0].control = BEZIERCONTROL.RIGHT
		el.bezier.RB[0].control = BEZIERCONTROL.RIGHT


		this._items.push(el)
		return el
	}

	addAO(value: string): itemGraphInterface {
		const line = new mLine(value)
		const oao = this.toPixels({x: 0, y: -line.c.value / line.b.value})
		const p = this.makeLine(oao, {x: 1, y: -line.slope.value})
		p.stroke("green")

		// Construction des points de contrôles et bezier.
		const A = this.getPointAtEndOfLine(line, 'min')
		const B = this.getPointAtEndOfLine(line, 'max')
		const vdxy = line.director.clone().unit()
		const vpxy = line.normal.clone().unit()
		const dxy = {x: vdxy.x.value, y: vdxy.y.value}
		const pxy = {x: vpxy.x.value, y: vpxy.y.value}
		const b1ratio = 5, b2ratio = 10

		const el = {
			id: value,
			type: ITEM_TYPES.AO,
			kind: null,
			element: p,
			controls: this.addControls([
				[A.x + dxy.x + pxy.x, A.y + dxy.y + pxy.y],//LT
				[B.x - dxy.x + pxy.x, B.y - dxy.y + pxy.y],//RT
				[A.x + dxy.x - pxy.x, A.y + dxy.y - pxy.y],//LB
				[B.x - dxy.x - pxy.x, B.y - dxy.y - pxy.y]//RB
			]),
			bezier: this.addBezierControls([
				[A.x - dxy.x + pxy.x / b1ratio, A.y - dxy.y + pxy.y / b1ratio, A.x - dxy.x * 5 + pxy.x / b2ratio, A.y - dxy.y * 5 + pxy.y / b2ratio],//LT
				[B.x + dxy.x + pxy.x / b1ratio, B.y + dxy.y + pxy.y / b1ratio, B.x + dxy.x * 5 + pxy.x / b2ratio, B.y + dxy.y * 5 + pxy.y / b2ratio],//RT
				[A.x - dxy.x - pxy.x / b1ratio, A.y - dxy.y - pxy.y / b1ratio, A.x - dxy.x * 5 - pxy.x / b2ratio, A.y - dxy.y * 5 - pxy.y / b2ratio],//LB
				[B.x + dxy.x - pxy.x / b1ratio, B.y + dxy.y - pxy.y / b1ratio, B.x + dxy.x * 5 - pxy.x / b2ratio, B.y + dxy.y * 5 - pxy.y / b2ratio]//RB
			])
		}

		this._items.push(el)
		return el
	}

	addAV(value: string): itemGraphInterface {
		const x = (new NumExp(value)).evaluate({})
		const y = {min: -6, max: 6}
		const posX = this.toPixels({x, y: 0}).x

		const p = this.makeLine({x: posX, y: 0}, {x: 0, y: 1})
		p.stroke('red')

		// LT, LB, RT, RB
		const el = {
			id: `x=${value}`,
			type: ITEM_TYPES.AV,
			kind: null,
			element: p,
			controls: this.addControls([
				[x - 0.5, y.max - 0.5],//LT
				[x + 0.5, y.max - 0.5],//RT
				[x - 0.5, y.min + 0.5],//LB
				[x + 0.5, y.min + 0.5] //RB
			]),
			bezier: this.addBezierControls([
				[x - 0.1, y.max, x - 0.05, y.max + 2],//LT
				[x + 0.1, y.max, x + 0.05, y.max + 2],//RT
				[x - 0.1, y.min, x - 0.05, y.min - 2],//LB
				[x + 0.1, y.min, x + 0.05, y.min - 2] //RB
			])
		}

		// control à changer.
		el.bezier.LT[1].control = BEZIERCONTROL.UP
		el.bezier.LB[1].control = BEZIERCONTROL.DOWN
		el.bezier.RT[1].control = BEZIERCONTROL.DOWN
		el.bezier.RB[1].control = BEZIERCONTROL.UP

		el.bezier.LT[0].control = BEZIERCONTROL.UP
		el.bezier.LB[0].control = BEZIERCONTROL.DOWN
		el.bezier.RT[0].control = BEZIERCONTROL.DOWN
		el.bezier.RB[0].control = BEZIERCONTROL.UP

		this._items.push(el)
		return el
	}

	addBezier(value: IBezierConfig): Bezier {
		return this.create.bezier(value, this.makeName())
			.stroke('blue', 3)
	}

	addBezierControls(values: number[][]): BEZIER_CONTROLS {
		if (!this._loadControls) return null
		const controls: BEZIER_CONTROLS = {} as BEZIER_CONTROLS

		STUDY_CONTROLS_KEYS.forEach((key, index) => {
			const [x1, y1, x2, y2] = values[index]

			if (y2 === undefined) {
				controls[key] = [this.makeBezierPoint(x1, y1)]
			} else {
				controls[key] = [
					this.makeBezierPoint(x1, y1),
					this.makeBezierPoint(x2, y2)
				]
			}
		})

		return controls
	}

	addControls(values: number[][]): ASYMPTOTES_CONTROLS {
		if (!this._loadControls) return null

		const controls: ASYMPTOTES_CONTROLS = {} as ASYMPTOTES_CONTROLS

		STUDY_CONTROLS_KEYS.forEach((key, index) => {
			const [x, y] = values[index]
			const pt = this.makePoint(x, y)

			pt.asSquare(this._size)
				.stroke('black')
				.fill('white/0.5')

			pt.shape.on('click', () => this.onClick(pt))
			controls[key] = pt
		})

		return controls
	}

	addEnvTracePoints(): itemGraphInterface {
		if (!this._loadControls) return null

		const existingEnv = this.getItem('env')
		if (existingEnv) return existingEnv

		const bbox = this.BBox

		const env = {
			id: 'env',
			type: ITEM_TYPES.TRACE,
			kind: null,
			element: null,
			controls: this.addControls([
				[bbox.x.min + 0.5, bbox.y.max - 0.5],//LT
				[bbox.x.max - 0.5, bbox.y.max - 0.5],//RT
				[bbox.x.min + 0.5, bbox.y.min + 0.5],//LB
				[bbox.x.max - 0.5, bbox.y.min + 0.5],//RB
			]),
			bezier: this.addBezierControls([
				[bbox.x.min - 2, bbox.y.max + 2],//LT
				[bbox.x.max + 2, bbox.y.max + 2],//RT
				[bbox.x.min - 2, bbox.y.min - 2],//LB
				[bbox.x.max + 2, bbox.y.min - 2]//RB
			])
		}

		Object.values(env.controls).forEach(pt => {
			pt.asCircle(this._size)
				.stroke('black')
				.fill('white/0.5')
		})

		this._items.push(env)

		return env
	}

	addPlot(fx: string, name: string, index?: number) {
		const {plot, samples, domain, color} = this.parsePlot(fx)
		try {
			const p = this.create.plot({
				expression: plot,
				samples,
				domain
			}, `${name}${index ?? ''}`)
			p.stroke(color)
			return p
		} catch {
			console.warn("Error parsing", fx)
		}

		return null

	}

	addPoint(type: POINT_TYPES, value: { x: string, y: string }): itemGraphInterface {
		const x = value.x === "" ? 0 : +(new NumExp(value.x)).evaluate()
		const y = value.y === "" ? 0 : +(new NumExp(value.y)).evaluate()

		const p = this.makePoint(x, y)
		p.size = this._size / 3

		const pixels = this.toPixels({x, y})
		let bar: Path = null
		let beziercontrol = BEZIERCONTROL.SMOOTH

		if (type === POINT_TYPES.TROU) {
			p.asCircle(this._size / 3).fill("white")
		} else if (type === POINT_TYPES.MAX || type === POINT_TYPES.MIN || type === POINT_TYPES.REPLAT) {
			p.asCircle(this._size / 3).fill("red")
			bar = this.makePath(`M${pixels.x - 50},${pixels.y} L${pixels.x + 50},${pixels.y}`)
			bar.stroke("red")

			beziercontrol = BEZIERCONTROL.RIGHT

			if (type === POINT_TYPES.MIN) {
				p.addLabel('MIN').position('bc')
			} else if (type === POINT_TYPES.MAX) {
				p.addLabel('MAX').position('tc')
			}
		} else {
			p.asCircle(this._size / 3).fill("black")
		}

		const el = {
			id: `(${value.x};${value.y})`,
			type: ITEM_TYPES.POINT,
			kind: type,
			beziercontrol,
			element: p,
			controls: {
				bar
			}
		}

		this._items.push(el)
		return el
	}

	getItem(id: string, type?: ITEM_TYPES, kind?: POINT_TYPES): itemGraphInterface {
		return this._items[this.getItemIndex(id, type, kind)]
	}

	getItemIndex(id: string, type?: ITEM_TYPES, kind?: POINT_TYPES): number {
		return this._items.findIndex(el => {
			if (el.id !== id) return false

			if (type && el.type !== type) return false

			if (kind && el.kind !== kind) return false

			return true
		})
	}

	getPointAtEndOfLine(line: mLine, side: 'min' | 'max'): XY {
		const bbox = this.BBox
		const x = bbox.x[side]

		const A = {x, y: line.getValueAtX(x).value}

		if (A.y > bbox.y.max) {
			return {x: line.getValueAtY(bbox.y.max).value, y: bbox.y.max}
		} else if (A.y < bbox.y.min) {
			return {x: line.getValueAtY(bbox.y.min).value, y: bbox.y.min}
		}

		return A
	}

	itemToAnswer(item: itemGraphInterface): string | null {
		const ctrls = []

		if (item.type === "point") {
			return `${item.kind}${item.id}`
		}

		for (const key in item.controls) {
			if (item.controls[key].shape.fill() === "green") {
				ctrls.push(key)
			}
		}

		return ctrls.length > 0
			? `${item.id}&${ctrls.sort().join("&")}`
			: item.id === 'env'
				? null
				: item.id
	}

	makeBezierPoint(x: number, y: number, control?: BEZIERCONTROL): BEZIER_CONTROL_POINT {
		return {
			point: this.makePoint(x, y),
			control: control ?? BEZIERCONTROL.SMOOTH
		}
	}

	makeLine(A: XY, d: XY) {
		// IN PIXELS
		return this.create.line({
				director: {A, d}
			},
			this.makeName())
	}

	makeName(): string {
		return 'P' + Object.keys(this.figures).length
	}

	makePath(d: string) {
		return this.create.path(d, this.makeName())
	}

	makePoint(x: number, y: number, asPixels?: boolean) {
		if (asPixels) {
			const xy = this.toCoordinates({x, y})
			return this.create.point({x: xy.x, y: xy.y}, this.makeName())
		}

		// Convert UNITS to PIXELS
		return this.create.point({x, y}, this.makeName())
	}

	onClick(pt: Point) {
		if (pt.shape.fill() === "white") {
			pt.shape.fill("green")
		} else {
			pt.shape.fill("white")
		}
	}

	parsePlot(fx: string): { plot: string, samples: number, domain: { min: number, max: number }, color: string } {
		// une fonction a traceer est de la forme
		// 2x+3,a:b,@samples,color
		const plotData: string[] = fx.split(",")
		const plot: string = plotData.shift()

		let domain: { min: number, max: number } = {min: -8, max: 8}
		const domainIndex = plotData.findIndex(x => x.includes(':'))
		if (domainIndex !== -1) {
			const searchDomain = plotData.splice(domainIndex, 1)[0]
			const [min, max] = searchDomain.split(':').map(Number)
			domain.min = min
			domain.max = max
		}

		let samples = 20
		const sampleIndex = plotData.findIndex(x => x.startsWith('@'))
		if (sampleIndex !== -1) {
			samples = +plotData
				.splice(sampleIndex, 1)[0]
				.substring(1)
		}

		let color = plotData.length === 1 ? plotData[0] : "blue"

		return {plot, samples, domain, color}

	}

	plotGraph(fx?: string) {
		// Remove existing plot.
		this.removePlots()

		if (fx) {
			this.plots.push(this.addPlot(fx, 'p'))
			return
		}

		// TODO: the ratio should be dynamique - do a second pass by checking the distance between two control points ?
		let ratio = 0.2
		let ctrlPoints: IBezierPointInterface[] = []
		const AVs: itemGraphInterface[] = []

		for (const item of Object.values(this._items)) {
			if (item.type === ITEM_TYPES.POINT) {
				ctrlPoints.push({
					point: item.element as Point,
					controls: {
						type: item.beziercontrol,
						ratio,
						left: null,
						right: null
					}
				})
			} else if (item.controls && item.bezier) {
				if (item.type === ITEM_TYPES.AV) {
					AVs.push(item)
				}

				// Check the selected buttons
				for (const key in item.controls) {
					if (item.controls[key]?.shape?.fill() === "green" && item.bezier[key]) {
						ctrlPoints = ctrlPoints.concat(
							...item.bezier[key]
								.map((pt: BEZIER_CONTROL_POINT) => {
									return {
										point: pt.point,
										controls: {
											type: pt.control,
											ratio,
											left: null,
											right: null
										}
									}
								})
						)
					}
				}
			}
		}

		// Sort the maxPoints.
		ctrlPoints.sort((a, b) => a.point.x - b.point.x)

		// redéfinir les ratio en fonction de la distance entre les deux points de controles avant et après
		const modifier = 0.002
		for (let i = 0; i < ctrlPoints.length; i++) {
			const deltaBefore = i === 0 ? 200 : ctrlPoints[i].point.x - ctrlPoints[i - 1].point.x
			const deltaAfter = i === ctrlPoints.length - 1 ? 200 : ctrlPoints[i + 1].point.x - ctrlPoints[i].point.x
			ctrlPoints[i].controls.ratio = Math.min(0.2, deltaBefore * modifier, deltaAfter * modifier)
		}


		// on découpe les courbes en fonction des points
		if (AVs.length === 0) {
			this._plots.push(this.addBezier({points: ctrlPoints}))
		} else {
			let previous = -1000
			AVs.forEach(AV => {
				const x = (AV.element as Line).config.director.A.x
				this.plots.push(this.addBezier({
					points: ctrlPoints.filter(pt => previous < pt.point.x && pt.point.x < x)
				}))
			})

			// Rajoute le dernier bout.
			this.plots.push(this.addBezier({
				points: ctrlPoints.filter(pt => pt.point.x > previous)
			}))
		}

	}

	removeAllItems(): void {
		while (this._items.length > 0) {
			this.removeItem(this._items[0])
		}

		this.removePlots()

		this.addEnvTracePoints()
	}

	removeControlsAndBezier(item: itemGraphInterface) {
		// Remove the control maxPoints.
		Object.values(item.controls || [])
			.filter(item => item !== null && item !== undefined)
			.forEach(el => el.clear(true))

		// Remove the bezier maxPoints.
		Object.values(item.bezier || [])
			.filter(item => item !== null && item !== undefined)
			.forEach(group => group.forEach((el: BEZIER_CONTROL_POINT) => el.point.clear(true)))

	}

	removeItem(item: itemGraphInterface): void {
		// On supprime les contrôles et les bezier
		this.removeControlsAndBezier(item)

		// On supprime l'objet principal
		if (item.element !== null) {
			item.element.clear(true)
		}

		// On supprime l'élément de this._items
		const index = this.getItemIndex(item.id, item.type, item.kind)

		if (index !== -1) {
			this._items.splice(index, 1)
		}
	}

	removePlots(): this {
		this._plots.forEach(plot => plot.clear(true))

		this._plots = []

		return this
	}
}

