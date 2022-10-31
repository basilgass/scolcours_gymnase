<template>
	<chapter-article>
		<template #title>
			Permutations
		</template>

		<div>
			Une permutation est le réarrangement d'un certains nombres d'objets discernables. L'ordre est important
			et il y a autant d'emplacements (<span v-katex="'n'" />) que d'objets  (<span v-katex="'p'" />).
		</div>

		<chapter-simple-exercise>
			<div>De combien de façons différentes peut-on ranger 8 crayons de couleurs différentes ?</div>

			<chapter-answer>
				<div v-katex="'8 \\cdot 7 \\cdot 6  \\cdot 5  \\cdot 4  \\cdot 3 \\cdot 2  \\cdot 1 = 8! = 40320'" />
			</chapter-answer>
		</chapter-simple-exercise>

		<chapter-simple-exercise>
			Combien d'anagramme peut-on former avec le mot
			<input
				v-model="mot"
				class="border-b border-b-blue-300 focus:outline-none focus:border-b-blue-600 transition-colors"
			> ?
			<button
				class="btn btn-xs ml-5"
				@click="nouveauMot"
			>
				nouveau mot
			</button>

			<chapter-answer
				v-model="showAnagramme"
			>
				<div v-katex="anagramme" />
			</chapter-answer>
		</chapter-simple-exercise>
	</chapter-article>


	<chapter-article>
		<template #title>
			Arrangements
		</template>

		<div class="katex-inline-boxed">
			Un arrangement est une permutation d'une partie des objets à disposition.
			L'ordre est important et il y a plus d'emplacements (<span v-katex="'n'" />) que d'objets  (<span v-katex="'p'" />).
		</div>

		<div
			v-katex="`A_p^n = \\frac{n!}{(n-p)!}`"
			class="text-lg"
		/>

		<chapter-simple-exercise>
			De combien de façon peut-on aligner trois cartes de Jass ?
			<chapter-answer>
				<div v-katex="`A_3^{36} = \\frac{36!}{(36 - 3)!} = 42840`" />
			</chapter-answer>
		</chapter-simple-exercise>

		<chapter-simple-exercise>
			Calculer le nombre de nombres à 5 chiffres qui respectent les conditions suivantes
			<ul class="list-disc list-inside">
				<li>les nombres sont composés des chiffres 0 à 9</li>
				<li>si le premier chiffre est pair, alors le dernier l'est aussi</li>
				<li>chaque chiffre ne peut être utilisé qu'une seule fois</li>
			</ul>

			<chapter-answer>
				<div>Si le premier chiffre est une chiffre impair. On a 5 chiffres impairs possibles, puis on doit choisir 4 chiffres parmi les 9 restants.</div>
				<div v-katex="`5\\cdot \\underbrace{A_4^9}_{\\text{4 chiffres parmi 9}} = 5\\cdot \\frac{9!}{(9-4)!} = 5 \\cdot 9 \\cdot 8 \\cdot 7 \\cdot 6 = 15120`" />

				<div>Si le premier chiffre est une chiffre pair. Il y a 5 chiffres pairs, mais le premier ne peut pas être 0 (zéro). Il reste alors 4 chiffres pairs pour les unités (car on peut utiliser le zéro). Il reste à choisir 3 chiffres parmi les 8 restants.</div>
				<div v-katex="`4\\cdot \\underbrace{A_1^4}_{\\text{un pair parmi 4}} \\cdot \\underbrace{A_3^8}_{\\text{3 chiffres parmi 8}} = 4 \\cdot 4 \\cdot 8 \\cdot 7 \\cdot 6 = 5376`" />
			</chapter-answer>
		</chapter-simple-exercise>
	</chapter-article>


	<chapter-article>
		<template #title>
			Arrangements avec répétitions
		</template>

		<div class="katex-inline-boxed">
			Lorsqu'on autorise les répétitions dans un arrangement, on parle d'arrangement avec ... répétitions !
			Dans ce cas, il peut y avoir plus d'emplacements (<span v-katex="'n'" />) que d'objets (<span v-katex="'p'" />) à placer.
		</div>

		<div
			v-katex="`\\overline{A_p^n} = n^p`"
			class="text-lg"
		/>

		<chapter-simple-exercise>
			Calculer le nombre de nombres à 3 chiffres composés de chiffres impairs.

			<chapter-answer>
				<div v-katex="`\\overline{A_3^5} = 5^3 = 125`" />
			</chapter-answer>
		</chapter-simple-exercise>

		<chapter-simple-exercise>
			Calculer le nombre de nombres à 5 chiffres composés de chiffres multiple de 3.

			<chapter-answer>
				<div>
					Il y a 3 chiffres qui sont des multiples de 3: <span
						v-katex="`3,6,9`"
						class="ml-3"
					/>
				</div>
				<div v-katex="`\\overline{A_5^3} = 3^5 = 243`" />
			</chapter-answer>
		</chapter-simple-exercise>
	</chapter-article>

	<chapter-article>
		<template #title>
			Combinaisons
		</template>
		<template #options>
			Notation: <span v-katex="`C_p^n`" />
			<ui-switch
				v-model="binomialNotation"
				sm
				class="mx-1"
			/>
			<span v-katex="`\\binom{n}{p}`" />
		</template>

		<div>
			Lorsque l'ordre n'est pas pris en compte et qu'il n'y a pas de répétions, on parle de combinaisons.

			Une combinaison est un arrangement dans lequel on a enlevé l'ordre, en divisant par le nombre de permutations possibles !
		</div>

		<div v-katex="`${ binomial('n', 'p') } = \\frac{n!}{(n-p)!\\cdot p!}`" />

		<chapter-simple-exercise>
			Calculer le nombre de mains différentes de 5 cartes avec un jeu de Jass (36 cartes).

			<chapter-answer>
				<div v-katex="`${ binomial(36, 5) } = \\frac{36!}{(36-5)!\\cdot 5!} = 376992`" />
			</chapter-answer>
		</chapter-simple-exercise>

		<chapter-simple-exercise>
			Calculer le nombre de mains différentes de 5 cartes contenant 3 rois avec un jeu de Jass (36 cartes).

			<chapter-answer>
				<div v-katex="`\\underbrace{${ binomial(4, 3) }}_{\\text{3 rois parmi les 4}} \\cdot \\underbrace{${ binomial(32, 2) }}_{\\text{2 cartes parmi le reste}} = 4 \\cdot 496 = 1984`" />
			</chapter-answer>
		</chapter-simple-exercise>

		<chapter-simple-exercise>
			Calculer le nombre de mains différentes de 7 cartes contenant 3 rois, 2 dames et 1 valets avec un jeu de Jass (36 cartes).

			<chapter-answer>
				<div v-katex="`\\underbrace{${ binomial(4, 3) }}_{\\text{3 rois parmi les 4}} \\cdot \\underbrace{${ binomial(4, 2) }}_{\\text{2 dames parmi les 4}} \\cdot \\underbrace{${ binomial(4, 1) }}_{\\text{1 valet parmi les 4}} \\cdot \\underbrace{${ binomial(24, 1) }}_{\\text{une autre carte}} = 4 \\cdot 6 \\cdot 4 \\cdot 24 = 2304`" />
			</chapter-answer>
		</chapter-simple-exercise>
	</chapter-article>
	<!--		<div>-->
	<!--			<h2 class="chapter-menu text-lg mb-10">-->
	<!--				Exemples-->
	<!--			</h2>-->
	<!--			<posts-list-->
	<!--				:chapter="$page.props.chapter.slug"-->
	<!--			/>-->
	<!--		</div>-->
</template>

<script setup>
/** Chapter
 * title: combinatoire
 * body: la combinatoire est l'art du dénombrement.
 */
import ChapterArticle from "@/Components/backup/ChapterArticle.vue"
import ChapterAnswer from "@/Components/Chapters/Exercises/ChapterAnswer"
import {computed, onMounted, ref} from "vue"
import {listeDeMots} from "@/helpers/liste-des-mots-francais"
import _ from "lodash"
import UiSwitch from "@/Components/Ui/UiSwitch"
import ChapterSimpleExercise from "@/Components/Chapters/Exercises/ChapterSimpleExercise"


let mot = ref(""),
	showAnagramme = ref(false)

let anagramme = computed(()=>{
	if(mot.value.length===0){return "\\text{aucun mot}"}

	let tex = "",
		letters = {},
		resultat = 0

	// Count the number of each letters.
	for(let letter of mot.value){
		if(letters[letter]===undefined){letters[letter] = 0}
		letters[letter] ++
	}

	// Remove all single occurence
	letters = Object.entries(letters).filter(([key, value])=>value>1)
	resultat = factorial(mot.value.length)
	if(letters.length>0) {
		tex = `\\frac{ ${mot.value.length}! }{ ${ letters.map(([key, value])=> `${value}!`).join("\\cdot") } }`

		for(let [key, value] of letters){
			resultat = resultat/factorial(value)
		}
	}else{
		tex = `${mot.value.length}!`
	}

	return `${tex}=${resultat}`
})

function factorial(n){
	let f = 1
	for(let i = n; i>0; i--){
		f*=i
	}
	return f
}

function nouveauMot(){
	showAnagramme.value = false
	mot.value = _.sample(listeDeMots)
}


let binomialNotation = ref(false)
function binomial(n, p){
	if(binomialNotation.value){
		return `\\binom{ ${n} }{ ${p} }`
	}else{
		return `C_{ ${p} }^{ ${n} }`
	}
}
onMounted(() => {
	nouveauMot()
})

</script>

