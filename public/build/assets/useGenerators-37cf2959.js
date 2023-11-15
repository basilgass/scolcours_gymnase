import{u as r}from"./@vue-b854543f.js";function c(a){function u(e){return r(a)[r(e)-1]}function s(e,n){const t=r(e),o=r(n);return{body:"",block:{title:t.title?t.title:o.title,body:(t.output?t.output:o.output).replace("question",t.question).replace("answer","$a"),illustration:null},keyboard:t.keyboard?t.keyboard:o.keyboard,answer:""+t.answer,user:{result:!1}}}const i=`return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`;return{generator:e=>u(e),code:e=>u(e).code??i,question:(e,n)=>s(e,n)}}export{c as u};
