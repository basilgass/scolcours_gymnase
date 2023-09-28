<template>
	<div>
		<h3
				v-katex.auto="step?.title"
				class="font-semibold"
		/>
		<markdown-it :text="step.body"/>
		<div class="flex justify-between">
			<button
					v-theme.btn
					:class="stepIndex===0?'invisible':''"
					@click="stepIndex--"
			>
				<i class="bi bi-chevron-left mr-3 -ml-2"/>précédant
			</button>

			<button
					v-theme.btn
					:class="stepIndex===steps.length-1?'invisible':''"
					@click="stepIndex++"
			>
				<span v-katex.auto="nextStep?.title"/>
				<i class="bi bi-chevron-right ml-3 -mr-2"/>
			</button>
		</div>
	</div>
</template>
<!--<info>
parameters: ???

code: texte séparé par %STEP
</info>-->


<script lang="ts" setup>
import {computed, ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

let props = defineProps({
    illustration: {type: Object, required: true}
})

// code are the various steps.
/*
%STEP
@keyboard
   Qcm
   keyboard parameters
the question as markdown with math katex enabled
*/

interface stepInterface {
    title: string,
    body: string,
    slides: number[]
}

function makeStepsFromCode(value: string): stepInterface[] {
    let stepsResult = []

    const codeSteps = value.split(/%STEP/).filter(s => s !== "")

    codeSteps.forEach((body, index) => {
        let title = ""
        body = body.trim()
        if (body.startsWith(":")) {
            // Il y a un titre
            let lines = body.split("\n")
            title = lines.shift().substring(1).trim()
            body = lines.join("\n")
        } else {
            title = `étape ${index} sur ${codeSteps.length}`
        }

        stepsResult.push({
            title,
            body,
            slides: [index + 1]
        })
    })

    return stepsResult
}

function makeStepsFromEquation(value: string): stepInterface[] {
    /**
     \begin{aligned}
     @<:titre;>first line &= @<3:titre> second step //
      \end{aligned}
     */

    const regex = /(\\begin{aligned}((.|\n|\r)*)\\end{aligned})/s;
    let match = value.match(regex),
        content: stepInterface[],
        before: string, after: string

    if (match !== null) {
        before = value.substring(0, value.indexOf(match[0])).trim();
        content = processContent(match[1].replace("\\begin{aligned}", "").replace("\\end{aligned}", ""))
        after = value.substring(value.indexOf(match[0]) + match[0].length).trim()
    } else {
        return [{
            title: " ? ",
            body: value,
            slides: [1]
        }]
    }

    // Build and merge
    let steps: stepInterface[] = []

    for (let slideNb = 0; slideNb < content.length; slideNb++) {
        steps.push({
            title: content[slideNb].title,
            slides: content[slideNb].slides,
            body: before + "\\begin{aligned}" +
                content.map(step => {
                    return step.slides.includes(slideNb) ?
                        step.body :
                        transformBody(step.body)
                }).join("") +
                "\\end{aligned}" + after
        })
    }

    if (steps.length === 0) {
        return [{
            title: " ? ",
            slides: [1],
            body: value
        }]
    }
    return steps

}

function processContent(str) {
    // let regex = /@<((\d+|-|,)*):([^>]*?)>((?:[^@]|@(?![<]))*?)/gs;
    let regex = /@<((\d+|-|,)*):([^>]*?)>((?:[^@]|@(?!<))*)/gs;

    let initialString = str.substring(0, str.indexOf('@<')).trim(),
        restOfString = str.substring(str.indexOf('@<'))

    let maxNumber = str.split('@<').length - 1
    let match;
    let result = initialString !== "" ? [{title: "", body: initialString, slides: generateSlidesNumber(0, maxNumber)}] : [];
    let slideNumber = result.length

    while
        ((match = regex.exec(restOfString)) !== null) {
        let slides = [];
        if (match[1]) {
            let slideParts = match[1].split(',');
            for (let part of slideParts) {
                if (part.includes('-')) {
                    let range = part.split('-');
                    for (let i = parseInt(range[0]); i <= parseInt(range[1]); i++) {
                        slides.push(i);
                    }
                } else {
                    slides.push(parseInt(part));
                }
            }
        } else {
            slides = generateSlidesNumber(slideNumber, maxNumber)
        }

        let part = {
            title: match[3],
            slides,
            body: match[4].trim()
        };
        result.push(part);

        slideNumber++
    }
    return result;
}

function generateSlidesNumber(start, end) {
    return Array.from({length: end - start + 1}, (_, i) => start + i)
}

function transformBody(str) {
    let result = str.split(/(&|\\\\)/g).map((part) => {
        return ['&', '\\\\'].includes(part) ? part : `\\phantom{ ${part} }`;
    });
    return result.join('');
}

let auto = computed(() => {
        const values = props.illustration.parameters.split(',')
        return values.includes('equ')
    }),
    steps = computed(() => {
        if (auto.value) {
            return makeStepsFromEquation(props.illustration.code)
        }
        return makeStepsFromCode(props.illustration.code)
    }),
    stepIndex = ref(0),
    step = computed(() => {
        return steps.value[stepIndex.value]
    }),
    prevStep = computed(() => {
        if (stepIndex.value === 0) {
            return null
        }
        return steps.value[stepIndex.value - 1]
    }),
    nextStep = computed(() => {
        if (stepIndex.value === steps.value.length - 1) {
            return null
        }
        return steps.value[stepIndex.value + 1]
    })

</script>
