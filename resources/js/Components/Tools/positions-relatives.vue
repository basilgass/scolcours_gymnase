<script setup lang="ts">
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {computed, onMounted, ref, watch} from "vue"
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
import ScButton from "@/Components/Ui/scButton.vue"
import Card from "@/Components/Ui/Card.vue"

const ObjectTypeSortOrder: objectType[] = ['point', 'droite', 'cercle', 'plan', 'sphère', "indéterminé"]

function sortObjects(a: ObjectTypeInterface, b: ObjectTypeInterface): number {
	return ObjectTypeSortOrder.indexOf(a.type) - ObjectTypeSortOrder.indexOf(b.type)
}

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

const isRecognized = computed(() => {
	return objet1.value && objet2.value
})

function parseString(value: string): ObjectTypeInterface[] {
	// (a,b) or (a,b,c) -> point
	// (a,b)+k(d,e) -> line
	// (a,b)+r -> circle
	// (a,b,c)+k(d,e,f) -> line3
	// (a,b,c)+k(d,e,f)+l(g,h,i) -> plane3
	// (a,b,c)+r -> sphere3
	// equation -> 2dline, plane, circle or sphere
	//
	// values can be <number> or <number>/<number>
	const nb = "-?\\d+(?:\\.\\d+)?(?:\\/\\d+)?"

	const point = new RegExp(`^\\((${nb}),(${nb})(?:,(${nb}))?\\)$`, 'g')
		.exec(value) as string[]
	if (point) {
		const [, x, y, z] = point

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
		.exec(value) as string[]
	if (line) {
		const [, x1, y1, x2, y2] = line

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
		.exec(value) as string[]
	if (line3) {
		const [, x1, y1, z1, x2, y2, z2] = line3

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
		.exec(value) as string[]
	if (plane) {
		const [, x1, y1, z1, x2, y2, z2, x3, y3, z3] = plane

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

	const circle = new RegExp(`^\\((${nb}),(${nb})\\)\\+r(${nb})$`, 'g')
		.exec(value) as string[]
	if (circle) {
		const [, x, y, r] = circle

		return [{
			pi: new Circle(new Point(x, y), new Fraction(r)),
			dimension: 2,
			type: 'cercle'
		}]
	}

	const sphere = new RegExp(`^\\((${nb}),(${nb}),(${nb})\\)\\+r(${nb})$`, 'g')
		.exec(value) as string[]
	if (sphere) {
		const [, x, y, z, r] = sphere

		return [{
			pi: new Sphere3(new Point(x, y, z), r),
			dimension: 3,
			type: 'sphère'
		}]
	}

	// Means it's an equation
	try {
		const equ = new Equation(value)
		return reconObjectFromEquation(equ)
	} catch {
		return []
	}
}

const objets1 = computed<ObjectTypeInterface[] | null>(() => {
	try {
		return parseString(objet1_asString.value)
	} catch {
		return null
	}
})

const objets2 = computed<ObjectTypeInterface[] | null>(() => {
	try {
		return parseString(objet2_asString.value)
	} catch {
		return null
	}
})

const objet1Index = ref(0)

const objet2Index = computed(() => {
	// calcul automatiquement la valeur en fonction de l'objet 1.
	if (objet1.value === undefined) {
		return undefined
	}

	const dim = objet1.value.dimension
	return objets2.value.findIndex(obj => obj.dimension === dim)
})

const objet1 = computed(() => {
	return objets1.value[objet1Index.value]
})
const objet2 = computed(() => {
	return objets2.value[objet2Index.value]
})

function autoSelect() {
	if (objets2.value.length === 1) {
		const dim = objets2.value[0].dimension
		objet1Index.value = objets1.value.findIndex(obj => {
			return obj.dimension === dim
		})
	}
}

watch(objets2, () => {
	autoSelect()
})

onMounted(() => {
	autoSelect()
})


// ------------------ THINGS TO MODIFY !!!! -------------------
function reconObjectFromEquation(equ: Equation): ObjectTypeInterface[] {
	const degree = equ.degree().value
	if (degree > 2 || degree === 0) {
		return [{
			pi: undefined,
			dimension: undefined,
			type: 'indéterminé'
		}]
	}

	if (degree === 1) {
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

		return arr.toSorted(sortObjects)
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

const positionRelative = computed<string>(() => {
	const [obj1, obj2] = [objet1.value, objet2.value].sort(sortObjects)

	if (obj1.type === 'indéterminé' || obj2.type === 'indéterminé') {
		return "indéterminée"
	}

	try {
		if (obj1.dimension === 2) {
			// On est en deux dimensions
			if (obj1.type === 'droite' && obj2.type === 'droite') {
				return posRel_droite2d_droite2d(obj1.pi as Line, obj2.pi as Line)
			}

			if (obj1.type === 'droite' && obj2.type === 'cercle') {
				return posRel_droite2d_cercle(obj1.pi as Line, obj2.pi as Circle)
			}

			if (obj1.type === 'cercle' && obj2.type === 'cercle') {
				return posRel_cercle_cercle(obj1.pi as Circle, obj2.pi as Circle)
			}
		}

		if (objet1.value.type === 'plan' && objet2.value.type === 'plan') {
			return posRel_plan_plan(obj1.pi as Plane3, obj2.pi as Plane3)
		}

		if (objet1.value.type === 'plan' && objet2.value.type === 'sphère') {
			return posRel_plan_sphere(obj1.pi as Plane3, obj2.pi as Sphere3)
		}

		if (objet1.value.type === 'sphère' && objet2.value.type === 'sphère') {
			return posRel_sphere_sphere(obj1.pi as Sphere3, obj2.pi as Sphere3)
		}
	} catch (err) {
		console.log(err)
		// Do nothing.
	}

	return "???"
})

function posRel_droite2d_droite2d(line1: Line, line2: Line): string {
	return line1.isParallelTo(line2) ? 'parallèles' :
		line1.isSameAs(line2) ? 'confondues' : 'sécantes'
}

function posRel_droite2d_cercle(line1: Line, circle2: Circle): string {
	const d = line1.distanceTo(circle2.center).value
	const r = circle2.radius.value

	return d === r ? 'tangentes' :
		d < r ? 'sécantes' : 'disjoints'
}

function posRel_cercle_cercle(c1: Circle, c2: Circle): string {

	const d = c1.center.distanceTo(c2.center).value

	if (d === 0) {
		return c1.radius.value === c2.radius.value ? 'superposés' : 'concentriques'
	}

	const r1 = c1.radius.value
	const r2 = c2.radius.value

	if (Math.abs(r1 - r2) > d) {
		return "intérieurs"
	}

	if (Math.abs(r1 - r2) === d) {
		return "tangents intérieurement"
	}

	if (r1 + r2 === d) {
		return "tangents extérieurement"
	}

	if (r1 + r2 > d) {
		return "disjoints"
	}
	return "sécants"
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

function posRel_plan_plan(p1: Plane3, p2: Plane3): string {
	if (!p1.normal.isColinearTo(p2.normal)) {
		return "sécants"
	}

	return p1.distanceTo(p2.point) === 0 ? "confondus" : "parallèles"
}

function posRel_plan_sphere(p: Plane3, s: Sphere3): string {
	const d = p.distanceTo(s.center)
	const r = s.radius.value

	return d === r ? "tangents" :
		d < r ? "sécants" : "disjoints"

}

function posRel_sphere_sphere(s1: Sphere3, s2: Sphere3): string {

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

	return getSpherePosition(s1.relativePosition(s2))

}

</script>

<template>
	<article>
		<tool-form :forms="forms">
			<div>
				<table>
					<tr>
						<td class="font-semibold pr-5">
							point
						</td>
						<td class="font-code pr-5">
							(a,b)
						</td>
						<td />
					</tr>
					<tr>
						<td class="font-semibold pr-5">
							ligne
						</td>
						<td class="font-code pr-5">
							(a,b)+k(c,d)
						</td>
						<td class="font-code">
							équation
						</td>
					</tr>
					<tr>
						<td class="font-semibold pr-5">
							cercle
						</td>
						<td class="font-code pr-5">
							(a,b)+r&lt;rayon&gt;
						</td>
						<td class="font-code">
							équation
						</td>
					</tr>
					<tr>
						<td class="font-semibold pr-5">
							point 3D
						</td>
						<td class="font-code pr-5">
							(a,b,c)
						</td>
						<td />
					</tr>
					<tr>
						<td class="font-semibold pr-5">
							ligne 3D
						</td>
						<td class="font-code pr-5">
							(a,b,c)+k(d,e,f)
						</td>
						<td />
					</tr>
					<tr>
						<td class="font-semibold pr-5">
							plan 3D
						</td>
						<td class="font-code pr-5">
							(a,b,c)+k(d,e,f)+l(g,h,i)
						</td>
						<td class="font-code">
							équation
						</td>
					</tr>
					<tr>
						<td class="font-semibold pr-5">
							cercle 3D
						</td>
						<td class="font-code pr-5">
							(a,b,c)+r&lt;rayon&gt;
						</td>
						<td class="font-code">
							équation
						</td>
					</tr>
				</table>
				<div class="text-center mt-3">
					<sc-button
						type="primary"
					>
						Générer
					</sc-button>
				</div>
			</div>
		</tool-form>

		<div class="grid grid-cols-2 gap-3">
			<Card>
				<template #header>
					<h3 class="text-lg uppercase">
						premier objet
					</h3>
				</template>
				<div
					v-for="(obj, index) in objets1"
					:key="`obj1-${index}`"
					@click="objet1Index = index"
					class="cursor-pointer p-2"
					:class="index===objet1Index?'bg-green-100':''"
				>
					<span v-katex="obj.pi.tex" /> - {{ obj.type }} {{ obj.dimension }}D
				</div>
			</Card>
			<Card>
				<template #header>
					<h3 class="text-lg uppercase">
						deuxième objet
					</h3>
				</template>
				<div
					v-for="(obj, index) in objets2"
					:key="`obj2-${index}`"
					class="p-2"
					:class="index===objet2Index?'bg-green-100':''"
				>
					<span v-katex="obj.pi.tex" /> - {{ obj.type }} {{ obj.dimension }}D
				</div>
			</Card>
		</div>

		<Card
			v-if="isRecognized"
			class="my-12 max-w-lg mx-auto text-xl font-semibold text-center space-y-6"
		>
			<p>Positions relatives</p>
			<p>{{ positionRelative }}</p>
		</Card>
	</article>
</template>

