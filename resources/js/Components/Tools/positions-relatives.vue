<script setup lang="ts">
// TODO: positions relatives ne fonctionne pas - il faut la retravailler !
// disable type checking for this file.
// @ts-nocheck


import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {computed, ref} from "vue"
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {
	Circle,
	Equation,
	Fraction,
	Line,
	Line3,
	Plane3,
	Point,
	Sphere3,
	SPHERE3_RELATIVE_POSITION,
	Vector
} from "pimath"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Objet 1",
		type: "text",
		value: ref(""),
		fromUrl: "o1"
	},
	{
		label: "Objet 2",
		type: "text",
		value: ref(""),
		fromUrl: "o2"
	}
])
type objectType = 'point' | 'droite' | 'cercle' | 'plan' | 'sphère' | 'indéterminé'
const objet1_asString = computed<string>(() => forms[0].value.value as string)
const objet2_asString = computed<string>(() => forms[1].value.value as string)

type PiObject = Point | Line | Line3 | Circle | Plane3 | Sphere3

interface ObjectTypeInterface {
	pi: PiObject | undefined,
	dimension: 2 | 3 | undefined,
	type: objectType
}

interface posRelativeInterface {
	objet1: ObjectTypeInterface,
	objet2: ObjectTypeInterface,
	position: string
}

function parseString(value: string): ObjectTypeInterface[] {
	// (a,b) or (a,b,c) -> point
	// (a,b)+k(d,e) or (a,b,c)+k(d,e,f) -> line
	// (a,b,c)+k(d,e,f)+l(g,h,i) -> plane
	// (a,b,c)+r -> sphere
	// equation -> 2dline, plane, circle or sphere
	//
	// values can be <number> or <number>/<number>
	const nb = "-?\\d+(?:\\.\\d+)?(?:\\/\\d+)?"

	const point = new RegExp(`^\\((${nb}),(${nb})(?:,(${nb}))?\\)$`, 'g')
	if (point.test(value)) {
		const [, x, y, z] = point.exec(value) as string[]

		if (z !== undefined) {
			return [{
				pi: new Point(x, y, z),
				dimension: 3,
				type: 'point'
			}]
		}
		return [{
			pi: new Point(x, y),
			dimension: 2,
			type: 'point'
		}]
	}

	const line = new RegExp(`^\\((${nb}),(${nb})\\)\\+k\\((${nb}),(${nb})\\)$`, 'g')
	if (line.test(value)) {
		const [, x1, y1, x2, y2] = line.exec(value) as string[]

		return [{
			pi: new Line().fromPointAndDirection(
				new Point(x1, y1),
				new Vector(x2, y2)
			),
			dimension: 2,
			type: 'droite'
		}]
	}

	const line3 = new RegExp(`^\\((${nb}),(${nb}),(${nb})\\)\\+k\\((${nb}),(${nb}),(${nb})\\)$`, 'g')
	if (line3.test(value)) {
		const [, x1, y1, z1, x2, y2, z2] = line3.exec(value) as string[]

		return [{
			pi: new Line3(
				new Point(x1, y1, z1),
				new Vector(x2, y2, z2)
			),
			dimension: 3,
			type: 'droite'
		}
		]
	}

	const plane = new RegExp(`^\\((${nb}),(${nb}),(${nb})\\)\\+k\\((${nb}),(${nb}),(${nb})\\)\\+l\\((${nb}),(${nb}),(${nb})\\)$`, 'g')
	if (plane.test(value)) {
		const [, x1, y1, z1, x2, y2, z2, x3, y3, z3] = plane.exec(value) as string[]

		return [{
			pi: new Plane3({
					point: new Point(x1, y1, z1),
					directions: [
						new Vector(x2, y2, z2),
						new Vector(x3, y3, z3)
					]
				}
			),
			dimension: 3,
			type: 'plan'
		}
		]
	}

	const circle = new RegExp(`^\\((${nb}),(${nb})\\)\\+r\\((${nb})\\)$`, 'g')
	if (circle.test(value)) {
		const [, x, y, r] = circle.exec(value) as string[]

		return [{
			pi: new Circle(new Point(x, y), new Fraction(r)),
			dimension: 2,
			type: 'cercle'
		}]
	}

	const sphere = new RegExp(`^\\((${nb}),(${nb}),(${nb})\\)\\+r\\((${nb})\\)$`, 'g')
	if (sphere.test(value)) {
		const [, x, y, z, r] = sphere.exec(value) as string[]

		return [{
			pi: new Sphere3(new Point(x, y, z), r),
			dimension: 3,
			type: 'sphère'
		}]
	}

	// Means it's an equation
	return reconObjectFromEquation(new Equation(value))

}

function reconObjectFromEquation(equ: Equation): ObjectTypeInterface[] {
	if (equ.degree().value > 2 || equ.degree().value === 0) {
		return [{
			pi: undefined,
			dimension: undefined,
			type: 'indéterminé'
		}]
	}

	if (equ.degree().value === 1) {
		// droite 2d, plan
		const arr: ObjectTypeInterface[] = [
			{
				pi: new Plane3({equation: equ}),
				dimension: 3,
				type: 'plan'
			}
		]

		if (!equ.hasVariable('z')) {
			arr.push({
				pi: new Line().fromEquation(equ),
				dimension: 2,
				type: 'droite'
			})
		}
		return arr
	}

	// Il ne reste plus que les équations de degré 2
	// circle or sphere
	if (!equ.hasVariable('z')) {
		try {
			return [{
				pi: new Circle(equ),
				dimension: 2,
				type: 'cercle'
			}]
		} catch {
			return [{
				pi: undefined,
				dimension: undefined,
				type: 'indéterminé'
			}]
		}
	}

	return [{
		pi: new Sphere3().fromEquation(equ),
		dimension: 3,
		type: 'sphère'
	}]

}

function reduceObjects(o1: ObjectTypeInterface[], o2: ObjectTypeInterface[]): [ObjectTypeInterface, ObjectTypeInterface] {
	// on prend comme référence le tableau qui n'a qu'un élément
	const dim = o2.length === 1 ? o2[0].dimension : o1[0].dimension ?? 0

	// On ne garde que les objets de même dimension
	return [
		o1.filter(x => x.dimension === dim)[0] ?? {pi: undefined, dimension: undefined, type: 'indéterminé'},
		o2.filter(x => x.dimension === dim)[0] ?? {pi: undefined, dimension: undefined, type: 'indéterminé'}
	]
}

const positionRelative = computed<posRelativeInterface>(() => {
	const [objet1, objet2] = reduceObjects(parseString(objet1_asString.value), parseString(objet2_asString.value))

	if (objet1.type === 'indéterminé' || objet2.type === 'indéterminé') {
		return {
			objet1,
			objet2,
			position: "indéterminée"
		}
	}

	if (objet1.dimension === 2) {
		if (objet1.type === 'droite' && objet2.type === 'droite') {
			return posRel_droite2d_droite2d(objet1, objet2)
		}

		if (objet1.type === 'droite' && objet2.type === 'cercle') {
			return posRel_droite2d_cercle(objet1, objet2)
		}

		if (objet1.type === 'cercle' && objet2.type === 'droite') {
			return posRel_droite2d_cercle(objet2, objet1)
		}

		if (objet1.type === 'cercle' && objet2.type === 'cercle') {
			return posRel_cercle_cercle(objet1, objet2)
		}
	}

	if (objet1.type === 'plan' && objet2.type === 'plan') {
		return posRel_plan_plan(objet1, objet2)
	}

	if (objet1.type === 'plan' && objet2.type === 'sphère') {
		return posRel_plan_sphere(objet1, objet2)
	}
	if (objet1.type === 'sphère' && objet2.type === 'plan') {
		return posRel_plan_sphere(objet2, objet1)
	}

	if (objet1.type === 'sphère' && objet2.type === 'sphère') {
		return posRel_sphere_sphere(objet1, objet2)
	}

	return "???"
})

function posRel_droite2d_droite2d(equ1: Equation, equ2: Equation): posRelativeInterface {
	const line1 = new Line().fromEquation(equ1)
	const line2 = new Line().fromEquation(equ2)

	return {
		objet1: line1,
		objet2: line2,
		position: line1.isParallelTo(line2) ? 'parallèles' :
			line1.isSameAs(line2) ? 'confondues' : 'sécantes'
	}
}

function posRel_droite2d_cercle(equ1: Equation, equ2: Equation): posRelativeInterface {
	const line1 = new Line().fromEquation(equ1)
	const circle2 = new Circle(equ2)


	const d = line1.distanceTo(circle2.center).value
	const r = circle2.radius.value

	return {
		objet1: line,
		objet2: circle2,
		position: d === r ? 'tangentes' :
			d < r ? 'sécantes' : 'disjoints'
	}
}

function posRel_cercle_cercle(equ1: Equation, equ2: Equation): posRelativeInterface {
	const c1 = new Circle(equ1)
	const c2 = new Circle(equ2)

	const d = c1.center.distanceTo(c2.center).value

	if (d === 0) {
		return {
			objet1: c1,
			objet2: c2,
			position: c1.radius.value === c2.radius.value ? 'superposés' : 'concentriques'
		}
	}

	const r1 = c1.radius.value
	const r2 = c2.radius.value

	if (Math.abs(r1 - r2) > d) {
		return {
			objet1: c1,
			objet2: c2,
			position: "intérieurs"
		}
	}

	if (Math.abs(r1 - r2) === d) {
		return {
			objet1: c1,
			objet2: c2,
			position: "tangents intérieurement"
		}
	}

	if (r1 + r2 < d) {
		return {
			objet1: c1,
			objet2: c2,
			position: "sécants"
		}
	}

	if (r1 + r2 === d) {
		return {
			objet1: c1,
			objet2: c2,
			position: "tangents extérieurement"
		}
	}

	return {
		objet1: c1,
		objet2: c2,
		position: "disjoints"
	}
}

// TODO: position relatives entre d'autres objets à faire...
// function posRel_droite3d_droite3d(equ1: Equation, equ2: Equation):posRelativeInterface {
//
// }
//
// function posRel_droite3d_plan(equ1: Equation, equ2: Equation):posRelativeInterface {
//
// }
//
// function posRel_droite3d_sphere(equ1: Equation, equ2: Equation):posRelativeInterface {
//
// }

function posRel_plan_plan(equ1: Equation, equ2: Equation): posRelativeInterface {
	const p1 = new Plane3({equation: equ1})
	const p2 = new Plane3({equation: equ2})

	if (!p1.normal.isColinearTo(p2.normal)) {
		return {
			objet1: p1,
			objet2: p2,
			position: "sécants"
		}
	}

	return {
		objet1: p1,
		objet2: p2,
		position: p1.distanceTo(p2.point) === 0 ? "confondus" : "parallèles"
	}
}

function posRel_plan_sphere(equ: Equation, sphere: Equation): posRelativeInterface {
	const p = new Plane3({equation: equ})
	const s = new Sphere3().fromEquation(sphere)

	const d = p.distanceTo(s.center)
	const r = s.radius.value

	return {
		objet1: p,
		objet2: s,
		position: d === r ? "tangents" :
			d < r ? "sécants" : "disjoints"
	}

}

function posRel_sphere_sphere(equ1: Equation, equ2: Equation): posRelativeInterface {
	const s1 = new Sphere3().fromEquation(equ1)
	const s2 = new Sphere3().fromEquation(equ2)

	const posRel = s1.relativePosition(s2)

	function getSpherePosition(posRel: SPHERE3_RELATIVE_POSITION): string {
		switch (posRel) {
			case Sphere3.RELATIVE_POSITION.SUPERPOSED:
				return "superposés"
			case Sphere3.RELATIVE_POSITION.CONCENTRIC:
				return "concentriques"
			case Sphere3.RELATIVE_POSITION.TANGENT_OUTSIDE:
				return "tangents extérieurement"
			case Sphere3.RELATIVE_POSITION.TANGENT_INSIDE:
				return "tangents intérieurement"
			case Sphere3.RELATIVE_POSITION.SECANT:
				return "sécants"
			case Sphere3.RELATIVE_POSITION.INTERIOR:
				return "intérieurs"
			case Sphere3.RELATIVE_POSITION.EXTERIOR:
				return "disjoints"
		}
	}

	return {
		objet1: s1,
		objet2: s2,
		position: getSpherePosition(posRel)
	}

}
</script>

<template>
	<article>
		<tool-form :forms="forms">
			<div class="text-center mt-3">
				<button
					class="btn btn-primary"
				>
					Générer
				</button>
			</div>
		</tool-form>

		<div v-if="positionRelative">
			<div>{{ positionRelative.objet1.type }} <span v-katex="positionRelative.objet1.pi.tex" /></div>
			<div>{{ positionRelative.objet2.type }} <span v-katex="positionRelative.objet2.pi.tex" /></div>
		</div>
		<div v-else>
			Un des deux polynômes n'est pas reconnu
		</div>

		<div>Positions relatives: {{ positionRelative.position }}</div>
	</article>
</template>

<style scoped lang="postcss">

</style>

