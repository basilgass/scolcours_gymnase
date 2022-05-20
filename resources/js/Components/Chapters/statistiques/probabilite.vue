<template>
	<table-of-contents
		ref="toc"
		query=".chapter-menu"
		class="space-y-10 katex-boxed"
	>
		<chapter-article>
			<template #title>
				Introduction
			</template>
			<div>L'univers d'une expérience alatoire, notée \(U\) est un ensemble qui contient toutes les réalisations possibles. Un événement \(A\) est un ensemble contenu dans \(U\), e.g. \(A\subset U\).</div>
			<div>\(\# U\) est le cardinal de l'univers, autrement dit le nombre d'éléments qu'il contient. \(\# A\) est le cardinal de l'événement \(A\). Il est forcément plus petit ou égal à \(\# U\): \(\# A \leq \# U\).</div>
			<div>On définit la probabilité de l'événement \(A\) par le rapport</div>
			<div v-katex="`P(A) = \\frac{\\# A}{\\# U}`" />

			<chapter-formulas
				title="Propriétés"
				:chapter="$page.props.chapter"
			/>
		</chapter-article>
		<chapter-article>
			<template #title>
				Arbre des probabilités
			</template>

			<probability-tree />
		</chapter-article>
	</table-of-contents>
</template>

<script setup>
/** Chapter
 * title: probabilité
 * body: Calculs des probabilités
 */
import TableOfContents from "@/Components/Ui/TableOfContents"
import ChapterArticle from "@/Components/Ui/Chapters/ChapterArticle"
import ProbabilityTree from "@/Components/Pi/ProbabilityTree"
import ChapterFormulas from "@/Components/Ui/Chapters/ChapterFormulas";</script>
