import{Z as c}from"./pimath-CGVrGbmj.js";import{P as d}from"./PiMathExt-DhMSfue6.js";import{m as f}from"./makeModel-BbP0gY1i.js";import{x as n}from"./@vue-CSWzJjAl.js";function y(s){function i(o){o===void 0&&(o=r());const e=n(o),t=n(s);return{block:{id:0,title:e.title??"",body:t.template.replace("question",e.question).replace("answer","$a"),illustration:e.illustration?f(e.illustration):null},keyboard:e.keyboard??t.keyboard,answer:""+e.answer,equationControl:null,user:{is_resolved:!1}}}function a(o){if(o<1)return[];const e=[];for(let t=0;t<o;t++){const u=r();e.some(l=>l.question===u.question)||e.push(r())}return e}function r(){const o=n(s),e=new Function("PiMath","PiMathExt",o.code);try{const t=e(c,d);return t.keyboard||(t.keyboard=o.keyboard),t}catch(t){throw console.warn(t),new Error("Erreur dans la génération de la question (voir la console pour plus détails)")}}return{code:n(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:o=>i(o),list:a,random:()=>r()}}export{y as u};
