<template>
	<div
		ref="root"
		class="typo grid grid-cols-1 md:grid-cols-2"
	>
		<div>
			<h2>exercice: tangente(s) à un cercle</h2>
			<div v-if="params.pointOutside || params.pointOnCircle">
				Calculer la(les) tangente(s) au cercle
				<div v-katex="`\\Gamma: ${circleAsTex}`" />
				passant par le point
				<div v-katex="`A${pointAsTex}`" />
			</div>
			<div v-if="params.perpendicularTo||params.parallelTo">
				Calculer la(les) tangente(s) au cercle
				<div v-katex="`\\Gamma: ${circleAsTex}`" />
				qui sont
				<span v-text="params.parallelTo?'parallèles':'perpendiculaires'" />
				à la droite d'équation
				<div v-katex="`(d): ${lineAsTex}`" />
			</div>
			<div v-if="params.coordinates">
				Calculer les coordonnées du point de tangence entre le cercle <div v-katex="`\\Gamma: ${circleAsTex}`" /> et la droite d'équation <div v-katex="`(d): ${lineAsTex}`" />
			</div>
		</div>
		<div class="place-self-end w-full">
			<form-input
				v-model="answer"
				name="answer"
				:label="params.coordinates?'Coordonnées du point':'Equation de la tangente'"
				@keyup.enter="checkResult"
			/>
			<div
				v-if="!params.coordinates"
				class="text-xs"
			>
				Donner le résultat sous la forme canonique, réduite avec le coefficient de \(x\) positif
			</div>
			<div
				v-else
				class="text-xs"
			>
				Donner le résultat sous la forme \(3,4\), sans parenthèse, séparé par une virgule
			</div>

			<div
				class="text-xs"
				:class="{
					'h-8':params.pointOnCircle===false,
					'h-4': params.pointOnCircle===true
				}"
			>
				<div v-if="result.length>0">
					<div
						v-for="(r, index) in result"
						:key="`result-${index}`"
					>
						<div
							:class="{'text-green-600':r.correct===1, 'text-red-600':r.correct===-1, 'text-orange-400':r.correct===0}"
						>
							{{ r.result }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import FormInput from "@/Components/Form/FormInput.vue"
import {onMounted, ref, watch} from "vue"
import {PiMath} from "pimath/esm"

const props = defineProps({
	params: {
		type: Object, default: () => {
		}
	}
})


let root = ref(null),
	answer = ref(""),
	circleAsTex = ref(""),
	pointAsTex = ref(""),
	lineAsTex = ref(""),
	result = ref([])

let radius = PiMath.Random.number(1, 20)
let center = new PiMath.Geometry.Point(
	PiMath.Random.numberSym(10, true),
	PiMath.Random.numberSym(10, true)
)

let circle, pointsOnCircle
let securityCount = 0
while(securityCount < 200){
	radius = PiMath.Random.number(1, 20)
	center = new PiMath.Geometry.Point(
		PiMath.Random.numberSym(10, true),
		PiMath.Random.numberSym(10, true)
	)
	circle = new PiMath.Geometry.Circle(center, radius, true)
	circleAsTex.value = circle.tex

	pointsOnCircle = circle.getPointsOnCircle()
	securityCount++

	if(pointsOnCircle.length>4){break}
	if(pointsOnCircle.length===4 && securityCount> 50){break}
}

let point, tangents
if (props.params.pointOnCircle === true) {
	point = PiMath.Random.array(pointsOnCircle)[0]
	pointAsTex.value = point.tex
	tangents = circle.tangents(point)
}
else if (props.params.pointOutside === true) {
	let twoPoints, tg1, tg2, intersection

	securityCount = 0
	while (securityCount < 100) {
		twoPoints = PiMath.Random.array(pointsOnCircle, 2)
		tg1 = circle.tangents(twoPoints[0])[0]
		tg2 = circle.tangents(twoPoints[1])[0]
		intersection = tg1.intersection(tg2)

		if (intersection.hasIntersection) {
			pointAsTex.value = intersection.point.tex
			break
		}

		securityCount++
	}

	tangents = [tg1, tg2]
}
else if (props.params.parallelTo === true) {
	// Tangente par rapport à une droite.
	let pt, sympt, tg1, tg2
	pt = PiMath.Random.array(pointsOnCircle)[0]

	const CP = (new PiMath.Geometry.Vector(pt, center)).multiplyByScalar(2)

	sympt = new PiMath.Geometry.Point(
		pt.x.clone().add(CP.x),
		pt.y.clone().add(CP.y)
	)
	tg1 = circle.tangents(pt)[0]
	tg2 = circle.tangents(sympt)[0]

	let rndPoint = new PiMath.Geometry.Point(
		PiMath.Random.numberSym(10, true),
		PiMath.Random.numberSym(10, true)
	)
	let d = new PiMath.Geometry.Line().parseByPointAndLine(rndPoint, tg1.clone())

	lineAsTex.value = d.tex.canonical

	tangents = [tg1, tg2]
}
else if (props.params.perpendicularTo === true) {
	// Tangente par rapport à une droite.
	let pt, sympt, tg1, tg2
	pt = PiMath.Random.array(pointsOnCircle)[0]

	const CP = (new PiMath.Geometry.Vector(pt, center)).multiplyByScalar(2)

	sympt = new PiMath.Geometry.Point(
		pt.x.clone().add(CP.x),
		pt.y.clone().add(CP.y)
	)
	tg1 = circle.tangents(pt)[0]
	tg2 = circle.tangents(sympt)[0]

	let rndPoint = new PiMath.Geometry.Point(
		PiMath.Random.numberSym(10, true),
		PiMath.Random.numberSym(10, true)
	)
	let d = new PiMath.Geometry.Line().parseByPointAndLine(rndPoint, tg1.clone(), "perpendicular")
	lineAsTex.value = d.tex.canonical
	tangents = [tg1, tg2]
}
else if(props.params.coordinates === true){
	// Do something
	point = PiMath.Random.array(pointsOnCircle)[0]
	console.log(point.tex)
	const tangent = circle.tangents(point)[0]
	lineAsTex.value = tangent.tex.canonical
}

// console.log(tangents.map(tg=>tg.tex.canonical))

watch(answer, (newValue, oldValue)=>{
	if(newValue!==oldValue){
		result.value = ""
	}
})

function checkTangent(given, shouldBe){
	let checkResult = "Votre réponse est fausse.",
		checkCorrect = -1

	if(shouldBe===given){
		checkResult = "Votre réponse est correcte ! Bravo !"
		checkCorrect = 1
	} else {
		let answerLine = new PiMath.Geometry.Line(given)
		if (!answerLine.exists) {
			checkResult = "L'équation canonique de la tangente n'est pas reconnue."
		}else if (answerLine.tex.canonical === shouldBe) {
			checkResult = "Votre réponse est juste, mais elle n'est pas formatée correctement !"
			checkCorrect = 0
		}
	}

	return {
		result: checkResult,
		correct: checkCorrect
	}
}
function checkResult(){
	if(answer.value===""){
		return
	}

	if(props.params.coordinates){
		let coord = answer.value.split(",")
		if(coord.length!==2){
			result.value = [
				{
					result: "Votre réponse ne correspond pas à des coordonnées d'un point",
					correct: -1
				}
			]
			return
		}

		if(point.x.value===+coord[0] && point.y.value===+coord[1]){
			result.value =[{
				result: "Bravo ! Votre réponse est juste !",
				correct: 1
			}]
			return
		}else if(point.x.value===+coord[0]){
			result.value =[{
				result: "La 1ère coordonnée est juste.",
				correct: 0
			}]
			return
		}else if(point.y.value===+coord[1]){
			result.value =[{
				result: "La 2ème coordonnée est juste.",
				correct: 0
			}]
			return
		}
	}else {
		if (tangents.length === 1) {
			let check = checkTangent(answer.value, tangents[0].tex.canonical)
			result.value = [check]
			return
		}

		if (tangents.length === 2) {
			if (answer.value === tangents.map(x => x.tex.canonical).join(",") || answer.value === tangents.reverse().map(x => x.tex.canonical).join(",")) {
				result.value = [
					{
						result: "Votre réponse est correcte ! Bravo !",
						correct: 1
					}
				]
				return
			}

			let givenAnswer = answer.value.split(",")
			if (givenAnswer.length !== 2) {
				result.value = [
					{
						result: "Il n'y a pas deux tangentes. Séparez les équations cartésiennes des tangentes par une virgule.",
						correct: -1
					}
				]
				return
			}

			// On controle A,B vs A,B
			let checkAA = checkTangent(givenAnswer[0], tangents[0].tex.canonical),
				checkBB = checkTangent(givenAnswer[1], tangents[1].tex.canonical)

			result.value = [checkAA, checkBB]

			let checkAB = checkTangent(givenAnswer[0], tangents[1].tex.canonical),
				checkBA = checkTangent(givenAnswer[1], tangents[0].tex.canonical)


			if (checkAB.correct + checkBA.correct > checkAA.correct + checkBB.correct) {
				result.value = [checkAB, checkBA]
			}
			return
		}
	}

	result.value = [{
		result: "Votre réponse est fausse.",
		correct: -1
	}]
}

onMounted(() => {
	katexAutoRender(root.value)
})

</script>
