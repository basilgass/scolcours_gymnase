import{L as c}from"./pimath-BDZBoBsj.js";import{P as d}from"./PiMathExt-DaHdDeEl.js";import{x as r}from"./@vue-BiqrURHB.js";function b(s){function a(e){e===void 0&&(e=n());const t=r(e),o=r(s);return{block:{id:0,title:t.title??"",body:o.template.replace("question",t.question).replace("answer","$a"),illustration:null},keyboard:t.keyboard??o.keyboard,answer:""+t.answer,equationControl:null,user:{is_resolved:!1}}}function i(e){if(e<1)return[];const t=[];for(let o=0;o<e;o++){const u=n();t.some(l=>l.question===u.question)||t.push(n())}return t}function n(){const e=r(s),t=new Function("PiMath","PiMathExt",e.code);try{const o=t(c,d);return o.keyboard||(o.keyboard=e.keyboard),o}catch(o){throw console.warn(o),new Error("Erreur dans la génération de la question (voir la console pour plus détails)")}}return{code:r(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:e=>a(e),list:i,random:()=>n()}}export{b as u};
