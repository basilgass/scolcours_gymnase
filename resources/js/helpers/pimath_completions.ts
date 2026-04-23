// pimath-version: 0.2.3
import type { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete"
import type { EditorState } from "@codemirror/state"
import type { Tooltip } from "@codemirror/view"

// ── Signature help ──

const signatureMap: Record<string, string> = {
    // Constructeurs
    "PiMath.Fraction":      "new Fraction(numerator: number, denominator?: number)",
    "PiMath.Root":          "new Root(value: number, index?: number)",
    "PiMath.Monom":         "new Monom(expr?: string)",
    "PiMath.Polynom":       "new Polynom(expr?: string)",
    "PiMath.Equation":      "new Equation(expr?: string)",
    "PiMath.Matrix":        "new Matrix()",
    "PiMath.LinearSystem":  "new LinearSystem()",
    "PiMath.NumExp":        "new NumExp(expr?: string)",
    // Random
    "PiMath.Random.number":    "number(from: number, to: number, exclude?: number[])",
    "PiMath.Random.numberSym": "numberSym(max: number, allowZero?: boolean)",
    "PiMath.Random.prime":     "prime(max: number)",
    "PiMath.Random.bool":      "bool(percent?: number)",
    "PiMath.Random.fraction":  "fraction(config?: { negative?, zero?, max? })",
    "PiMath.Random.monom":     "monom(config?: { degree?, letters?, positive? })",
    "PiMath.Random.polynom":   "polynom(config?: { degree?, min?, max?, letters?, negative?, zero?, allowNullLead? })",
    "PiMath.Random.equation":  "equation(config?)",
    "PiMath.Random.triplet":   "triplet(target: number, allowZero?: boolean)",
    "PiMath.Random.array":     "array<T>(arr: T[], n?: number)",
    "PiMath.Random.item":      "item<T>(arr: T[])",
    "PiMath.Random.shuffle":   "shuffle<T>(arr: T[])",
    "PiMath.Random.point":     "point(config?: { min?, max? })",
    "PiMath.Random.vector":    "vector(config?: { min?, max? })",
    "PiMath.Random.line":      "line(config?)",
    "PiMath.Random.line3":     "line3(config?)",
    "PiMath.Random.circle":    "circle(config?)",
    // Numeric
    "PiMath.Numeric.gcd":                           "gcd(...values: number[])",
    "PiMath.Numeric.lcm":                           "lcm(...values: number[])",
    "PiMath.Numeric.decompose":                     "decompose(value: number)",
    "PiMath.Numeric.dividers":                      "dividers(value: number)",
    "PiMath.Numeric.divideNumbersByGCD":            "divideNumbersByGCD(...values: number[])",
    "PiMath.Numeric.round":                         "round(value: number, decimals?: number)",
    "PiMath.Numeric.numberCorrection":              "numberCorrection(value: number, digits?: number)",
    "PiMath.Numeric.periodic":                      "periodic(value: number)",
    "PiMath.Numeric.primes":                        "primes(nb?: number)",
    "PiMath.Numeric.greatestPower":                 "greatestPower(value: number, index: number)",
    "PiMath.Numeric.pythagoreanTripletsWithTarget": "pythagoreanTripletsWithTarget(target: number, targetIsSquare?: boolean)",
    // Geometry constructeurs
    "PiMath.Geometry.Vector":   "new Vector(x: number, y: number)",
    "PiMath.Geometry.Point":    "new Point(x: number, y: number)",
    "PiMath.Geometry.Line":     "new Line()",
    "PiMath.Geometry.Triangle": "new Triangle()",
    "PiMath.Geometry.Circle":   "new Circle()",
    // PiMathExt
    "PiMathExt.wrap":           "wrap(v: string | number)",
    "PiMathExt.Random.points":  "points(config?)",
}

function getCallInfo(state: EditorState): { name: string; openParenPos: number } | null {
    const pos = state.selection.main.head
    const lookback = state.doc.sliceString(Math.max(0, pos - 200), pos)
    let depth = 0
    for (let i = lookback.length - 1; i >= 0; i--) {
        const ch = lookback[i]
        if (ch === ')') { depth++; continue }
        if (ch === '(') {
            if (depth === 0) {
                const match = lookback.slice(0, i).match(/([\w.]+)$/)
                if (!match) return null
                return { name: match[1], openParenPos: Math.max(0, pos - 200) + i }
            }
            depth--
        }
    }
    return null
}

export function getSignatureTooltip(state: EditorState): Tooltip | null {
    const info = getCallInfo(state)
    if (!info) return null
    const sig = signatureMap[info.name]
    if (!sig) return null
    return {
        pos: info.openParenPos + 1,
        above: true,
        create() {
            const dom = document.createElement('div')
            dom.className = 'cm-signature-help'
            dom.textContent = sig
            return { dom }
        }
    }
}

const completionMap: Record<string, Completion[]> = {
    "": [
        { label: "PiMath",      type: "namespace", detail: "bibliothèque mathématique" },
        { label: "PiMathExt",   type: "namespace", detail: "extensions locales PiMath" },
        { label: "iteration",   type: "variable",  detail: "number — numéro d'itération" },
        { label: "parentData",  type: "variable",  detail: "object — données du bloc parent" },
    ],

    "PiMath": [
        { label: "Numeric",       type: "namespace", detail: "fonctions numériques" },
        { label: "Fraction",      type: "class",     detail: "new Fraction(num, den?)" },
        { label: "Root",          type: "class",     detail: "new Root(value, index?)" },
        { label: "Monom",         type: "class",     detail: "new Monom(expr?)" },
        { label: "Polynom",       type: "class",     detail: "new Polynom(expr?)" },
        { label: "Equation",      type: "class",     detail: "new Equation(expr?)" },
        { label: "Matrix",        type: "class",     detail: "new Matrix()" },
        { label: "LinearSystem",  type: "class",     detail: "new LinearSystem()" },
        { label: "Factor",        type: "class",     detail: "new Factor()" },
        { label: "PolyFactor",    type: "class",     detail: "new PolyFactor()" },
        { label: "LogicalSet",    type: "class",     detail: "new LogicalSet()" },
        { label: "Random",        type: "namespace", detail: "génération aléatoire" },
        { label: "Geometry",      type: "namespace", detail: "géométrie 2D / 3D" },
        { label: "NumExp",        type: "class",     detail: "expression numérique" },
    ],

    "PiMath.Random": [
        { label: "number",                    type: "function", detail: "(from: number, to: number, exclude?: number[]) → number" },
        { label: "numberSym",                 type: "function", detail: "(max: number, allowZero?: boolean) → number" },
        { label: "prime",                     type: "function", detail: "(max: number) → number" },
        { label: "bool",                      type: "function", detail: "(percent?: number) → boolean" },
        { label: "fraction",                  type: "function", detail: "(config?) → Fraction" },
        { label: "monom",                     type: "function", detail: "(config?) → Monom" },
        { label: "polynom",                   type: "function", detail: "(config?) → Polynom" },
        { label: "equation",                  type: "function", detail: "(config?) → Equation" },
        { label: "triplet",                   type: "function", detail: "(target: number, allowZero?: boolean) → [a, b, c] | null" },
        { label: "array",                     type: "function", detail: "<T>(arr: T[], n?: number) → T[]" },
        { label: "item",                      type: "function", detail: "<T>(arr: T[]) → T" },
        { label: "shuffle",                   type: "function", detail: "<T>(arr: T[]) → T[]" },
        { label: "point",                     type: "function", detail: "(config?) → Point" },
        { label: "vector",                    type: "function", detail: "(config?) → Point" },
        { label: "line",                      type: "function", detail: "(config?) → Line" },
        { label: "line3",                     type: "function", detail: "(config?) → Line3" },
        { label: "circle",                    type: "function", detail: "(config?) → Circle" },
    ],

    "PiMath.Numeric": [
        { label: "gcd",                          type: "function", detail: "(...values: number[]) → number" },
        { label: "lcm",                          type: "function", detail: "(...values: number[]) → number" },
        { label: "decompose",                    type: "function", detail: "(value: number) → number[][]" },
        { label: "dividers",                     type: "function", detail: "(value: number) → number[]" },
        { label: "divideNumbersByGCD",           type: "function", detail: "(...values: number[]) → number[]" },
        { label: "round",                        type: "function", detail: "(value: number, decimals?: number) → number" },
        { label: "numberCorrection",             type: "function", detail: "(value: number, digits?: number) → number" },
        { label: "periodic",                     type: "function", detail: "(value: number) → number" },
        { label: "primes",                       type: "function", detail: "(nb?: number) → number[]" },
        { label: "greatestPower",                type: "function", detail: "(value: number, index: number) → number" },
        { label: "pythagoreanTripletsWithTarget", type: "function", detail: "(target: number, targetIsSquare?: boolean) → [number, number, number][]" },
    ],

    "PiMath.Geometry": [
        { label: "Vector",    type: "class", detail: "new Vector(x, y)" },
        { label: "Point",     type: "class", detail: "new Point(x, y)" },
        { label: "Line",      type: "class", detail: "new Line()" },
        { label: "Triangle",  type: "class", detail: "new Triangle()" },
        { label: "Circle",    type: "class", detail: "new Circle()" },
        { label: "Line3",     type: "class", detail: "new Line3()" },
        { label: "Plane3",    type: "class", detail: "new Plane3()" },
        { label: "Sphere3",   type: "class", detail: "new Sphere3()" },
    ],

    "PiMathExt": [
        { label: "wrap",          type: "function",  detail: "(v: string | number) → string — entoure les négatifs de \\left( \\right)" },
        { label: "Radian",        type: "class",     detail: "gestion des angles en radians" },
        { label: "tripletTarget", type: "variable",  detail: "number[] — liste de cibles pour triplets pythagoriciens" },
        { label: "Random",        type: "namespace", detail: "extensions aléatoires" },
        { label: "TVM",           type: "class",     detail: "Time Value of Money — calculs financiers" },
    ],

    "PiMathExt.Random": [
        { label: "points", type: "function", detail: "(config?) → Point[] — génère des points non alignés" },
    ],
}

export function pimathCompletionSource(context: CompletionContext): CompletionResult | null {
    const word = context.matchBefore(/[\w.]+/)
    if (!word) return null

    const dotPos = word.text.lastIndexOf('.')
    const endsWithDot = dotPos === word.text.length - 1
    const prefix = dotPos >= 0 ? word.text.slice(0, dotPos) : ''
    const from = dotPos >= 0
        ? (endsWithDot ? word.to : word.from + dotPos + 1)
        : word.from

    const options = completionMap[prefix]
    if (!options) return null

    return { from, options, validFor: /^\w*$/ }
}