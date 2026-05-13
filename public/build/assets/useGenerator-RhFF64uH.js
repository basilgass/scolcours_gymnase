import{mt as e,xt as t}from"./@inertiajs-DcPzCMHT.js";import{i as n}from"./pimath-CyHf4SPY.js";import{t as r}from"./PiMathExt-afF1J71x.js";import{i}from"./makeModel-Bfu2ldSG.js";var a=.75;function o(e,t){return t===void 0&&(t=a),e.validations.length>0&&e.validations.some(e=>e.score<t)}function s(a){let o=e(1);function s(e,n){e===void 0&&(e=l(n));let r=t(e),o=t(a);return{block:{id:0,title:r.title??``,body:o.template.replace(`question`,r.question).replace(`answer`,`$a`),illustration:r.illustration?i(r.illustration):null},keyboard:r.keyboard??o.keyboard,answer:``+r.answer,equationControl:null,user:{is_resolved:!1}}}function c(e,t){if(e<1)return[];let n=[];for(let r=0;r<e;r++){let e=l(t);n.some(t=>t.question===e.question)||n.push(e)}return n.map(e=>s(e))}function l(e){let i=t(a),s=Function(`PiMath`,`PiMathExt`,`params`,i.code);try{let t=s(n,r,Object.assign({},{level:o.value},e));return t.keyboard||=i.keyboard,t}catch(e){throw console.warn(e),Error(`Erreur dans la génération de la question (voir la console pour plus détails)`)}}return{code:t(a).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:(e,t)=>s(e,t),list:c,random:e=>l(e),level:o}}export{s as n,o as t};