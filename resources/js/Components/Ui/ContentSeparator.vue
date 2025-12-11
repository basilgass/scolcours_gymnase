<script setup lang="ts">

// TODO: faire un peu de recherche dans des vrais livres...

// liste d'expressions mathématiques, avec la référence de l'auteur et dates au format LaTeX
const expressions = [
	"\\int e^x \\, dx = e^x + C  \\, \\scriptsize\\quad (Leonhard \\, Euler, \\, 1707-1783)",
	"a^2 + b^2 = c^2  \\,  \\scriptsize\\quad (Pythagore, \\, vers \\, 500 \\, av. \\, J.-C.)",
	"e^{(i\\pi)} + 1 = 0  \\,  \\scriptsize\\quad (Leonhard \\, Euler, \\, 1748)",
	"F = ma  \\,  \\scriptsize\\quad (Isaac \\, Newton, \\, 1687)",
	"E = mc^2  \\,  \\scriptsize\\quad (Albert \\, Einstein, \\, 1905)",
	"V = I\\cdot R  \\,  \\scriptsize\\quad (Georg \\, Simon \\, Ohm, \\, 1827)",
	"\\Delta G = \\Delta H - T\\Delta S  \\,  \\scriptsize\\quad (Josiah \\, Willard \\, Gibbs, \\, 1876)",
	"PV = nRT  \\,  \\scriptsize\\quad (Émile \\, Clapeyron, \\, 1834)",
	"f(x) = ax^2 + bx + c  \\,  \\scriptsize\\quad (René \\, Descartes, \\, 1637)",
	"\\frac{d}{dx} (sin \\, x) = cos \\, x  \\,  \\scriptsize\\quad (Isaac \\, Newton, \\, 1665)"
]


</script>

<template>
	<div
		class="my-8
		font-extralight text-center
	 	text-gray-300 dark:text-gray-800 relative grid place-items-center"
	>
		<hr class="absolute w-full translate-y-[50%] ">
		<div
			class="bg-background text-xs text-slate-300 z-2 px-5"
			v-katex="expressions[Math.floor(Math.random() * expressions.length)]"
		/>
	</div>
</template>


<style scoped>

</style>
