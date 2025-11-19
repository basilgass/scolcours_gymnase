import{M as d}from"./pimath-CpviR_n-.js";import{P as l}from"./PiMathExt-CqRZkaC2.js";import{x as n}from"./@vue-CXkTGxSa.js";function b(s){function a(e){e===void 0&&(e=r());const t=n(e),o=n(s);return{block:{id:0,title:t.title??"",body:o.template.replace("question",t.question).replace("answer","$a"),illustration:null},keyboard:t.keyboard??o.keyboard,answer:""+t.answer,user:{is_resolved:!1}}}function i(e){if(e<1)return[];const t=[];for(let o=0;o<e;o++){const u=r();t.some(c=>c.question===u.question)||t.push(r())}return t}function r(){const e=n(s),t=new Function("PiMath","PiMathExt",e.code);try{const o=t(d,l);return o.keyboard||(o.keyboard=e.keyboard),o}catch(o){throw console.warn(o),new Error("Erreur dans la génération de la question (voir la console pour plus détails)")}}return{code:n(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:e=>a(e),list:i,random:()=>r()}}export{b as u};
