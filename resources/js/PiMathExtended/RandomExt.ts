import {Point, Random, Vector} from "pimath";

function areAligned(A: Point, B: Point, C: Point): boolean {
	const AB = new Vector(A, B)
	const AC = new Vector(A, C)
	return AB.isColinearTo(AC)
}

function isAlignedWithAnyPair(P: Point, pts: Point[]): boolean {
	const n = pts.length

	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			if (areAligned(pts[i], pts[j], P)) {
				return true
			}
		}
	}

	return false
}

export function rndPoints(n: number, allowAligned: boolean = false, cfg: any) {
	const pts: Point[] = []

	for (let i = 0; i < n; i++) {
		let P = Random.point(cfg)

		if (pts.length >= 2 && allowAligned) {
			do {
				P = Random.point()
			} while (isAlignedWithAnyPair(P, pts))
		}

		pts.push(P)
	}

	return pts
}
