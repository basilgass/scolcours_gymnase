import {StreamLanguage} from "@codemirror/language"
import {ViewPlugin, DecorationSet, Decoration, EditorView} from "@codemirror/view"
import type {ViewUpdate} from "@codemirror/view"
import {RangeSetBuilder} from "@codemirror/state"
import type {Extension} from "@codemirror/state"
import type {Completion, CompletionContext, CompletionResult} from "@codemirror/autocomplete"

// ── DSL figure keywords ──

const dslKeywordCompletions: Completion[] = [
    {label: 'pt',          type: 'keyword', detail: 'A=pt x,y'},
    {label: 'mid',         type: 'keyword', detail: 'M=mid A,B — milieu'},
    {label: 'proj',        type: 'keyword', detail: 'H=proj A,d — projection'},
    {label: 'inter',       type: 'keyword', detail: 'P=inter d1,d2 — intersection'},
    {label: 'sym',         type: 'keyword', detail: "A2=sym A,B — symétrie"},
    {label: 'dpt',         type: 'keyword', detail: 'P=dpt A,d,dist — point directionnel'},
    {label: 'vpt',         type: 'keyword', detail: 'P=vpt A,B,scale — point vecteur'},
    {label: 'eval',        type: 'keyword', detail: 'P=eval f,x — évaluation'},
    {label: 'line',        type: 'keyword', detail: 'd=AB — droite'},
    {label: 'vec',         type: 'keyword', detail: 'v=vAB — vecteur'},
    {label: 'seg',         type: 'keyword', detail: 's=AB. — segment'},
    {label: 'ray',         type: 'keyword', detail: 'r=AB[ — demi-droite'},
    {label: 'perp',        type: 'keyword', detail: 'p=perp d,A — perpendiculaire'},
    {label: 'para',        type: 'keyword', detail: 'p=para d,A — parallèle'},
    {label: 'med',         type: 'keyword', detail: 'm=med A,B — médiatrice'},
    {label: 'tan',         type: 'keyword', detail: 't=tan f,A — tangente'},
    {label: 'bis',         type: 'keyword', detail: 'b=bis d1,d2 — bissectrice'},
    {label: 'circ',        type: 'keyword', detail: 'c=circ O,r — cercle'},
    {label: 'arc',         type: 'keyword', detail: 'a=arc P,C,Q — arc'},
    {label: 'poly',        type: 'keyword', detail: 'p=poly A,B,C — polygone'},
    {label: 'reg',         type: 'keyword', detail: 'p=reg O,r,n — polygone régulier'},
    {label: 'follow',      type: 'keyword', detail: 't=follow f — point suiveur'},
    {label: 'fill',        type: 'keyword', detail: 'z=fill f,g,dom — aire entre courbes'},
    {label: 'riemann',     type: 'keyword', detail: 'r=riemann f,dom,n,pos'},
    {label: 'plot',        type: 'keyword', detail: 'f=plot expr — courbe'},
    {label: 'parametric',  type: 'keyword', detail: 'f=parametric x,y — paramétrique'},
    {label: 'quad',        type: 'keyword', detail: 'f=quad A,B,C — parabole'},
    {label: 'bezier',      type: 'keyword', detail: 'b=bezier A,B,C,D — bézier'},
]

const DSL_KEYWORD_SET = new Set(dslKeywordCompletions.map(c => c.label))

// ── Layout parameter keywords ──

const paramKeywordCompletions: Completion[] = [
    {label: 'x',         type: 'keyword', detail: 'x=-5:5 — domaine X'},
    {label: 'y',         type: 'keyword', detail: 'y=-5:5 — domaine Y'},
    {label: 'ppu',       type: 'keyword', detail: 'ppu=50 — pixels/unité'},
    {label: 'unitX',     type: 'keyword', detail: 'unitX=2 — échelle X'},
    {label: 'unitY',     type: 'keyword', detail: 'unitY=2 — échelle Y'},
    {label: 'grid',      type: 'keyword', detail: 'afficher la grille'},
    {label: 'axis',      type: 'keyword', detail: 'afficher les axes'},
    {label: 'subgrid',   type: 'keyword', detail: 'subgrid=4 — sous-grille'},
    {label: 'label',     type: 'keyword', detail: 'labels texte sur les axes'},
    {label: 'tex',       type: 'keyword', detail: 'labels TeX sur les axes'},
    {label: 'points',    type: 'keyword', detail: 'points=o|*|s — style des points'},
    {label: 'no-points', type: 'keyword', detail: 'cacher tous les points'},
]

const PARAM_KEYWORD_SET = new Set(paramKeywordCompletions.map(c => c.label))

// ── Colors ──

const COLOR_NAMES = [
    'black', 'white', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow',
    'gray', 'grey', 'darkgray', 'darkgrey', 'lightgray', 'lightgrey',
    'brown', 'lime', 'olive', 'orange', 'pink', 'purple', 'teal', 'gold',
] as const

const COLOR_SET = new Set<string>(COLOR_NAMES)
const colorCompletions: Completion[] = COLOR_NAMES.map(c => ({label: c, type: 'constant' as const}))

// ── Option keywords ──

const OPTION_KEYWORD_SET = new Set([
    'w', 'color', 'fill', 'dash', 'dot', 'mark', 'hide', 'static',
    'drag', 'tex', 'label', 'move', 'scale', 'animate', 'from', 'to',
    'duration', 'delay', 'easing', 'loop', 'sector', 'square', 'acute',
    'ultrathin', 'thin', 'thick', 'ultrathick',
])

const optionCompletions: Completion[] = [
    {label: 'w',           type: 'keyword', detail: 'épaisseur: w=3'},
    {label: 'color',       type: 'keyword', detail: 'couleur: color=red/0.5'},
    {label: 'fill',        type: 'keyword', detail: 'remplissage: fill=blue/0.3'},
    {label: 'dash',        type: 'keyword', detail: 'pointillés'},
    {label: 'dot',         type: 'keyword', detail: 'points'},
    {label: 'mark',        type: 'keyword', detail: 'marqueurs aux extrémités'},
    {label: 'hide',        type: 'keyword', detail: 'cache figure et label'},
    {label: 'static',      type: 'keyword', detail: 'figure statique'},
    {label: 'drag',        type: 'keyword', detail: 'drag=grid|Ox|Oy|<fig>'},
    {label: 'tex',         type: 'keyword', detail: 'tex=A/br/0;-0.5'},
    {label: 'label',       type: 'keyword', detail: 'label=A/br'},
    {label: 'move',        type: 'keyword', detail: 'move=1;2'},
    {label: 'scale',       type: 'keyword', detail: 'scale=2;1'},
    {label: 'animate',     type: 'keyword', detail: 'animation'},
    {label: 'from',        type: 'keyword', detail: 'from=A — début animation'},
    {label: 'to',          type: 'keyword', detail: 'to=B — fin animation'},
    {label: 'duration',    type: 'keyword', detail: 'duration=3 — durée (s)'},
    {label: 'delay',       type: 'keyword', detail: 'delay=1 — délai (s)'},
    {label: 'easing',      type: 'keyword', detail: 'easing=linear|in|out|inOut'},
    {label: 'loop',        type: 'keyword', detail: 'loop=reverse'},
    {label: 'sector',      type: 'keyword', detail: 'secteur rempli (arc)'},
    {label: 'square',      type: 'keyword', detail: 'angle droit (arc)'},
    {label: 'acute',       type: 'keyword', detail: 'angle aigu (arc)'},
    {label: 'ultrathin',   type: 'keyword', detail: 'trait 0.5'},
    {label: 'thin',        type: 'keyword', detail: 'trait 0.75'},
    {label: 'thick',       type: 'keyword', detail: 'trait 2.5'},
    {label: 'ultrathick',  type: 'keyword', detail: 'trait 4'},
    {label: '!',           type: 'keyword', detail: 'cache figure, garde label'},
    {label: '?',           type: 'keyword', detail: 'cache label, garde figure'},
    {label: 'o',           type: 'keyword', detail: 'forme cercle'},
    {label: 's',           type: 'keyword', detail: 'forme carré'},
    {label: '*',           type: 'keyword', detail: 'forme croix'},
    ...colorCompletions,
]

// ── Autocomplete: code ──

function pidrawCompletionSource(context: CompletionContext): CompletionResult | null {
    const line = context.state.doc.lineAt(context.pos)
    const lineText = line.text.slice(0, context.pos - line.from)
    const trimmed = lineText.trimStart()

    if (/^[%$@]/.test(trimmed)) return null

    // Block autocomplete in the name position (before first = or ()
    const eqIdx = lineText.indexOf('=')
    const parenIdx = lineText.indexOf('(')
    const firstDelim = Math.min(
        eqIdx >= 0 ? eqIdx : Infinity,
        parenIdx >= 0 ? parenIdx : Infinity,
    )
    if (firstDelim === Infinity || context.pos - line.from <= firstDelim) return null

    const arrowIdx = lineText.indexOf('->')

    if (arrowIdx >= 0 && context.pos - line.from > arrowIdx + 1) {
        const afterArrow = lineText.slice(arrowIdx + 2)
        const lastCommaIdx = afterArrow.lastIndexOf(',')
        const currentSegment = afterArrow.slice(lastCommaIdx + 1)

        if (/drag=$/.test(currentSegment)) {
            return {
                from: context.pos,
                options: [
                    {label: 'grid', type: 'keyword'},
                    {label: 'Ox',   type: 'keyword'},
                    {label: 'Oy',   type: 'keyword'},
                ],
            }
        }
        if (/(?:color|fill)=$/.test(currentSegment)) {
            return {from: context.pos, options: colorCompletions}
        }
        if (/easing=$/.test(currentSegment)) {
            return {
                from: context.pos,
                options: ['linear', 'in', 'out', 'inOut'].map(l => ({label: l, type: 'keyword' as const})),
            }
        }
        if (/loop=$/.test(currentSegment)) {
            return {from: context.pos, options: [{label: 'reverse', type: 'keyword' as const}]}
        }
        if (/points=$/.test(currentSegment)) {
            return {
                from: context.pos,
                options: [
                    {label: 'o', type: 'keyword' as const, detail: 'cercle'},
                    {label: '*', type: 'keyword' as const, detail: 'croix'},
                    {label: 's', type: 'keyword' as const, detail: 'carré'},
                ],
            }
        }

        const word = context.matchBefore(/[a-zA-Z][a-zA-Z0-9-]*/)
        if (word || context.explicit) {
            return {
                from: word ? word.from : context.pos,
                options: optionCompletions,
                validFor: /^[a-zA-Z0-9-]*$/,
            }
        }
        return null
    }

    const word = context.matchBefore(/[a-z][a-zA-Z0-9-]*/)
    if (word || context.explicit) {
        return {
            from: word ? word.from : context.pos,
            options: [...dslKeywordCompletions, ...paramKeywordCompletions],
            validFor: /^[a-zA-Z0-9-]*$/,
        }
    }
    return null
}

// ── Autocomplete: params only ──

function pidrawParamsCompletionSource(context: CompletionContext): CompletionResult | null {
    const word = context.matchBefore(/[a-zA-Z][a-zA-Z0-9-]*/)
    if (word || context.explicit) {
        return {
            from: word ? word.from : context.pos,
            options: paramKeywordCompletions,
            validFor: /^[a-zA-Z0-9-]*$/,
        }
    }
    return null
}

// ── Stream parser state ──

interface PidrawState {
    inOptions: boolean
}

// ── Token function (shared) ──

function pidrawToken(stream: any, state: PidrawState): string | null {
    if (stream.sol()) {
        state.inOptions = false
        const peek = stream.peek()
        if (peek === '$' || peek === '%') {stream.skipToEnd(); return 'comment'}
        if (peek === '@') {stream.skipToEnd(); return 'meta'}
    }

    if (stream.eatSpace()) return null

    if (stream.match('->')) {
        state.inOptions = true
        return 'operator'
    }

    if (state.inOptions) {
        if (stream.match(/^[!?#]/)) return 'atom'
        if (stream.match(/^-?[0-9]+(\.[0-9]+)?/)) return 'number'
        if (stream.match(/^[=,\/;:]/)) return 'operator'

        const optWord = stream.match(/^[a-zA-Z][a-zA-Z0-9-]*/)
        if (optWord) {
            const w = (optWord as RegExpMatchArray)[0]
            if (COLOR_SET.has(w)) return 'string'
            if (OPTION_KEYWORD_SET.has(w)) return 'keyword'
            return 'variableName'
        }

        if (stream.match(/^[*os]/)) return 'atom'
        stream.next()
        return null
    }

    // Definition / params section
    if (stream.match(/^-?[0-9]+(\.[0-9]+)?/)) return 'number'
    if (stream.match(/^[=,.()\[\]:;\/+\-*^]/)) return 'operator'

    // Uppercase = point name (shown bold via ViewPlugin)
    if (stream.match(/^[A-Z][0-9]*/)) return 'def'

    const defWord = stream.match(/^[a-z][a-zA-Z0-9-]*/)
    if (defWord) {
        const w = (defWord as RegExpMatchArray)[0]
        if (DSL_KEYWORD_SET.has(w)) return 'keyword'
        if (PARAM_KEYWORD_SET.has(w)) return 'keyword'
        return 'variableName'
    }

    stream.next()
    return null
}

// ── Language factory ──

function makePidrawLanguage(autocomplete: (ctx: CompletionContext) => CompletionResult | null) {
    return StreamLanguage.define<PidrawState>({
        name: 'pidraw',
        startState: () => ({inOptions: false}),
        token: pidrawToken,
        languageData: {autocomplete},
    })
}

export const pidrawLanguage = makePidrawLanguage(pidrawCompletionSource)
export const pidrawParamsLanguage = makePidrawLanguage(pidrawParamsCompletionSource)

// ── Decorations: defs (bold), dups (red), refs (blue background) ──

type DecoType = 'def' | 'dup' | 'ref'

function buildDecorations(view: EditorView): DecorationSet {
    const doc = view.state.doc

    // Step 1: collect all definition names with their character ranges
    const defs = new Map<string, {from: number, to: number}[]>()

    for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i)
        const text = line.text
        const trimmed = text.trimStart()
        if (!trimmed || /^[%$@]/.test(trimmed)) continue

        const m = /^([A-Za-z][A-Za-z0-9]*)(?=[=(])/.exec(trimmed)
        if (!m) continue

        const name = m[1]
        const indent = text.length - trimmed.length
        const from = line.from + indent
        const to = from + name.length

        const arr = defs.get(name) ?? []
        arr.push({from, to})
        defs.set(name, arr)
    }

    const uppercaseNames = new Set([...defs.keys()].filter(n => /^[A-Z]/.test(n)))
    const lowercaseNames = new Set([...defs.keys()].filter(n => /^[a-z]/.test(n)))

    const ranges: {from: number, to: number, type: DecoType}[] = []

    // Step 2: mark all defs (bold) and dups (red)
    for (const [, positions] of defs) {
        const isDup = positions.length > 1
        for (const {from, to} of positions) {
            ranges.push({from, to, type: isDup ? 'dup' : 'def'})
        }
    }

    // Step 3: find references
    for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i)
        const text = line.text
        if (!text.trim()) continue
        const trimmed = text.trimStart()
        if (/^[%$@]/.test(trimmed)) continue

        const indent = text.length - trimmed.length
        const nameMatch = /^([A-Za-z][A-Za-z0-9]*)(?=[=(])/.exec(trimmed)
        const defFrom = nameMatch != null ? line.from + indent : -1

        const arrowIdx = text.indexOf('->')
        const beforeArrow = arrowIdx >= 0 ? text.slice(0, arrowIdx) : text
        const eqIdx = beforeArrow.indexOf('=')
        if (eqIdx < 0) continue

        // f(x)= or f(t)= → math expression line
        const isMathLine = /^[A-Za-z][A-Za-z0-9]*\([xt]\)\s*=/.test(trimmed)

        if (isMathLine) {
            // Only name.x / name.y patterns count as references
            const exprStr = beforeArrow.slice(eqIdx + 1)
            const exprStart = line.from + eqIdx + 1
            const dotPat = /([A-Za-z][A-Za-z0-9]*)\.[xy]/g
            let m
            while ((m = dotPat.exec(exprStr)) !== null) {
                const name = m[1]
                if (!defs.has(name)) continue
                const refFrom = exprStart + m.index
                if (refFrom !== defFrom) ranges.push({from: refFrom, to: refFrom + name.length, type: 'ref'})
            }
        } else {
            // Keyword or shorthand: scan params section (between = and ->)
            const afterEq = beforeArrow.slice(eqIdx + 1)
            const afterEqStart = line.from + eqIdx + 1

            // Skip leading DSL keyword (e.g. "perp ", "circ ")
            const kwMatch = /^([a-z]+)\s+/.exec(afterEq)
            const paramsStr = kwMatch ? afterEq.slice(kwMatch[0].length) : afterEq
            const paramsStart = afterEqStart + (kwMatch ? kwMatch[0].length : 0)

            // Uppercase references: [A-Z][0-9]* (greedy per name, handles AB → A + B)
            const upperPat = /[A-Z][0-9]*/g
            let mu
            while ((mu = upperPat.exec(paramsStr)) !== null) {
                const name = mu[0]
                if (!name || !uppercaseNames.has(name)) continue
                const refFrom = paramsStart + mu.index
                if (refFrom !== defFrom) ranges.push({from: refFrom, to: refFrom + name.length, type: 'ref'})
            }

            // Lowercase references: comma-separated tokens matched against known names
            const tokens = paramsStr.split(',')
            let offset = 0
            for (const token of tokens) {
                const trimmedToken = token.trim()
                const tokenIndent = token.indexOf(trimmedToken)

                if (trimmedToken && lowercaseNames.has(trimmedToken)) {
                    const refFrom = paramsStart + offset + tokenIndent
                    if (refFrom !== defFrom) {
                        ranges.push({from: refFrom, to: refFrom + trimmedToken.length, type: 'ref'})
                    }
                }

                // name.x / name.y within token
                const dotPat = /([a-z][a-zA-Z0-9]*)\.[xy]/g
                let md
                while ((md = dotPat.exec(token)) !== null) {
                    const name = md[1]
                    if (!lowercaseNames.has(name)) continue
                    const refFrom = paramsStart + offset + md.index
                    if (refFrom !== defFrom) {
                        ranges.push({from: refFrom, to: refFrom + name.length, type: 'ref'})
                    }
                }

                offset += token.length + 1 // +1 for ','
            }
        }
    }

    // Sort by position; on ties, priority: dup > ref > def
    const priority: Record<DecoType, number> = {dup: 0, ref: 1, def: 2}
    ranges.sort((a, b) => a.from !== b.from ? a.from - b.from : priority[a.type] - priority[b.type])

    const defDeco = Decoration.mark({class: 'cm-pidraw-def'})
    const dupDeco = Decoration.mark({class: 'cm-pidraw-dup'})
    const refDeco = Decoration.mark({class: 'cm-pidraw-ref'})

    const builder = new RangeSetBuilder<Decoration>()
    let lastTo = -1
    for (const {from, to, type} of ranges) {
        if (from >= lastTo && from < to) {
            builder.add(from, to, type === 'dup' ? dupDeco : type === 'def' ? defDeco : refDeco)
            lastTo = to
        }
    }

    return builder.finish()
}

const pidrawDecoPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet
        constructor(view: EditorView) {
            this.decorations = buildDecorations(view)
        }
        update(update: ViewUpdate) {
            if (update.docChanged) this.decorations = buildDecorations(update.view)
        }
    },
    {decorations: v => v.decorations},
)

const pidrawTheme = EditorView.theme({
    '& .cm-pidraw-def': {fontWeight: 'bold'},
    '& .cm-pidraw-dup': {color: '#dc2626', fontWeight: 'bold'},
    '& .cm-pidraw-ref': {backgroundColor: '#dbeafe', borderRadius: '2px', padding: '0 1px'},
})

export const pidrawExtensions: Extension[] = [pidrawLanguage, pidrawDecoPlugin, pidrawTheme]