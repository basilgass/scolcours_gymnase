import {Bezier, BEZIERCONTROL, COORDINATE_SYSTEM, DOMAIN, IBezierConfig, Line, Path, PiGraph, Point, XY} from "pidraw"
import katex from "katex"
import {Line as mLine, NumExp} from "pimath"

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

export interface BEZIER_CONTROLS {
	"LB": Point[]
	"LT": Point[]
	"RB": Point[]
	"RT": Point[]
}

export enum POINT_TYPES {
	MIN = "m",
	MAX = "mm",
	REPLAT = "_",
	TROU = "t"
}

export interface itemGraphInterface {
	bezier?: BEZIER_CONTROLS
	beziercontrol?: BEZIERCONTROL
	controls: ASYMPTOTES_CONTROLS | { bar: Path } // Record<string, Point>
	element: Point | Path | Line
	kind?: POINT_TYPES
	type: ITEM_TYPES
}


export const kbrdStudyButtons = {
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
	"mm": {
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

		this._loadControls = loadControls
		this._size = 2 * this.toPixels(1) / 3
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

	addAH(value: string): itemGraphInterface {
		const y = (new NumExp(value)).evaluate({})
		const x = this.BBox.x
		const posY = this.toPixels({x: 0, y}).y

		const p = this.makeLine({x: 0, y: posY}, {x: 1, y: 0})
		p.stroke('green')

		return {
			type: ITEM_TYPES.AV,
			element: p,
			controls: this.addControls([
				[x.min + 0.5, y + 0.5],//LT
				[x.max - 0.5, y + 0.5],//RT
				[x.min + 0.5, y - 0.5],//LB
				[x.max - 0.5, y - 0.5]//RB
			]),
			bezier: this.addBezierControls([
				[x.min, y + 0.1, x.min - 5, y + 0.05],//LT
				[x.max, y + 0.1, x.max + 5, y + 0.05],//RT
				[x.min, y - 0.1, x.min - 5, y - 0.05],//LB
				[x.max, y - 0.1, x.max + 5, y - 0.05]//RB
			])
		}
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

		return {
			type: ITEM_TYPES.AO,
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
	}

	addAV(value: string): itemGraphInterface {
		const x = (new NumExp(value)).evaluate({})
		const y = {min: -6, max: 6}
		const posX = this.toPixels({x, y: 0}).x

		const p = this.makeLine({x: posX, y: 0}, {x: 0, y: 1})
		p.stroke('red')

		// LT, LB, RT, RB
		return {
			type: ITEM_TYPES.AV,
			element: p,
			controls: this.addControls([
				[x - 0.5, y.max - 0.5],//LT
				[x + 0.5, y.max - 0.5],//RT
				[x - 0.5, y.min + 0.5],//LB
				[x + 0.5, y.min + 0.5] //RB
			]),
			bezier: this.addBezierControls([
				[x - 0.1, y.max, x - 0.05, y.max + 5],//LT
				[x - 0.1, y.min, x - 0.05, y.min - 5],//RT
				[x + 0.1, y.max, x + 0.05, y.max + 5],//LB
				[x + 0.1, y.min, x + 0.05, y.min - 5] //RB
			])
		}
	}

	addBezier(value: IBezierConfig): Bezier {
		// TODO: handle breakable bezier
		return this.create.bezier(value, this.makeName())
			.stroke('blue', 3)
	}

	addBezierControls(values: number[][]): BEZIER_CONTROLS {
		if (!this._loadControls) return null
		const controls: BEZIER_CONTROLS = {} as BEZIER_CONTROLS

		STUDY_CONTROLS_KEYS.forEach((key, index) => {
			const [x1, y1, x2, y2] = values[index]

			if (y2 === undefined) {
				controls[key] = [this.makePoint(x1, y1)]
			} else {
				controls[key] = [
					this.makePoint(x1, y1),
					this.makePoint(x2, y2)
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

	onClick(pt: Point) {
		if (pt.shape.fill() === "white") {
			pt.shape.fill("green")
		} else {
			pt.shape.fill("white")
		}
	}

	addEnvTracePoints(): itemGraphInterface {
		if (!this._loadControls) return null

		const bbox = this.BBox

		return {
			type: ITEM_TYPES.TRACE,
			element: null,
			controls: this.addControls([
				[bbox.x.min + 0.5, bbox.y.max - 0.5],//LT
				[bbox.x.max - 0.5, bbox.y.max - 0.5],//RT
				[bbox.x.min + 0.5, bbox.y.min + 0.5],//LB
				[bbox.x.max - 0.5, bbox.y.min + 0.5],//RB
			]),
			bezier: this.addBezierControls([
				[bbox.x.min, bbox.y.max],//LT
				[bbox.x.max, bbox.y.max],//RT
				[bbox.x.min, bbox.y.min],//LB
				[bbox.x.max, bbox.y.min]//RB
			])
		}
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

			beziercontrol = BEZIERCONTROL.HORIZONTAL

			if (type === POINT_TYPES.MIN) {
				p.addLabel('MIN').position('bc')
			} else if (type === POINT_TYPES.MAX) {
				p.addLabel('MAX').position('tc')
			}
		} else {
			p.asCircle(this._size / 3).fill("black")
		}

		return {
			type: ITEM_TYPES.POINT,
			kind: type,
			beziercontrol,
			element: p,
			controls: {
				bar
			}
		}
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
}

