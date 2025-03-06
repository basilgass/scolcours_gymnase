<script setup lang="ts">

import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {computed, ref} from "vue"
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {Circle, Equation, Line, Plane3, Sphere3} from "pimath"

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
type objectType = 'droite 2D' | 'cercle' | 'droite 3D' | 'plan' | 'sphère' | 'indéterminé'
const objet1 = computed<string>(() => forms[0].value.value as string)
const objet2 = computed<string>(() => forms[1].value.value as string)

const equations = computed<{ objet1: Equation, objet2: Equation } | null>(() => {
	let P1, P2

	try {
		P1 = new Equation(objet1.value)
	} catch {
		return null
	}

	try {
		P2 = new Equation(objet2.value)
	} catch {
		return null
	}

	return {
		objet1: P1,
		objet2: P2
	}
})

const reconObject = computed<{ objet1: objectType, objet2: objectType }>(() => {
	if (!equations.value) {
		return {
			objet1: "indéterminé",
			objet2: "indéterminé",
		}
	}
	let o1 = typeOfObject(equations.value.objet1)
	let o2 = typeOfObject(equations.value.objet2)

	if (o1.length === 0) {
		return {
			objet1: "indéterminé",
			objet2: o2[0] ?? "indéterminé",
		}
	}
	if (o2.length === 0) {
		return {
			objet1: o1[0] ?? "indéterminé",
			objet2: "indéterminé",
		}
	}

	// Les deux objets doivent être de même dimension !
	const dim2:objectType[] = ['droite 2D', 'cercle']
	const dim3:objectType[] = ['droite 3D', 'plan', 'sphère']

	if(o1.length===1){
		const estDeDimension2 = dim2.includes(o1[0])
		o2 = o2.filter(x=>estDeDimension2 ? dim2.includes(x): dim3.includes(x))
	}else if(o2.length===1){
		const estDeDimension2 = dim2.includes(o2[0])
		o1 = o1.filter(x=>estDeDimension2 ? dim2.includes(x): dim3.includes(x))
	}


	return {
		objet1: o1[0],
		objet2: o2[0]
	}
})

function typeOfObject(equ: Equation): objectType[] {
	if (equ.degree().value > 2) {
		return ['indéterminé']
	}

	if (equ.degree().value === 0) {
		return ['droite 2D', 'droite 3D', 'plan']
	}

	if (equ.degree().value === 2) {
		// toutes les variables doivent être de degré 2.
		if(equ.degree('x').value!==2){return ['indéterminé']}
		if(equ.degree('y').value!==2){return ['indéterminé']}

		// Il faut vérifier le rayon du cercle.
		if(!equ.hasVariable('z')){
			try {
				const _ = new Circle(equ).radius.value
				return ['cercle']
			}catch{
				return ['indéterminé']
			}
		}

		// TODO: vérifier l'existance de la sphère
		// Il faut vérifier que le rayon de la sphère existe !
		return equ.degree('z').value===2 ? ['sphère'] : ['indéterminé']
	}

	if (equ.hasVariable('z')) {
		return ['plan']
	}

	return ['droite 2D', 'plan']
}

const positionRelative = computed<string>(()=>{

	if(reconObject.value.objet1==='indéterminé' || reconObject.value.objet2==='indéterminé'){
		return 'indéterminé'
	}

	if(reconObject.value.objet1==='droite 2D' && reconObject.value.objet2==='droite 2D'){
		return posRel_droite2d_droite2d(equations.value.objet1, equations.value.objet2)
	}

	if(reconObject.value.objet1==='droite 2D' && reconObject.value.objet2==='cercle'){
		return posRel_droite2d_cercle(equations.value.objet1, equations.value.objet2)
	}

	if(reconObject.value.objet1==='cercle' && reconObject.value.objet2==='droite 2D'){
		return posRel_droite2d_cercle(equations.value.objet2, equations.value.objet1)
	}

	if(reconObject.value.objet1==='cercle' && reconObject.value.objet2==='cercle'){
		return posRel_cercle_cercle(equations.value.objet1, equations.value.objet2)
	}

	if(reconObject.value.objet1==='plan' && reconObject.value.objet2==='plan'){
		return posRel_plan_plan(equations.value.objet1, equations.value.objet2)
	}

	if(reconObject.value.objet1==='plan' && reconObject.value.objet2==='sphère'){
		return posRel_plan_sphere(equations.value.objet1, equations.value.objet2)
	}
	if(reconObject.value.objet1==='sphère' && reconObject.value.objet2==='plan'){
		return posRel_plan_sphere(equations.value.objet2, equations.value.objet1)
	}

	if(reconObject.value.objet1==='sphère' && reconObject.value.objet2==='sphère'){
		return posRel_sphere_sphere(equations.value.objet1, equations.value.objet2)
	}

	return "???"
})

function posRel_droite2d_droite2d(equ1:Equation, equ2:Equation){
	const line1 = new Line().fromEquation(equ1)
	const line2 = new Line().fromEquation(equ2)

	return line1.isParallelTo(line2) ? 'parallèles' :
		line1.isSameAs(line2) ? 'confondues' : 'sécantes'
}

function posRel_droite2d_cercle(equ1:Equation, equ2:Equation){
	const line1 = new Line().fromEquation(equ1)
	const circle2 = new Circle(equ2)


	const d = line1.distanceTo(circle2.center).value
	const r = circle2.radius.value

	if(d===r){
		return 'tangentes'
	}

	if(d<r){
		return 'sécantes'
	}

	return 'disjoints'

}

function posRel_cercle_cercle(equ1:Equation, equ2:Equation){
	const c1 = new Circle(equ1)
	const c2 = new Circle(equ2)

	const d = c1.center.distanceTo(c2.center).value

	if(d===0){
		if(c1.radius.value===c2.radius.value){
			return 'superposés'
		}
		return 'concentriques'
	}

	const r1 = c1.radius.value
	const r2 = c2.radius.value

	if(Math.abs(r1-r2)>d){
		return "intérieurs"
	}

	if(Math.abs(r1-r2)===d){
		return "tangents intérieurement"
	}

	if(r1+r2<d){
		return "sécants"
	}

	if(r1+r2===d){
		return "tangents extérieurement"
	}

	if(r1+r2>d){
		return "disjoints"
	}

	return "disjoints"
}

function posRel_droite3d_droite3d(equ1:Equation, equ2:Equation){

}

function posRel_droite3d_plan(equ1:Equation, equ2:Equation){

}

function posRel_droite3d_sphere(equ1:Equation, equ2:Equation){

}

function posRel_plan_plan(equ1:Equation, equ2:Equation){
	const p1 = new Plane3({equation: equ1})
	const p2 = new Plane3({equation: equ2})

	if(!p1.normal.isColinearTo(p2.normal)){
		return "sécants"
	}

	return p1.distanceTo(p2.point)===0 ? "confondus" : "parallèles"
}

function posRel_plan_sphere(equ:Equation, sphere:Equation){
	const p = new Plane3({equation: equ})
	const s = new Sphere3().fromEquation(sphere)

	const d = p.distanceTo(s.center)
	const r = s.radius.value

	if(d===r){
		return "tangents"
	}

	if(d<r){
		return "sécants"
	}

	return "disjoints"

}

function posRel_sphere_sphere(equ1:Equation, equ2:Equation){
	const s1 = new Sphere3().fromEquation(equ1)
	const s2 = new Sphere3().fromEquation(equ2)

	const posRel = s1.relativePosition(s2)

	switch (posRel){
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

		<div v-if="equations">
			<div>{{ reconObject.objet1 }} <span v-katex="equations.objet1.tex" /></div>
			<div>{{ reconObject.objet2 }} <span v-katex="equations.objet2.tex" /></div>
		</div>
		<div v-else>
			Un des deux polynômes n'est pas reconnu
		</div>

		<div>Positions relatives: {{ positionRelative }}</div>
	</article>
</template>

<style scoped lang="postcss">

</style>
