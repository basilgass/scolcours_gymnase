import{d as N,r as m,e as A,N as p,O as d,W as i,V as f,P as s,Y as v,x as g,S as $,a5 as j}from"./@vue-OhrmdBQK.js";import{_ as k}from"./ToolForm.vue_vue_type_script_setup_true_lang-CdOlH_qW.js";import{u as E}from"./useToolsStorage-BLVMDXRv.js";import{_ as S}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-iVQlaElT.js";import{_ as C}from"./scButton.vue_vue_type_script_setup_true_lang-BU-cA_UT.js";import{A as y,v as T,E as V}from"./pimath-BmIV-0gC.js";import{_ as q}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-j4dRpocv.js";import"./FormMaker-Da0v3AF9.js";import"./prismjs-DvUC8qPa.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./pichecker-CjNBF3Pr.js";import"./@vueuse-75tkpVHh.js";import"./axios-t--hEgTQ.js";import"./@inertiajs-D-oRe4um.js";import"./deepmerge-DToHYny_.js";import"./qs-BnRaq9dv.js";import"./side-channel-1MK8hGCb.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-nAMS_pMr.js";import"./side-channel-list-CIvCDIil.js";import"./side-channel-map-DIXd4xq7.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-BkrlIo3i.js";import"./lodash.clonedeep-CCGJpdpJ.js";import"./lodash.isequal-cZTQkewt.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-8tzWLIvr.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-Dlc2y9jT.js";import"./keyboardConfig-BaLUXKy-.js";import"./app-FTthPxdb.js";import"./three-mIjm4BAA.js";import"./katex-BwkeJf5B.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-AxvEDmfJ.js";import"./vuedraggable-MYmKeX8p.js";import"./sortablejs-D5Oeo24j.js";import"./useKeyboard-CKfrw3TJ.js";import"./scolcours-Bnl2OekD.js";import"./TexCode.vue_vue_type_script_setup_true_lang-CnNW-qP9.js";import"./markdown-it-Cjl7baE0.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-C00cla-y.js";import"./markdown-it-attrs-3ofXUtXT.js";import"./markdown-it-bracketed-spans-DID-dJFh.js";import"./markdown-it-texmath-CnaHooVe.js";const B=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,D={class:"flex gap-3 w-full justify-center my-10"},I={key:0,class:"my-10"},M={key:1,class:"text-red-700 text-sm"},Rt=N({__name:"matrice-augmentee",setup(P){const{restoreTool:_}=E(),r=_([{label:"matrice",type:"textarea",value:m(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:m(`1
8
7`),fromUrl:"droite"}]),c=A(()=>{try{const n=r[0].value.value.split(`
`),t=r[1].value.value.split(`
`);return{code:n.map((l,o)=>t[o]!==void 0&&t[o]!==""?`${l}|${t[o]}`:l).join(`
`),parameters:""}}catch(n){return console.error(n),!1}});function u(){const t=Array(3).fill(0).map(()=>y.numberSym(5)),e=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>y.numberSym(9)));if(new T(...e.map(o=>new V(...o))).determinant().value===0)return console.log("LINEAR INDEPENDANT"),u();e.forEach(o=>{const x=o.reduce((b,h,w)=>b+h*t[w],0);return o.push(x)}),console.log(t),r[0].value.value=e.map(o=>o.slice(0,-1).join(" ")).join(`
`),r[1].value.value=e.map(o=>o.slice(-1)[0]).join(`
`)}const a=m(!0);return(n,t)=>(d(),p("article",null,[i(k,{forms:g(r),"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3",rows:6},{default:f(()=>[s("div",D,[i(C,{type:"primary",onClick:u},{default:f(()=>t[1]||(t[1]=[v(" généréer ")])),_:1})])]),_:1},8,["forms"]),c.value?(d(),p("div",I,[i(S,{illustration:c.value},null,8,["illustration"]),s("div",null,[s("div",{class:"flex gap-3 justify-end cursor-pointer",onClick:t[0]||(t[0]=e=>a.value=!a.value)},t[2]||(t[2]=[s("i",{class:"bi bi-x-lg"},null,-1),v(" instructions ")])),$(i(q,{text:g(B)},null,8,["text"]),[[j,a.value]])])])):(d(),p("div",M," Une erreur s'est produite avec vos données. "))]))}});export{Rt as default};
