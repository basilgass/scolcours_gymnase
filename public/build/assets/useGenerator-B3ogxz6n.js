import{M as d}from"./pimath-CpviR_n-.js";import{x as t}from"./@vue-mHX2EraA.js";function p(s){function a(e){e===void 0&&(e=r());const n=t(e),o=t(s);return{block:{id:0,title:n.title??"",body:o.template.replace("question",n.question).replace("answer","$a"),illustration:null},keyboard:n.keyboard??o.keyboard,answer:""+n.answer,user:{is_resolved:!1}}}function i(e){if(e<1)return[];const n=[];for(let o=0;o<e;o++){const u=r();n.some(c=>c.question===u.question)||n.push(r())}return n}function r(){const e=t(s),n=new Function("PiMath",e.code);try{const o=n(d);return o.keyboard||(o.keyboard=e.keyboard),o}catch(o){throw console.warn(o),new Error("Erreur dans la génération de la question (voir la console pour plus détails)")}}return{code:t(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:e=>a(e),list:i,random:()=>r()}}export{p as u};
