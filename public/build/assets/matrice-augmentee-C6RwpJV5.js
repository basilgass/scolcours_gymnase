import{d as h,r as l,b as w,F as $,G as m,Q as a,O as d,x as u,P as f,H as k,Y as T,Z as j,$ as B}from"./@vue-mHX2EraA.js";import{_ as N}from"./ToolForm.vue_vue_type_script_setup_true_lang-ByQhRj9g.js";import{u as O}from"./useToolsStorage-hs-dR8hL.js";import{_ as S}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-EJvxR045.js";import{O as v,p as q,N as A}from"./pimath-CpviR_n-.js";import{_ as C}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-BxMFL2vt.js";import{_ as E}from"./scButton.vue_vue_type_script_setup_true_lang-DlSy28ON.js";import{_ as M}from"./Card.vue_vue_type_script_setup_true_lang-B2IhHy_Y.js";import{T as V}from"./ToolError-MuhgJwq5.js";import"./FormMaker.vue_vue_type_script_setup_true_lang-BvPEUpNL.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./scolcours-C8NAW6K_.js";import"./@mermaid-js-BkNdq-V2.js";import"./langium-B3Oy5o8n.js";import"./vscode-jsonrpc-1VOqS1Ai.js";import"./chevrotain-ufdGC5RL.js";import"./@chevrotain-DTdGFJgf.js";import"./lodash-es-MXiO74gM.js";import"./chevrotain-allstar-CQH327D_.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./vscode-uri-CI4Qs-K4.js";import"./@vueuse-ige4WCsB.js";import"./@inertiajs-DWYGoxiA.js";import"./qs-BeCYdERL.js";import"./side-channel-0MiGgEhS.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-C1WA4GUA.js";import"./@braintree-CgcfzsAa.js";import"./side-channel-list-EGvMd5XU.js";import"./side-channel-map-fmgflpBz.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-Dxr6lSWt.js";import"./axios-NIGUFBhG.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-CWBbNkcp.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-CXBd2EO7.js";import"./keyboardConfig-Ci-lTjA9.js";import"./app-DAw7B72I.js";import"./katex-DUaC9SwU.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-CfqAVabU.js";import"./vuedraggable-BjlCR7_b.js";import"./sortablejs-D5Oeo24j.js";import"./dayjs-DZvSGOSq.js";import"./useKeyboard-DCy2if7b.js";import"./piexpression-DXvJTYf2.js";import"./PiChecker-DPMKbub5.js";import"./TexCode.vue_vue_type_script_setup_true_lang-lyh1SliT.js";import"./PiMatrix.vue_vue_type_script_setup_true_lang-DpZETPaF.js";import"./markdown-it-C44Roubk.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-DJLJ_KHS.js";import"./markdown-it-bracketed-spans-BGrfw2K_.js";import"./markdown-it-texmath-BJmS_jSH.js";const G=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,to=h({__name:"matrice-augmentee",setup(P){const{restoreTool:_}=O(),e=_([{label:"matrice",type:"textarea",value:l(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:l(`1
8
7`),fromUrl:"droite"}]),p=w(()=>{try{const n=e[0].value.value.split(`
`),o=e[1].value.value.split(`
`);return{code:n.map((s,t)=>o[t]!==void 0&&o[t]!==""?`${s}|${o[t]}`:s).join(`
`),parameters:""}}catch(n){return console.error(n),!1}});function c(){const o=Array(3).fill(0).map(()=>v.numberSym(5)),r=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>v.numberSym(9)));if(new q(...r.map(t=>new A(...t))).determinant().value===0)return c();r.forEach(t=>{const g=t.reduce((y,x,b)=>y+x*o[b],0);return t.push(g)}),e[0].value.value=r.map(t=>t.slice(0,-1).join(" ")).join(`
`),e[1].value.value=r.map(t=>t.slice(-1)[0]).join(`
`)}const i=l(!1);return(n,o)=>(m(),$("article",null,[a(N,{forms:u(e),"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3",rows:6,"generate-button":"",onGenerate:c},null,8,["forms"]),p.value?(m(),d(M,{key:0},{default:f(()=>[a(S,{illustration:p.value},null,8,["illustration"]),k("div",null,[a(E,{icon:i.value?"bi bi-x-lg":"bi-eye",active:i.value,xs:"",onClick:o[0]||(o[0]=r=>i.value=!i.value)},{default:f(()=>[...o[1]||(o[1]=[j(" instructions ",-1)])]),_:1},8,["icon","active"]),T(a(C,{text:u(G)},null,8,["text"]),[[B,i.value]])])]),_:1})):(m(),d(V,{key:1}))]))}});export{to as default};
