import{P as c}from"./pimath-CCU4WHwg.js";import{u as o}from"./@vue-DqEkFMKT.js";function m(s){function a(e){e===void 0&&(e=r());const t=o(e),n=o(s);return{body:"",block:{id:0,title:t.title??"",body:n.template.replace("question",t.question).replace("answer","$a"),illustration:null},keyboard:t.keyboard??n.keyboard,answer:""+t.answer,user:{result:!1}}}function i(e){if(e<1)return[];const t=[];for(let n=0;n<e;n++){const u=r();t.some(d=>d.question===u.question)||t.push(r())}return t}function r(){const e=o(s),t=new Function("PiMath",e.code);try{const n=t(c);return n.keyboard||(n.keyboard=e.keyboard),n}catch{throw new Error("Erreur dans la génération de la question")}}return{code:o(s).code??`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`,question:e=>a(e),list:i,random:()=>r()}}export{m as u};
