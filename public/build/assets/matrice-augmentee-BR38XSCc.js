import{d as A,r as m,e as N,O as p,P as d,X as i,W as f,Q as s,Z as v,x as g,U as $,a6 as j}from"./@vue-sdZLaU5y.js";import{_ as k}from"./ToolForm.vue_vue_type_script_setup_true_lang-DGtX0p5u.js";import{u as E}from"./useToolsStorage-_M4UL000.js";import{_ as C}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-cHe-fA58.js";import{_ as S}from"./scButton.vue_vue_type_script_setup_true_lang-BWx_m1Nb.js";import{A as y,v as T,E as U}from"./pimath-BmIV-0gC.js";import{_ as q}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-CY9U_kQF.js";import"./FormMaker-CpHtT_cI.js";import"./prismjs-BxWmPLb3.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./pichecker-CjNBF3Pr.js";import"./@vueuse-C_-lITbw.js";import"./axios-t--hEgTQ.js";import"./@inertiajs-BrvtfIgw.js";import"./deepmerge-D2xPuArj.js";import"./qs-BqfUvyCa.js";import"./side-channel-BeWElXr9.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-CadTYb9o.js";import"./side-channel-list-BN-t5Yqu.js";import"./side-channel-map-Cwyy2X9L.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-Bq3LDUt4.js";import"./lodash.clonedeep-Dv3wwXhk.js";import"./lodash.isequal-CyI_q7FX.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-BnLaZaxc.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-CiDEzipx.js";import"./keyboardConfig-BmfPUS7R.js";import"./app-CAOFdafe.js";import"./three-mIjm4BAA.js";import"./katex-BwkeJf5B.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-C6VJa7WY.js";import"./vuedraggable-wbhjsz0Z.js";import"./sortablejs-D5Oeo24j.js";import"./useKeyboard-DMx7mO13.js";import"./scolcours-C9-HeIZl.js";import"./TexCode.vue_vue_type_script_setup_true_lang-I951T8RU.js";import"./markdown-it-Cjl7baE0.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-C00cla-y.js";import"./markdown-it-attrs-C_WAS53n.js";import"./markdown-it-bracketed-spans-D9No-qro.js";import"./markdown-it-texmath-B96J6Dg7.js";const B=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
à une matrice unité (que des zéros, sauf dans la diagonale qui doit ne contenir que des 1). On procède de la manière suivante:

1. on commence par amener le premier pivot \\(a_{11}\\) à la valeur \\(1\\)

\\[\\left(\\begin{array}{ccc|c}
1 & \\ldots & \\ldots & \\ldots \\\\
\\ldots & \\ldots & \\ldots & \\ldots \\\\
\\ldots & \\ldots & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

2. on annule les coefficients **en dessous** de \\(a_{11}\\) en utilisant la première ligne

\\[\\left(\\begin{array}{ccc|c}
1 & \\ldots & \\ldots & \\ldots \\\\
0 & \\ldots & \\ldots & \\ldots \\\\
0 & \\ldots & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

3. à la ligne suivant, on modifie le coefficient \\(a_{22}\\) à la valeur \\(1\\)

\\[\\left(\\begin{array}{ccc|c}
1 & \\ldots & \\ldots & \\ldots \\\\
0 & 1 & \\ldots & \\ldots \\\\
0 & \\ldots & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

4. on annule les coefficients **en dessus** et **en dessous** de \\(a_{22}\\) en utilisant la deuxième ligne

\\[\\left(\\begin{array}{ccc|c}
1 & 0 & \\ldots & \\ldots \\\\
0 & 1 & \\ldots & \\ldots \\\\
0 & 0 & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

5. on répète les points 3. et 4. avec le(s) pivot(s) suivant(s).

\\[\\left(\\begin{array}{ccc|c}
1 & 0 & 0 & \\ldots \\\\
0 & 1 & 0 & \\ldots \\\\
0 & 0 & 1 & \\ldots \\\\
\\end{array}\\right)\\]
`,D={class:"flex gap-3 w-full justify-center my-10"},I={key:0,class:"my-10"},M={key:1,class:"text-red-700 text-sm"},Qt=A({__name:"matrice-augmentee",setup(P){const{restoreTool:_}=E(),r=_([{label:"matrice",type:"textarea",value:m(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:m(`1
8
7`),fromUrl:"droite"}]),c=N(()=>{try{const n=r[0].value.value.split(`
`),t=r[1].value.value.split(`
`);return{code:n.map((l,o)=>t[o]!==void 0&&t[o]!==""?`${l}|${t[o]}`:l).join(`
`),parameters:""}}catch(n){return console.error(n),!1}});function u(){const t=Array(3).fill(0).map(()=>y.numberSym(5)),e=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>y.numberSym(9)));if(new T(...e.map(o=>new U(...o))).determinant().value===0)return console.log("LINEAR INDEPENDANT"),u();e.forEach(o=>{const x=o.reduce((b,h,w)=>b+h*t[w],0);return o.push(x)}),console.log(t),r[0].value.value=e.map(o=>o.slice(0,-1).join(" ")).join(`
`),r[1].value.value=e.map(o=>o.slice(-1)[0]).join(`
`)}const a=m(!0);return(n,t)=>(d(),p("article",null,[i(k,{forms:g(r),"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3",rows:6},{default:f(()=>[s("div",D,[i(S,{type:"primary",onClick:u},{default:f(()=>t[1]||(t[1]=[v(" généréer ")])),_:1})])]),_:1},8,["forms"]),c.value?(d(),p("div",I,[i(C,{illustration:c.value},null,8,["illustration"]),s("div",null,[s("div",{class:"flex gap-3 justify-end cursor-pointer",onClick:t[0]||(t[0]=e=>a.value=!a.value)},t[2]||(t[2]=[s("i",{class:"bi bi-x-lg"},null,-1),v(" instructions ")])),$(i(q,{text:g(B)},null,8,["text"]),[[j,a.value]])])])):(d(),p("div",M," Une erreur s'est produite avec vos données. "))]))}});export{Qt as default};
