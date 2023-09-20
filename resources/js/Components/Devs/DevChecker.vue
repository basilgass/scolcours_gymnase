<template>
	<!-- Title -->
	<div ref="root">
		<div class="grid grid-cols-1 gap-3">
			SEE CONSOLE
		</div>
	</div>
</template>
<script lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script lang="ts" setup>

import {SolutionChecker} from "@/Checkers/SolutionChecker";
import {VectorChecker} from "@/Checkers/VectorChecker";
import {NumberChecker} from "@/Checkers/NumberChecker";
import {CoordChecker} from "@/Checkers/CoordChecker";
import {FractionChecker} from "@/Checkers/FractionChecker";
import {EquationChecker} from "@/Checkers/EquationChecker";
import {ExpChecker} from "@/Checkers/ExpChecker";

// let chk = new SolutionChecker('checker:log'.split('/n'))
// console.log(chk.check("{log(3)-2/5;4-log(7)}", "s{-log(3)+2/-5;4-log(7)}"))

// let chk = new VectorChecker("nb,co")
// console.log(chk.check('(3;5)', '(6;10)'))

// let chk = new NumberChecker("2,s")
// console.log(chk.check('3.10', '3.1'))

// let chk = new CoordChecker('frac')
// console.log(chk.check('(3/2;2)', '(3/2;2)'))

// let chk = new FractionChecker('r')
// console.log(chk.check('3/2', '3/2'))

// let chk = new EquationChecker('s')
// console.log(chk.check('y=(x-2)^2+4', 'y=(x-2)^2+4'))

let chk = new ExpChecker()
console.log(chk.check("x(x-3)e^x(x+2)+e^3x+(7x-5)", "e^3x+(x^2-3x)e^(2x+x^2)-(5-7x)"))
console.log(chk.check("-e^(1/x)/x^2", "-e^(1/x)/x^2"))

console.log(chk.name)
console.log(chk.description)
console.log(chk.secondaryCheckerName)
console.log(chk.format)

</script>

