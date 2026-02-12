import{Z as d}from"./pimath-CGVrGbmj.js";import{P as f}from"./PiMathExt-DhMSfue6.js";import{m}from"./makeModel-Clh-hsZI.js";import{r as p,x as n}from"./@vue-Blx1AnSH.js";function h(s){const a=p(1);function i(t){t===void 0&&(t=r());const o=n(t),e=n(s);return{block:{id:0,title:o.title??"",body:e.template.replace("question",o.question).replace("answer","$a"),illustration:o.illustration?m(o.illustration):null},keyboard:o.keyboard??e.keyboard,answer:""+o.answer,equationControl:null,user:{is_resolved:!1}}}function u(t){if(t<1)return[];const o=[];for(let e=0;e<t;e++){const l=r();o.some(c=>c.question===l.question)||o.push(r())}return o.map(e=>i(e))}function r(){const t=n(s),o=new Function("PiMath","PiMathExt","params",t.code);try{const e=o(d,f,{level:a.value});return e.keyboard||(e.keyboard=t.keyboard),e}catch(e){throw console.warn(e),new Error("Erreur dans la génération de la question (voir la console pour plus détails)")}}return{code:n(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:t=>i(t),list:u,random:()=>r(),level:a}}export{h as u};
