/**
 * Générateur d'exercices "priorités des opérations" avec nombres relatifs.
 *
 * Principe : construire un arbre d'expression (AST) plutôt que composer des
 * chaînes de caractères. Cela garantit :
 *  - une évaluation exacte (pas de reparsing de l'asciimath généré)
 *  - un placement correct des parenthèses (via la précédence)
 *  - un contrôle local par opérateur (notamment pour la division, où le
 *    dividende doit être construit à partir du diviseur pour rester exact)
 *
 * S'appuie sur `Random` de PiMath (Random.number, Random.numberSym, Random.item).
 * Prévu pour vivre dans PiMathExt.ts et être appelé depuis le code d'un
 * générateur via `PiMathExt.generateOperationsPriorityExercise(level)`.
 */

import {Random} from "pimath"

// ===== Types =====

type BinaryOp = "+" | "-" | "*" | "/"

type ExprNode =
	| { kind: "num"; value: number }
	| { kind: "bin"; op: BinaryOp; left: ExprNode; right: ExprNode }

const PRECEDENCE: Record<BinaryOp, number> = {"+": 1, "-": 1, "*": 2, "/": 2}

// Symbole affiché pour chaque opérateur. `op` reste '+ - * /' partout ailleurs
// (evaluate, PRECEDENCE, associativité) — seul le rendu final passe par cette table.
const OP_SYMBOLS: Record<BinaryOp, string> = {
	"+": "+",
	"-": "-",
	"*": "\\cdot ",
	"/": "\\div "
}

export interface OperationsPriorityConfig {
	/** nombre d'opérations dans l'expression finale (≈ complexité) */
	operationsCount: number
	/** bornes des nombres générés (feuilles), hors division */
	numberRange: [number, number]
	/** poids relatifs des opérateurs — augmenter '/' et parenthèses avec le niveau */
	operatorWeights: Record<BinaryOp, number>
	/** proba qu'un noeud force des parenthèses (même si non requis par la précédence) */
	forcedParenProbability: number
	/** bornes du diviseur pour les divisions (garanties exactes) */
	divisorRange: [number, number]
}

// ===== Presets par niveau (à la place d'un seul paramètre "complexité") =====

const LEVEL_PRESETS: Record<number, OperationsPriorityConfig> = {
	1: {
		operationsCount: 2,
		numberRange: [1, 10],
		operatorWeights: {"+": 1, "-": 1, "*": 1, "/": 0},
		forcedParenProbability: 0,
		divisorRange: [2, 5]
	},
	2: {
		operationsCount: 3,
		numberRange: [-10, 10],
		operatorWeights: {"+": 1, "-": 1, "*": 1, "/": 0.5},
		forcedParenProbability: 0.2,
		divisorRange: [2, 6]
	},
	3: {
		operationsCount: 4,
		numberRange: [-12, 12],
		operatorWeights: {"+": 1, "-": 1, "*": 1.2, "/": 0.8},
		forcedParenProbability: 0.35,
		divisorRange: [2, 9]
	}
}

// Paliers : on ne définit un preset qu'aux niveaux où la difficulté change.
// Un niveau non défini utilise automatiquement le palier connu immédiatement
// inférieur (donc tout niveau ≥ 3 utilise le preset du niveau 3, sans qu'il
// soit nécessaire de définir 4, 5, 6...).
const LEVEL_TIERS = Object.keys(LEVEL_PRESETS)
	.map(Number)
	.sort((a, b) => a - b)

function getConfigForLevel(level: number): OperationsPriorityConfig {
	const tier = [...LEVEL_TIERS].reverse().find(t => t <= level) ?? LEVEL_TIERS[0]
	const base = LEVEL_PRESETS[tier]

	// Au-delà du dernier palier défini, on ne rejoue pas indéfiniment le même
	// preset : chaque niveau supplémentaire ajoute une opération, sans modifier
	// les autres paramètres (numberRange, poids, etc.) déjà calibrés.
	const extraLevels = level - tier
	if (extraLevels <= 0) return base

	return {...base, operationsCount: base.operationsCount + extraLevels}
}

function pickWeighted(weights: Record<BinaryOp, number>): BinaryOp {
	const entries = Object.entries(weights) as [BinaryOp, number][]
	const total = entries.reduce((s, [, w]) => s + w, 0)
	let r = Math.random() * total
	for (const [op, w] of entries) {
		if (r < w) return op
		r -= w
	}
	return entries[entries.length - 1][0]
}

function generateLeaf(cfg: OperationsPriorityConfig): ExprNode {
	// Random.numberSym(max, allowZero) génère un nombre relatif symétrique.
	// On rejette 0, 1, -1 : ils ne testent rien du tout ici.
	let value: number
	do {
		value = Random.numberSym(cfg.numberRange[1], false)
	} while ([0, 1, -1].includes(value))
	return {kind: "num", value}
}

function generateDivision(rightOps: number, cfg: OperationsPriorityConfig): ExprNode {
	const right = generateNode(rightOps, cfg)
	const divisorValue = evaluate(right)

	if (divisorValue === 0) return generateDivision(rightOps, cfg)

	// On force le dividende à être un multiple exact du diviseur.
	let quotient: number
	do {
		quotient = Random.numberSym(cfg.numberRange[1], false)
	} while (quotient === 0)

	const left: ExprNode = {kind: "num", value: divisorValue * quotient}
	return {kind: "bin", op: "/", left, right}
}

function generateNode(remainingOps: number, cfg: OperationsPriorityConfig): ExprNode {
	if (remainingOps <= 0) return generateLeaf(cfg)

	const op = pickWeighted(cfg.operatorWeights)
	const leftOps = Random.number(0, remainingOps - 1)
	const rightOps = remainingOps - 1 - leftOps

	if (op === "/") return generateDivision(rightOps, cfg)

	const left = generateNode(leftOps, cfg)
	const right = generateNode(rightOps, cfg)
	return {kind: "bin", op, left, right}
}

// ===== Évaluation (parcours d'arbre, pas de reparsing) =====

function evaluate(node: ExprNode): number {
	if (node.kind === "num") return node.value
	const l = evaluate(node.left)
	const r = evaluate(node.right)
	switch (node.op) {
		case "+":
			return l + r
		case "-":
			return l - r
		case "*":
			return l * r
		case "/":
			return l / r
	}
}

// ===== Rendu LaTeX (parenthèses gérées par précédence + associativité) =====

function renderNode(node: ExprNode, parentPrec: number, isRightChild: boolean): string {
	if (node.kind === "num") {
		return node.value < 0 ? `(${node.value})` : `${node.value}`
	}

	const prec = PRECEDENCE[node.op]
	const left = renderNode(node.left, prec, false)
	const right = renderNode(node.right, prec, true)
	const inner = `${left}${OP_SYMBOLS[node.op]}${right}`

	// Parenthèses requises par la précédence / l'associativité à gauche de - et /
	const needsParens =
		prec < parentPrec ||
		(prec === parentPrec && isRightChild && (node.op === "-" || node.op === "/"))

	return needsParens ? `(${inner})` : inner
}

function render(node: ExprNode): string {
	return renderNode(node, 0, false)
}

// ===== Point d'entrée : generate-and-test (comme dans etude-de-fonction-rationnelle.vue) =====

export function generateOperationsPriorityExercise(level: number, maxAttempts = 200) {
	const cfg = getConfigForLevel(level)

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		const tree = generateNode(cfg.operationsCount, cfg)
		const answer = evaluate(tree)

		// Filtres "qualité pédagogique" plutôt que contraintes dans la génération :
		if (!Number.isInteger(answer)) continue          // sécurité, malgré la division exacte
		if (Math.abs(answer) > cfg.numberRange[1] * 10) continue  // résultat déraisonnable
		if (Math.abs(answer) <= 1 && cfg.operationsCount > 2) continue // trop trivial

		return {
			question: render(tree),
			answer: answer.toString()
		}
	}

	throw new Error("Impossible de générer un exercice satisfaisant après plusieurs tentatives")
}
