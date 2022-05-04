<template>
	<table-of-contents
		ref="toc"
		query=".chapter-menu"
		class="space-y-10 katex-boxed"
	>
		<chapter-article>
			<template #title>
				Titre
			</template>

			<chapter-simple-exercise>
				Un exemple d'exercice

				<chapter-answer>
					Une répnse
				</chapter-answer>
			</chapter-simple-exercise>
		</chapter-article>
	</table-of-contents>
</template>

<script setup>
/** Chapter
 * title: exponentielles
 * body: L'étude des fonctions et équations exponentielles
 */
import TableOfContents from "@/Components/Ui/TableOfContents"
import ChapterArticle from "@/Components/Ui/ChapterArticle"
import ChapterSimpleExercise from "@/Components/Ui/ChapterSimpleExercise"
import ChapterAnswer from "@/Components/Ui/ChapterAnswer";</script>
