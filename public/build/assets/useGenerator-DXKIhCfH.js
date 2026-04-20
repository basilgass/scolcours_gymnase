import{St as e,ht as t}from"./@inertiajs-C0oRnCTy.js";import{i as n}from"./pimath-NcUKaRJ_.js";import{t as r}from"./PiMathExt-BPAFVFFI.js";import{i}from"./makeModel-DRrfRZxf.js";function a(a){let o=t(1);function s(t){t===void 0&&(t=l());let n=e(t),r=e(a);return{block:{id:0,title:n.title??``,body:r.template.replace(`question`,n.question).replace(`answer`,`$a`),illustration:n.illustration?i(n.illustration):null},keyboard:n.keyboard??r.keyboard,answer:``+n.answer,equationControl:null,user:{is_resolved:!1}}}function c(e){if(e<1)return[];let t=[];for(let n=0;n<e;n++){let e=l();t.some(t=>t.question===e.question)||t.push(l())}return t.map(e=>s(e))}function l(){let t=e(a),i=Function(`PiMath`,`PiMathExt`,`params`,t.code);try{let e=i(n,r,{level:o.value});return e.keyboard||=t.keyboard,e}catch(e){throw console.warn(e),Error(`Erreur dans la génération de la question (voir la console pour plus détails)`)}}return{code:e(a).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:e=>s(e),list:c,random:()=>l(),level:o}}export{a as t};