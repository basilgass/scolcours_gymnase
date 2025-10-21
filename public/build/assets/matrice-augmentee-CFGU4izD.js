import{d as h,r as m,b as w,F as $,G as l,Q as a,O as d,x as u,P as f,H as k,Y as T,Z as j,a3 as B}from"./@vue-CJ10sZgr.js";import{_ as N}from"./ToolForm.vue_vue_type_script_setup_true_lang-CN4X162R.js";import{u as O}from"./useToolsStorage-ChB9k8Ux.js";import{_ as S}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-azWhxn0A.js";import{O as v,p as V,N as q}from"./pimath-CpviR_n-.js";import{_ as A}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-diMK54mL.js";import{_ as C}from"./scButton.vue_vue_type_script_setup_true_lang-DdMc-z_o.js";import{_ as E}from"./Card.vue_vue_type_script_setup_true_lang-CJFFDKNC.js";import{T as M}from"./ToolError-D0YYkJAW.js";import"./FormMaker.vue_vue_type_script_setup_true_lang-Bzj7f-9i.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./scolcours-kFEE27qg.js";import"./@mermaid-js-DLpRP1nr.js";import"./langium-D6IeNA9Z.js";import"./vscode-jsonrpc-CNa_m3dn.js";import"./chevrotain-CcLq-5Ko.js";import"./@chevrotain-DDB92SUb.js";import"./lodash-es-6mKN7T2K.js";import"./chevrotain-allstar-i0sJ2Ue_.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./vscode-uri-BBKMTmn0.js";import"./@vueuse-Dxnxfcyw.js";import"./@inertiajs-D7L_FZfj.js";import"./qs-Bt1rdCRG.js";import"./side-channel-DOvKdot3.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-C1WA4GUA.js";import"./@braintree-CgcfzsAa.js";import"./side-channel-list-EGvMd5XU.js";import"./side-channel-map-DzqAQex1.js";import"./get-intrinsic-CkMHug4B.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BGzL27Ic.js";import"./side-channel-weakmap-BC8dOCIo.js";import"./axios-ngrFHoWO.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-CLjfO2NT.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-DDKq--bb.js";import"./keyboardConfig-DBvUffIr.js";import"./app-BTi7H0Be.js";import"./katex-WNqlllh1.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-CVkEWydm.js";import"./vuedraggable-DhWlnnaU.js";import"./sortablejs-BVjtSL1l.js";import"./dayjs-C434z7Dj.js";import"./useKeyboard-DN9prKYd.js";import"./piexpression-DXvJTYf2.js";import"./PiChecker-BVtx1QZu.js";import"./PiRadian-81YEuKuQ.js";import"./TexCode.vue_vue_type_script_setup_true_lang-ChvLtaVV.js";import"./useStoreFlashMessage-CCXqIseW.js";import"./PiMatrix.vue_vue_type_script_setup_true_lang-BvnASg_J.js";import"./markdown-it-B_KdP_AI.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-DaOgEp9O.js";import"./markdown-it-attrs-CRciocxY.js";import"./markdown-it-bracketed-spans-BGrfw2K_.js";import"./markdown-it-texmath-BKrOoRQO.js";const G=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,ro=h({__name:"matrice-augmentee",setup(P){const{restoreTool:_}=O(),e=_([{label:"matrice",type:"textarea",value:m(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:m(`1
8
7`),fromUrl:"droite"}]),p=w(()=>{try{const n=e[0].value.value.split(`
`),o=e[1].value.value.split(`
`);return{code:n.map((s,t)=>o[t]!==void 0&&o[t]!==""?`${s}|${o[t]}`:s).join(`
`),parameters:"auto"}}catch(n){return console.error(n),!1}});function c(){const o=Array(3).fill(0).map(()=>v.numberSym(5)),r=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>v.numberSym(9)));if(new V().fromVectors(...r.map(t=>new q(...t))).determinant().value===0)return c();r.forEach(t=>{const g=t.reduce((y,x,b)=>y+x*o[b],0);return t.push(g)}),e[0].value.value=r.map(t=>t.slice(0,-1).join(" ")).join(`
`),e[1].value.value=r.map(t=>t.slice(-1)[0]).join(`
`)}const i=m(!1);return(n,o)=>(l(),$("article",null,[a(N,{forms:u(e),rows:6,"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3","generate-button":"",onGenerate:c},null,8,["forms"]),p.value?(l(),d(E,{key:0},{default:f(()=>[a(S,{illustration:p.value},null,8,["illustration"]),k("div",null,[a(C,{active:i.value,icon:i.value?"bi bi-x-lg":"bi-eye",xs:"",onClick:o[0]||(o[0]=r=>i.value=!i.value)},{default:f(()=>[...o[1]||(o[1]=[j(" instructions ",-1)])]),_:1},8,["active","icon"]),T(a(A,{text:u(G)},null,8,["text"]),[[B,i.value]])])]),_:1})):(l(),d(M,{key:1}))]))}});export{ro as default};
