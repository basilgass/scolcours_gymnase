<template>
	<div class="typo grid grid-cols-1 md:grid-cols-2">
		<div>
			<h2>exercice: tangente(s) à un cercle</h2>
			<div>
				Calculer la(les) tangente(s) au cercle
				<div v-katex="`\\Gamma: ${circleAsTex}`" />
				passant par le point
				<div v-katex="`A${pointAsTex}`" />
			</div>
		</div>
		<div class="place-self-end w-full">
			<form-input
				v-model="answer"
				name="answer"
				label="Equation de la tangente"
				@keyup.enter="checkResult"
			/>
			<div class="text-xs">
				Donner le résultat sous la forme canonique, réduite avec le coefficient de \(x\) positif
			</div>

			<div
				class="text-xs"
				:class="{
					'h-8':pointOnCircle===false,
					'h-4': pointOnCircle===true
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
import FormInput from "@/Components/Form/FormInput"
import {ref, watch} from "vue"
import {PiMath} from "pimath/esm"

const props = defineProps({
	pointOnCircle: {type: Boolean, default: null}
})

let answer = ref(""),
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
if(props.pointOnCircle===true){
	point = PiMath.Random.array(pointsOnCircle)[0]
	pointAsTex.value = point.tex
	tangents = circle.tangents(point)
}else if(props.pointOnCircle===false){
	let twoPoints, tg1, tg2, intersection

	securityCount = 0
	while(securityCount<100){
		twoPoints = PiMath.Random.array(pointsOnCircle, 2)
		tg1 = circle.tangents(twoPoints[0])[0]
		tg2 = circle.tangents(twoPoints[1])[0]
		intersection = tg1.intersection(tg2)

		if(intersection.hasIntersection){
			pointAsTex = intersection.point.tex
			break
		}

		securityCount++
	}

	tangents = [tg1, tg2]
}else{
	// Tangente par rapport à une droite.
}

console.log(tangents.map(tg=>tg.tex.canonical))

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

	let answerLine
	if(tangents.length===1){
		let check = checkTangent(answer.value, tangents[0].tex.canonical)
		result.value = [check]
		return
	}

	if(tangents.length===2){
		if(answer.value===tangents.map(x=>x.tex.canonical).join(",") || answer.value===tangents.reverse().map(x=>x.tex.canonical).join(",")){
			result.value = [
				{
					result: "Votre réponse est correcte ! Bravo !",
					correct: 1
				}
			]
			return
		}

		let givenAnswer = answer.value.split(",")
		if(givenAnswer.length!==2){
			result.value = [
				{
					result: "Il n'y a pas deux tangentes. Séparez les équations cartésiennes des tangentes par une virgule.",
					correct: -1
				}
			]
			return
		}

		// On controle A,B vs A,B
		console.log(givenAnswer[0], tangents[0].tex.canonical)
		console.log(givenAnswer[1], tangents[1].tex.canonical)
		let checkAA = checkTangent(givenAnswer[0], tangents[0].tex.canonical),
			checkBB = checkTangent(givenAnswer[1], tangents[1].tex.canonical)

		result.value = [checkAA,checkBB]

		let checkAB = checkTangent(givenAnswer[0], tangents[1].tex.canonical),
			checkBA = checkTangent(givenAnswer[1], tangents[0].tex.canonical)


		if(checkAB.correct+checkBA.correct>checkAA.correct+checkBB.correct){
			result.value = [checkAB, checkBA]
		}
		return
	}

	result.value = [{
		result : "Votre réponse est fausse.",
		correct: -1
	}]
}

</script>
