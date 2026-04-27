import{mt as e,xt as t}from"./@inertiajs-DcPzCMHT.js";import{i as n}from"./pimath-COxezCG5.js";import{t as r}from"./PiMathExt-DgI7btj0.js";import{i}from"./makeModel-Bfu2ldSG.js";function a(a){let o=e(1);function s(e){e===void 0&&(e=l());let n=t(e),r=t(a);return{block:{id:0,title:n.title??``,body:r.template.replace(`question`,n.question).replace(`answer`,`$a`),illustration:n.illustration?i(n.illustration):null},keyboard:n.keyboard??r.keyboard,answer:``+n.answer,equationControl:null,user:{is_resolved:!1}}}function c(e){if(e<1)return[];let t=[];for(let n=0;n<e;n++){let e=l();t.some(t=>t.question===e.question)||t.push(l())}return t.map(e=>s(e))}function l(){let e=t(a),i=Function(`PiMath`,`PiMathExt`,`params`,e.code);try{let t=i(n,r,{level:o.value});return t.keyboard||=e.keyboard,t}catch(e){throw console.warn(e),Error(`Erreur dans la génération de la question (voir la console pour plus détails)`)}}return{code:t(a).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:e=>s(e),list:c,random:()=>l(),level:o}}export{a as t};