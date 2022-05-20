<template>
	<table-of-contents
		ref="toc"
		query=".chapter-menu"
		class="space-y-10 katex-boxed"
	>
		<chapter-article>
			<template #title>
				Processus d'optimisation
			</template>

			<div>L'optimisation se fait en étudiant une fonction qui décrit la valeur à optimiser. On recherche en particulier les extrema de la fonction</div>

			<ol class="list list-decimal list-inside">
				<li>Déterminer une fonction qui décrit la valeur à optimiser en utilisant, si nécessaire, plusieurs variables</li>
				<li>Déterminer la contrainte, une équation qui lie les deux variables.</li>
				<li>Isoler la variable dans la contrainte pour la remplacer dans la fonction à optimiser</li>
				<li>Calculer la dérivée de la fonction à optimiser</li>
				<li>Rechercher les zéros de la dérivée</li>
				<li>Etudier le signe de la dérivée, afin d'obtenir le minimum ou le maximum.</li>
			</ol>

			<chapter-exercise-steps
				no-shuffle
				:content="boiteDeConserve"
			/>
		</chapter-article>
	</table-of-contents>
</template>

<script setup>
/** Chapter
 * title: optimisation
 * body: L'optimisation permet de maximiser ou minimiser une fonction
 */
import TableOfContents from "@/Components/Ui/TableOfContents"
import ChapterArticle from "@/Components/Ui/Chapters/ChapterArticle"
import ChapterExerciseSteps from "@/Components/Ui/Chapters/ChapterExerciseSteps"
import {SimpleExercise} from "@/scolcours"

function boiteDeConserve( ){
	let EX = new SimpleExercise(
		"",
		"Calculer les dimensions (hauteur, rayon) d'une boîte de conserve de 400ml afin de minimiser la quantité de métal.<br>On supposera que l'épaisseur de métal est négligeable dans les calculs de volume/aire"
	)

	EX.addData(
		"Déterminer la fonction de la surface de métal en fonction de la hauteur \\(h\\) et du rayon \\(r\\). Cette fonction a deux variables.",
		"f(h, r) = 2 \\cdot \\underbrace{\\pi  r^2}_{\\text{un couvercle} } + \\underbrace{ 2 \\pi  r \\cdot h }_{ \\text{surface latérale} }"
	)

	EX.addData(
		"Déterminer la contrainte, qui est une équation qui lie le rayon et la hauteur.",
		"\\pi  r^2 \\cdot h = 0.4"
	)

	EX.addData(
		"On isole dans la contrainte une des deux variables. Dans ce cas, on isole \\(h\\)",
		"h = \\frac{ 0.4 }{ \\pi r^2 }"
	)

	EX.addData(
		"On modifie la fonction \\(f(h, r)\\) en utilisant la contrainte ci-dessus. On obtient alors une fonction à une seule variable \\(f(r)\\)",
		`\\begin{aligned}
		f(r) &=  2  \\pi  r^2 + 2 \\pi  r  \\frac{ 0.4 }{ \\pi  r^2 }\\\\
		 &=  2  \\pi  r^2 + \\frac{ 0.8 }{ r }
		\\end{aligned}`
	)

	EX.addData(
		"L'optimisation passe par la recherche des extremums d'une fonction. Il faut donc calculer la dérivée \\(f'(r)\\)",
		`f'(r) = \\left( 2\\pi r^2 + \\frac{0.8}{r}\\right)'
		= 4\\pi r - \\frac{0.8}{r^2}
		= \\frac{4\\pi r^3}{r^2} - \\frac{0.8}{r^2}
		= \\frac{4\\pi r^3 - 0.8}{r^2}`
	)

	EX.addData(
		"On recherche alors les zéros de la dérivée. Dans ce cas, il suffit de regarder lorsque le numérateur est nul.",
		`\\begin{aligned}
		4\\pi r^3-0.8 &= 0\\\\
		4\\pi r^3 &= 0.8\\\\
		r^3 &= \\frac{0.2}{\\pi} \\\\
		r &= \\sqrt[3]{ \\frac{0.2}{\\pi} } \\\\
		r &\\approx  0.399
		\\end{aligned}`
	)

	EX.addData(
		"On calcul alors la hauteur de la boîte de conserve en utilisant la contrainte que l'on a déjà calculé",
		"h = \\frac{0.4}{\\pi r^2} = \\frac{0.4}{ \\pi \\sqrt[3]{ \\frac{0.2}{\\pi} }^2 } \\approx 0.8"
	)

	EX.addData(
		"Les dimensions de la boîte de conserve sont dont \\(h\\approx 0.8\\) et \\(r\\approx 0.4\\)"
	)
	return EX
}
</script>
