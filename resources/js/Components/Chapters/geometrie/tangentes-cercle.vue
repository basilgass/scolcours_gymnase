<template>
	<section
		ref="root"
	>
		<table-of-contents
			query=".chapter-menu"
			class="space-y-10"
		>
			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 p-6 gap-6 rounded bg-white">
				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Tangente à un point du cercle
					</h2>
					<IllustrationDraw
						class="max-w-md"
						:draw="draw1"
					/>
				</div>
				<div class="md:col-span-2 lg:col-span-1 space-y-10">
					<div>
						Soit \(T(2;4)\) un point et \(\Gamma: (x-6)^2+(y-7)^2=25\) le cercle de centre \(C(6;7)\) et de rayon
						\(r=\sqrt{25}=5\)
					</div>
					<div>
						On vérifie que \(T\in \Gamma\), autrement dit que le point est sur le cercle.
						\[(2-6)^2+(4-7)^2= (-4)^2+(-3)^2=16+9=25\]
						L'équation du cercle \(\Gamma\) est bien vérifiée.
					</div>
					<div>
						On utilise l'équation dédoublée du cercle en remplaçant une lettre (en rouge) par les coordonnées du point de tangence \(T\)
						\[
						\begin{aligned}
						(\textcolor{red}{x}-6)(x-6)+(\textcolor{red}{y}-7)(y-7)=& 25\\
						(2-6)(x-6)+(4-7)(y-7)= & 25\\
						-4(x-6)-3(y-7) =& 25 \\
						-4x+24 -3y+21 -25 =& 0\\
						-4x-3y+20 =& 0\\
						4x+3y-20 =& 0
						\end{aligned}
						\]
					</div>
					<div>
						L'équation de la tangente est \((t): 4x+3y-20=0\)
					</div>
				</div>

				<hr class="col-span-1 md:col-span-3 lg:col-span-2 my-5">
				<tangentes-a-un-cercle
					point-on-circle
					class="col-span-1 md:col-span-3 lg:col-span-2"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 p-6 gap-6 rounded bg-white">
				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Tangentes à un cercle, parallèles à une autre droite
					</h2>
					<IllustrationDraw
						class="max-w-md"
						:draw="draw2"
					/>
				</div>
				<div class="md:col-span-2 lg:col-span-1 space-y-10">
					<div>
						Soit \(\Gamma: (x-6)^2+(y-7)^2=25\) le cercle de centre \(C(6;7)\) et de rayon
						\(r=\sqrt{25}=5\) et \((d): 6x-8y+40=0\) une droite.
					</div>

					<div>Toutes les droites parallèles à \(6x-8y+40=0\) sont de la forme \(\boxed{(t): 6x-8y+c=0}\)</div>

					<div>
						On calcule la distance entre les droites parallèles \((t): 6x-8y+c=0\) et le centre du cercle. Cette
						distance doit être égale au rayon du cercle.<br>
						On remplace les variables \(x\) et \(y\) (en rouge) par les coordonnées du centre du cercle.
						\[
						\begin{aligned}
						\delta(C;t) =& 5 \\[1.5em]
						\frac{\big\vert 6\cdot \textcolor{red}{x} -8\cdot \textcolor{red}{y} + c
						\big\vert}{\sqrt{(6)^2+(-8)^2}} =& 5 \\[1.5em]
						\frac{\big\vert 6\cdot 6 -8\cdot 7 + c \big\vert}{\sqrt{100}} =& 5 \\[1.5em]
						\frac{\big\vert -20 + c \big\vert}{\sqrt{100}} =& 5 \\[1.5em]
						\big\vert -20 + c \big\vert =& 50 \\[1.5em]
						-20 + c =& \pm 50
						\end{aligned}
						\]
						<div class="flex flex-col md:flex-row justify-between">
							<div>
								\[
								\begin{aligned}
								-20+c =& 50 \\
								c =& 70\\
								(t_1): 6x-8y&+70=0
								\end{aligned}
								\]
							</div>
							<div>
								\[
								\begin{aligned}
								-20+c =& -50 \\
								c =& -30 \\
								(t_1): 6x-8y&-30=0
								\end{aligned}
								\]
							</div>
						</div>
					</div>
					<div>
						Les équations des tangentes sont \((t_1): 6x-8y+70=0\) et \((t_2): 6x-8y-30=0\)
					</div>
				</div>

				<hr class="col-span-1 md:col-span-3 lg:col-span-2 my-5">
				<tangentes-a-un-cercle
					class="col-span-1 md:col-span-3 lg:col-span-2"
					parallel-to
				/>

				<tangentes-a-un-cercle
					class="col-span-1 md:col-span-3 lg:col-span-2"
					perpendicular-to
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 p-6 gap-6 rounded bg-white">
				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Tangentes au cercle passant par un point \(A\)
					</h2>
					<IllustrationDraw
						class="max-w-md"
						:draw="draw3"
					/>
				</div>
				<div class="md:col-span-2 lg:col-span-1 space-y-10">
					<div>
						Soit \(A(7;1)\) un point et \(\Gamma: (x-6)^2+(y-8)^2=25\) le cercle de centre \(C(6;8)\) et de
						rayon
						\(r=\sqrt{25}=5\)
					</div>
					<div>
						On vérifie que le point \(A\) est externe au cercle en calculant la distance entre le point et le
						centre du cercle. Cette distance doit être plus grande que le rayon.
						\[\big\Vert \overrightarrow{AC} \big\Vert = \left\Vert\begin{pmatrix}6-7 \\
						8-1\end{pmatrix}\right\Vert = \sqrt{(-1)^2+(7)^2} = \sqrt{50} \approx = 7.07>5\]
					</div>

					<div>
						On prépare l'équation de la tangente: \((t): y = mx+h\). On remplace les variables \(x\) et \(y\)
						par les coordonnées du point \(A\) et on isole \(h\)

						\[1 = m\cdot 7 + h \implies h = 1-7m\]
						\[\implies y = mx + 1-7m \implies \boxed{(t): mx-y+1-7m = 0}\]
					</div>

					<div>
						On calcule la distance entre le centre du cercle et les tangentes

						\[
						\begin{aligned}
						\delta(C;t) =& 5 \\[1.5em]
						\frac{\big\vert m\cdot \textcolor{red}{x} - \textcolor{lightgray}{1\cdot} \textcolor{red}{y} + 1 -7m
						\big\vert}{\sqrt{(m)^2+(1)^2}} =& 5 \\[1.5em]
						\frac{\big\vert m\cdot 6 - 8 + 1 -7m \big\vert}{\sqrt{m^2+1}} =& 5 \\[1.5em]
						\frac{\big\vert -m-7 \big\vert}{\sqrt{m^2+1}} =& 5 \\[1.5em]
						\frac{(-m-7)^2}{m^2+1} =& 25 \\[1.5em]
						m^2+14m+49 =& 25(m^2+1) \\[1.5em]
						m^2+14m+49 =& 25m^2+25 \\[1.5em]
						24m^2-14m-24 =& 0 \\[1.5em]
						12m^2-7m-12 =& 0 \\[1.5em]
						\Delta = (-7)^2-4\cdot 12 \cdot (-12) =& 25 \\[1.5em]
						m_{1,2} = \frac{7\pm\sqrt{\Delta}}{2\cdot 12} =& \frac{7\pm 25}{24}\\[1.5em]
						m_1 = \frac{32}{24} = \frac{4}{3} \text{ et }& m_2 = -\frac{18}{24} = -\frac{3}{4}
						\end{aligned}
						\]
					</div>
					<div>
						On remplace \(m\) dans l'équation de la tangente

						<div class="flex flex-col md:flex-row justify-between">
							<div>
								\[
								\begin{aligned}
								(t_1):& \frac{4}{3}x-y+1-7\cdot\frac{4}{3} = 0 \\
								(t_1):& 4x-3y + 3 -28 = 0 \\
								(t_1):& 4x-3y-25 = 0\\
								\end{aligned}
								\]
							</div>
							<div>
								\[
								\begin{aligned}
								(t_2):& -\frac{3}{4}x-y+1-7\cdot\left(-\frac{3}{4}\right) = 0 \\
								(t_2):& -3x-4y + 4 +21 = 0 \\
								(t_2):& -3x-4y+25 = 0\\
								(t_2):& 3x+4y-25 = 0\\
								\end{aligned}
								\]
							</div>
						</div>
					</div>

					<div>
						Les équations des tangentes sont \((t_1): 4x-3y-25=0\) et \((t_2): 3x+4y-25=0\)
					</div>
				</div>

				<hr class="col-span-1 md:col-span-3 lg:col-span-2 my-5">
				<tangentes-a-un-cercle
					point-outside
					class="col-span-1 md:col-span-3 lg:col-span-2"
				/>
			</div>
		</table-of-contents>
	</section>
</template>

<script setup>
import {onMounted, ref} from "vue"
import IllustrationDraw from "@/Components/Posts/IllustrationDraw"
import TangentesAUnCercle from "@/Components/Exercise/geometrie/TangentesAUnCercle"
import TableOfContents from "@/Components/Ui/TableOfContents"

/** Chapter
 * title: tangentes à un cercle
 * body: Une droite qui coupe un cercle en un seul point est une tangente. Dans ce chapitre, on va étudier les techniques de calculs qui permettent de déterminer les équations cartésiennes de ces tangentes.
 */

let root = ref(null),
	draw1 = ref({}),
	draw2 = ref({}),
	draw3 = ref({})

draw1.value = {
	type: "draw",
	code: `C(6,7)
	c=circ C,5,
	T(2,4),
	t1=line 4x+3y-20=0->green`,
	parameters: "-1,15,-1,15"
}

draw2.value = {
	type: "draw",
	code: `C(6,7)
	c=circ C,5,
	d=line 6x-8y+40=0
	t1=line 6x-8y+70=0->green
	t1=line 6x-8y-30=0->green`,
	parameters: "-1,15,-1,15"
}

draw3.value = {
	type: "draw",
	code: `C(6,8)
	A(7,1)
	c=circ C,5,
	t1=line 4x-3y-25=0->green
	t1=line 3x+4y-25=0->green`,
	parameters: "-1,15,-1,15"
}

// When loaded - auto katex
onMounted(() => {
	katexAutoRender(root.value)
})

</script>

