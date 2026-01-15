import PiMath from "pimath"

const estSur = PiMath.Random.bool()
const A = {
	x: PiMath.Random.numberSym(10),
	y: PiMath.Random.numberSym(10)
}
const d = PiMath.Random.line({A})
const x = A.x
const y = A.y + (estSur ? 0 : 1)

const canonical = d.tex
const equ = d.equation

if (d.a.isNegative()) {
	equ.multiply(-1)
}

const l = equ.left.evaluate({x, y}).tex
const r = equ.right.tex

return {
	d: canonical,
	x,
	y,
	p: canonical
		.replace('x', '(' + A.x + ')')
		.replace('y', '(' + y + ')')
		.replace('=', '\\stackrel{?}{=}')
	,
	l, r,
	s: l === r ? '=' : '\\neq',
	a: estSur ? "appartient" : "n'appartient pas",
	b: estSur ? "\\in" : "\\not\\in"
}
