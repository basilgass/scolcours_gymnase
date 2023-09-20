import {text} from "@formkit/inputs";

text.props = ['sm']

text.features = [
	(node) => {
        node.props.outerClass = (reactiveNode) => ({
            'input-is-small !mb-2': reactiveNode.props.hasOwnProperty("sm")
        })
        node.props.inputClass = (reactiveNode) => ({
                'text-xs !py-1': reactiveNode.props.hasOwnProperty("sm")
            }
        )
        node.props.labelClass = (reactiveNode) => ({
            '!text-base !bottom-[Calc(100%)]': reactiveNode.props.hasOwnProperty("sm")
        })
	}
]

export default text
