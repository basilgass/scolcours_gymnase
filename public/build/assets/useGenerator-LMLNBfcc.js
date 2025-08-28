import{M as c}from"./pimath-CpviR_n-.js";import{x as o}from"./@vue-mHX2EraA.js";function q(s){function i(e){e===void 0&&(e=t());const n=o(e),r=o(s);return{block:{id:0,title:n.title??"",body:r.template.replace("question",n.question).replace("answer","$a"),illustration:null},keyboard:n.keyboard??r.keyboard,answer:""+n.answer,user:{is_resolved:!1}}}function a(e){if(e<1)return[];const n=[];for(let r=0;r<e;r++){const u=t();n.some(d=>d.question===u.question)||n.push(t())}return n}function t(){const e=o(s),n=new Function("PiMath",e.code);try{const r=n(c);return r.keyboard||(r.keyboard=e.keyboard),r}catch{throw new Error("Erreur dans la génération de la question")}}return{code:o(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:e=>i(e),list:a,random:()=>t()}}export{q as u};
