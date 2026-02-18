import{F as d}from"./pimath-b_hRKzBe.js";import{P as f}from"./PiMathExt-BVvFyzF_.js";import{m}from"./makeModel-Clh-hsZI.js";import{r as p,x as n}from"./@vue-C3uDR5l1.js";function h(s){const a=p(1);function i(o){o===void 0&&(o=r());const t=n(o),e=n(s);return{block:{id:0,title:t.title??"",body:e.template.replace("question",t.question).replace("answer","$a"),illustration:t.illustration?m(t.illustration):null},keyboard:t.keyboard??e.keyboard,answer:""+t.answer,equationControl:null,user:{is_resolved:!1}}}function u(o){if(o<1)return[];const t=[];for(let e=0;e<o;e++){const l=r();t.some(c=>c.question===l.question)||t.push(r())}return t.map(e=>i(e))}function r(){const o=n(s),t=new Function("PiMath","PiMathExt","params",o.code);try{const e=t(d,f,{level:a.value});return e.keyboard||(e.keyboard=o.keyboard),e}catch(e){throw console.warn(e),new Error("Erreur dans la génération de la question (voir la console pour plus détails)")}}return{code:n(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:o=>i(o),list:u,random:()=>r(),level:a}}export{h as u};
