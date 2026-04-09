const fs = require('fs')
const path = require('path')

const BASE = 'C:/websites/scolcours_gymnase/resources/js'

const TYPE_TO_COMPONENT = {
  'switch': 'FormSwitch',
  'codearea': 'FormCodearea',
  'textarea': 'FormTextarea',
  'select': 'FormSelect',
  'chapter': 'FormChapter',
  'json': 'FormJson',
  'keyboard': 'FormKeyboard',
  'search': 'FormSearch',
  'theme': 'FormTheme',
  'team': 'FormTeam',
  'deck': 'FormDeck',
  'fraction': 'FormFraction',
  'vector': 'FormVector',
}

function findVueFiles(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...findVueFiles(fullPath))
    else if (entry.name.endsWith('.vue')) files.push(fullPath)
  }
  return files
}

const allFiles = findVueFiles(BASE).filter(f => !f.includes('FormElements'))

let totalFixed = 0

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content
  const addImports = new Set()

  for (const [type, comp] of Object.entries(TYPE_TO_COMPONENT)) {
    // Build regex: <FormInput followed by attrs without >, then type="xxx" without >, then more attrs without >
    // [^>] matches any char including \n except >
    const re = new RegExp('<FormInput([^>]*?)\\s+type=["\']' + type + '["\']([^>]*?)(?=\\s*(?:>|/>))', 'g')

    if (re.test(content)) {
      addImports.add(comp)
      content = content.replace(
        new RegExp('<FormInput([^>]*?)\\s+type=["\']' + type + '["\']([^>]*?)(?=\\s*(?:>|/>))', 'g'),
        function(match, before, after) {
          return '<' + comp + before + after
        }
      )

      // Fix closing </FormInput> → </FormComp> when it belongs to this component
      var openRe = new RegExp('<' + comp + '\\b', 'g')
      var openMatch
      while ((openMatch = openRe.exec(content)) !== null) {
        var tagStart = openMatch.index
        var tagEnd = content.indexOf('>', tagStart)
        if (tagEnd === -1) continue
        if (content[tagEnd - 1] === '/') continue // self-closing

        var closeIndex = content.indexOf('</FormInput>', tagEnd)
        if (closeIndex === -1) continue

        var between = content.substring(tagEnd + 1, closeIndex)
        if (!between.includes('<FormInput')) {
          content = content.substring(0, closeIndex) +
                   '</' + comp + '>' +
                   content.substring(closeIndex + '</FormInput>'.length)
          openRe.lastIndex = tagStart + 1
        }
      }
    }
  }

  if (content !== original) {
    // Add missing imports
    for (const comp of addImports) {
      if (!content.includes('import ' + comp + ' from')) {
        content = content.replace(
          'import FormInput from "@/Components/Form/FormInput.vue"',
          'import FormInput from "@/Components/Form/FormInput.vue"\nimport ' + comp + ' from "@/Components/Form/' + comp + '.vue"'
        )
      }
    }

    fs.writeFileSync(filePath, content)
    totalFixed++
    console.log('OK ' + path.relative(BASE, filePath) + ' [' + [...addImports].join(', ') + ']')
  }
}

console.log('\nTotal: ' + totalFixed)
