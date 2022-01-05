import katex from 'katex/dist/katex.mjs'
import AsciiMathParser from 'asciimath2tex'

function katexUpdate (el, binding, vnode) {
	if (binding.value.length === 0) {
		el.innerHTML = ''
	} else {
		const tex = binding.modifiers.ascii ? new AsciiMathParser().parse(binding.value) : binding.value
		if (binding.modifiers.left) {el.classList.add('katex-left')}
		if (binding.modifiers.nomargin) {el.classList.add('katex-m-0')}
		
		el.innerHTML = katex.renderToString(
			(binding.modifiers.display ? '\\displaystyle ' : '') + tex,
			{
				throwOnError: false,
				displayMode: !binding.modifiers.inline
			})
	}
}
export const katexDirective = {
	mounted (el, binding, vnode) {
		katexUpdate(el, binding, vnode)
	},
	updated (el, binding, vnode) {
		katexUpdate(el, binding, vnode)
	},
	unmounted(el){
		el.innerHTML = ''
	}
}
