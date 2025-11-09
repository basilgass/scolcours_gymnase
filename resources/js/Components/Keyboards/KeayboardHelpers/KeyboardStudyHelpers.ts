import {Bezier, BEZIERCONTROL, COORDINATE_SYSTEM, DOMAIN, IBezierConfig, Line, Path, PiGraph, Point, XY} from "pidraw"
import katex from "katex"
import {Line as mLine, NumExp} from "pimath"

export enum ITEMTYPES {
	POINT = "point",
	AO = "ao",
	AV = "av",
	AH = "ah",
	TRACE = "trace"
}

export const STUDY_CONTROLS_KEYS = ["LB", "LT", "RB", "RT"]

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

export enum POINTTYPES {
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
	kind?: POINTTYPES
	type: ITEMTYPES
}


export const kbrdStudyButtons = {
	"ah": {
		label: "AH", description: "asymptote verticale"
	},
	"av": {
		label: "AV", description: "asymptote horizontale"
	},
	"ao": {
		label: "AO", description: "asymptote oblique"
	},
	"!": {
		label: "rien", description: "aucune asymptote"
	},
	"p": {
		label: "point", description: "point quelconque"
	},
	"z": {
		label: "zéro", description: "zéro"
	},
	"o": {
		label: "ordonnée", description: "ordonnée à l'origine"
	},
	"t": {
		label: "trou", description: "trou"
	},
	"m": {
		label: "min", description: "minimum"
	},
	"mm": {
		label: "max", description: "maximum"
	},
	"_": {
		label: "replat", description: "replat"
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
			type: ITEMTYPES.AV,
			element: p,
			controls: this.addControls([
				[x.min + 0.5, y + 0.5],
				[x.min + 0.5, y - 0.5],
				[x.max - 0.5, y + 0.5],
				[x.max - 0.5, y - 0.5]
			]),
			bezier: this.addBezierControls([
				[x.min, y + 0.1, x.min - 5, y + 0.05],
				[x.min, y - 0.1, x.min - 5, y - 0.05],
				[x.max, y + 0.1, x.max + 5, y + 0.05],
				[x.max, y - 0.1, x.max + 5, y - 0.05]
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
			type: ITEMTYPES.AO,
			element: p,
			controls: this.addControls([
				[A.x + dxy.x + pxy.x, A.y + dxy.y + pxy.y],
				[A.x + dxy.x - pxy.x, A.y + dxy.y - pxy.y],
				[B.x - dxy.x + pxy.x, B.y - dxy.y + pxy.y],
				[B.x - dxy.x - pxy.x, B.y - dxy.y - pxy.y]
			]),
			bezier: this.addBezierControls([
				[A.x - dxy.x + pxy.x / b1ratio, A.y - dxy.y + pxy.y / b1ratio, A.x - dxy.x * 5 + pxy.x / b2ratio, A.y - dxy.y * 5 + pxy.y / b2ratio],
				[A.x - dxy.x - pxy.x / b1ratio, A.y - dxy.y - pxy.y / b1ratio, A.x - dxy.x * 5 - pxy.x / b2ratio, A.y - dxy.y * 5 - pxy.y / b2ratio],
				[B.x + dxy.x + pxy.x / b1ratio, B.y + dxy.y + pxy.y / b1ratio, B.x + dxy.x * 5 + pxy.x / b2ratio, B.y + dxy.y * 5 + pxy.y / b2ratio],
				[B.x + dxy.x - pxy.x / b1ratio, B.y + dxy.y - pxy.y / b1ratio, B.x + dxy.x * 5 - pxy.x / b2ratio, B.y + dxy.y * 5 - pxy.y / b2ratio]
			])
		}
	}

	addAV(value: string): itemGraphInterface {
		const x = (new NumExp(value)).evaluate({})
		const y = {min: -6, max: 6}
		const posX = this.toPixels({x, y: 0}).x

		const p = this.makeLine({x: posX, y: 0}, {x: 0, y: 1})
		p.stroke('red')

		return {
			type: ITEMTYPES.AV,
			element: p,
			controls: this.addControls([
				[x - 0.5, y.max - 0.5],
				[x + 0.5, y.max - 0.5],
				[x - 0.5, y.min + 0.5],
				[x + 0.5, y.min + 0.5]
			]),
			bezier: this.addBezierControls([
				[x - 0.1, y.max, x - 0.05, y.max + 5],
				[x + 0.1, y.max, x + 0.05, y.max + 5],
				[x - 0.1, y.min, x - 0.05, y.min - 5],
				[x + 0.1, y.min, x + 0.05, y.min - 5]
			])
		}
	}

	addBezier(value: IBezierConfig): Bezier {
		return this.create.bezier(value, this.makeName())
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

			pt.shape.on('click', () => {
				if (pt.shape.fill() === "white") {
					pt.shape.fill("green")
				} else {
					pt.shape.fill("white")
				}
			})
			controls[key] = pt
		})

		return controls
	}

	addEnvTracePoints(): itemGraphInterface {
		if (!this._loadControls) return null

		const bbox = this.BBox

		return {
			type: ITEMTYPES.TRACE,
			element: null,
			controls: this.addControls([
				[bbox.x.min + 0.5, bbox.y.max - 0.5],
				[bbox.x.min + 0.5, bbox.y.min + 0.5],
				[bbox.x.max - 0.5, bbox.y.max - 0.5],
				[bbox.x.max - 0.5, bbox.y.min + 0.5],
			]),
			bezier: this.addBezierControls([
				[bbox.x.min, bbox.y.max],
				[bbox.x.min, bbox.y.min],
				[bbox.x.max, bbox.y.max],
				[bbox.x.max, bbox.y.min]
			])
		}
	}

	addPoint(type: POINTTYPES, value: { x: string, y: string }): itemGraphInterface {
		const x = value.x === "" ? 0 : +(new NumExp(value.x)).evaluate()
		const y = value.y === "" ? 0 : +(new NumExp(value.y)).evaluate()

		const p = this.makePoint(x, y)
		p.size = this._size / 3

		const pixels = this.toPixels({x, y})
		let bar: Path = null
		let beziercontrol = BEZIERCONTROL.SMOOTH

		if (type === POINTTYPES.TROU) {
			p.asCircle(this._size / 3).fill("white")
		} else if (type === POINTTYPES.MAX || type === POINTTYPES.MIN || type === POINTTYPES.REPLAT) {
			p.asCircle(this._size / 3).fill("red")
			bar = this.makePath(`M${pixels.x - 50},${pixels.y} L${pixels.x + 50},${pixels.y}`)
			bar.stroke("red")

			beziercontrol = BEZIERCONTROL.HORIZONTAL

			if (type === POINTTYPES.MIN) {
				p.addLabel('MIN').position('bc')
			} else if (type === 'mm') {
				p.addLabel('MAX').position('tc')
			}
		}

		return {
			type: ITEMTYPES.POINT,
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

