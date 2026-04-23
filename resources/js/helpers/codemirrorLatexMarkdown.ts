import { parseMixed, type Parser } from '@lezer/common'
import { tags } from '@lezer/highlight'
import { type DelimiterType, InlineContext, type MarkdownConfig, type NodeSpec } from '@lezer/markdown'

const INLINE_MATH_DOLLAR = 'InlineMathDollar'
const INLINE_MATH_BRACKET = 'InlineMathBracket'
const BLOCK_MATH_DOLLAR = 'BlockMathDollar'
const BLOCK_MATH_BRACKET = 'BlockMathBracket'

const DELIMITER_LENGTH: Record<string, number> = {
    [INLINE_MATH_DOLLAR]: 1,
    [INLINE_MATH_BRACKET]: 2,
    [BLOCK_MATH_DOLLAR]: 2,
    [BLOCK_MATH_BRACKET]: 2,
}

const DELIMITERS = Object.keys(DELIMITER_LENGTH).reduce<Record<string, DelimiterType>>((agg, name) => {
    agg[name] = { mark: `${name}Mark`, resolve: name }
    return agg
}, {})

export function parseMathMarkdown(latexParser?: Parser): MarkdownConfig {
    const defineNodes: NodeSpec[] = []
    Object.keys(DELIMITER_LENGTH).forEach(name => {
        defineNodes.push(
            { name, style: tags.emphasis },
            { name: `${name}Mark`, style: tags.processingInstruction },
        )
    })

    return {
        defineNodes,
        parseInline: [
            {
                name: BLOCK_MATH_DOLLAR,
                parse(cx: InlineContext, next: number, pos: number): number {
                    if (next !== 36 /* $ */ || cx.char(pos + 1) !== 36) return -1
                    return cx.addDelimiter(DELIMITERS[BLOCK_MATH_DOLLAR], pos, pos + 2, true, true)
                },
            },
            {
                name: INLINE_MATH_DOLLAR,
                parse(cx: InlineContext, next: number, pos: number): number {
                    if (next !== 36 /* $ */ || cx.char(pos + 1) === 36) return -1
                    return cx.addDelimiter(DELIMITERS[INLINE_MATH_DOLLAR], pos, pos + 1, true, true)
                },
            },
            {
                name: INLINE_MATH_BRACKET,
                before: 'Escape',
                parse(cx: InlineContext, next: number, pos: number): number {
                    if (next !== 92 /* \ */ || ![40, 41].includes(cx.char(pos + 1))) return -1
                    return cx.addDelimiter(DELIMITERS[INLINE_MATH_BRACKET], pos, pos + 2, cx.char(pos + 1) === 40, cx.char(pos + 1) === 41)
                },
            },
            {
                name: BLOCK_MATH_BRACKET,
                before: 'Escape',
                parse(cx: InlineContext, next: number, pos: number): number {
                    if (next !== 92 /* \ */ || ![91, 93].includes(cx.char(pos + 1))) return -1
                    return cx.addDelimiter(DELIMITERS[BLOCK_MATH_BRACKET], pos, pos + 2, cx.char(pos + 1) === 91, cx.char(pos + 1) === 93)
                },
            },
        ],
        wrap: latexParser
            ? parseMixed((node) => {
                const delimLen = DELIMITER_LENGTH[node.type.name]
                if (!delimLen) return null
                return {
                    parser: latexParser,
                    overlay: [{ from: node.from + delimLen, to: node.to - delimLen }],
                }
            })
            : undefined,
    }
}