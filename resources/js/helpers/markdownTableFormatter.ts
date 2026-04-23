function isTableRow(line: string): boolean {
    return line.trim().startsWith('|') && line.includes('|', 1)
}

function isSeparatorRow(line: string): boolean {
    return isTableRow(line) && line.replace(/[\s|:\-]/g, '').length === 0 && /[-]/.test(line)
}

function parseRow(line: string): string[] {
    return line
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(cell => cell.trim())
}

function formatTable(lines: string[]): string {
    const rows = lines.map(parseRow)
    const colCount = Math.max(...rows.map(r => r.length))

    // Normalize column count
    const normalized = rows.map(r => {
        while (r.length < colCount) r.push('')
        return r
    })

    // Calculate max width per column
    const widths = Array.from({ length: colCount }, (_, i) =>
        Math.max(...normalized.map(r => r[i]?.length ?? 0), 3)
    )

    return normalized.map((row, rowIdx) => {
        const cells = row.map((cell, i) => {
            // Separator row: use dashes
            if (rowIdx === 1 && isSeparatorRow(lines[rowIdx])) {
                return '-'.repeat(widths[i])
            }
            return cell.padEnd(widths[i])
        })
        return `| ${cells.join(' | ')} |`
    }).join('\n')
}

export function formatMarkdownTables(text: string): string {
    const lines = text.split('\n')
    const result: string[] = []
    let i = 0

    while (i < lines.length) {
        // Detect start of a table: current line is a table row and next is a separator
        if (
            isTableRow(lines[i]) &&
            i + 1 < lines.length &&
            isSeparatorRow(lines[i + 1])
        ) {
            const tableLines: string[] = []
            while (i < lines.length && isTableRow(lines[i])) {
                tableLines.push(lines[i])
                i++
            }
            result.push(formatTable(tableLines))
        } else {
            result.push(lines[i])
            i++
        }
    }

    return result.join('\n')
}