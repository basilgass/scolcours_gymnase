import{d as h,r as l,e as w,F as d,G as m,Q as a,O as $,y as u,P as f,H as k,Y as j,Z as B,$ as N}from"./@vue-DuaRNG-c.js";import{_ as O}from"./ToolForm.vue_vue_type_script_setup_true_lang-DvYrlTRz.js";import{u as S}from"./useToolsStorage-BGR4Pc5G.js";import{_ as q}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-D_MSwUag.js";import{O as v,p as A,N as C}from"./pimath-DTZgqGso.js";import{_ as M}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-CbsBzxfq.js";import{_ as T}from"./scButton.vue_vue_type_script_setup_true_lang-DampVye9.js";import{_ as U}from"./Card.vue_vue_type_script_setup_true_lang-D33Jxb8R.js";import"./FormMaker.vue_vue_type_script_setup_true_lang-CiXcRJnz.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./scolcours-LoPXQTFQ.js";import"./@mermaid-js-Ch7cOu3-.js";import"./langium-BswIKo8o.js";import"./vscode-jsonrpc-1VOqS1Ai.js";import"./chevrotain-BwsBAYzG.js";import"./@chevrotain-kJs7c7WO.js";import"./lodash-es-DccjO_EN.js";import"./chevrotain-allstar-CMnDnFj0.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./vscode-uri-CoxP0whD.js";import"./@vueuse-DAt_ai8G.js";import"./@inertiajs-BIVwufqq.js";import"./qs-DdH_BQhP.js";import"./side-channel-DG-57Vhs.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-BA_lWL88.js";import"./@braintree-DtW683_T.js";import"./side-channel-list-I2ibK_sQ.js";import"./side-channel-map-iLDp7i1k.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-De_FFmmx.js";import"./axios-Dq7h7Pqt.js";import"./es-toolkit-SdXgwhWv.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-Dog-69Iy.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-Cv3zA_QH.js";import"./keyboardConfig-D15AFUNk.js";import"./app-kkR3SnHq.js";import"./katex-CTLZhCE0.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-BZr33mxH.js";import"./vuedraggable-B_RSTW1A.js";import"./sortablejs-D5Oeo24j.js";import"./dayjs-CwSjVP0V.js";import"./useKeyboard-B3p19ZpF.js";import"./piexpression-DXvJTYf2.js";import"./PiChecker-DvtxwJSv.js";import"./TexCode.vue_vue_type_script_setup_true_lang-Cn6jruBR.js";import"./PiMatrix.vue_vue_type_script_setup_true_lang-CLEu7xqN.js";import"./markdown-it-C44Roubk.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-DAiDLE5p.js";import"./markdown-it-bracketed-spans-BGPcQlH-.js";import"./markdown-it-texmath-CCroKQb5.js";const V=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,E={key:1,class:"text-red-700 text-sm"},to=h({__name:"matrice-augmentee",setup(G){const{restoreTool:_}=S(),r=_([{label:"matrice",type:"textarea",value:l(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:l(`1
8
7`),fromUrl:"droite"}]),p=w(()=>{try{const n=r[0].value.value.split(`
`),o=r[1].value.value.split(`
`);return{code:n.map((s,t)=>o[t]!==void 0&&o[t]!==""?`${s}|${o[t]}`:s).join(`
`),parameters:""}}catch(n){return console.error(n),!1}});function c(){const o=Array(3).fill(0).map(()=>v.numberSym(5)),e=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>v.numberSym(9)));if(new A(...e.map(t=>new C(...t))).determinant().value===0)return c();e.forEach(t=>{const g=t.reduce((y,x,b)=>y+x*o[b],0);return t.push(g)}),r[0].value.value=e.map(t=>t.slice(0,-1).join(" ")).join(`
`),r[1].value.value=e.map(t=>t.slice(-1)[0]).join(`
`)}const i=l(!1);return(n,o)=>(m(),d("article",null,[a(O,{forms:u(r),"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3",rows:6,"generate-button":"",onGenerate:c},null,8,["forms"]),p.value?(m(),$(U,{key:0},{default:f(()=>[a(q,{illustration:p.value},null,8,["illustration"]),k("div",null,[a(T,{icon:i.value?"bi bi-x-lg":"bi-eye",active:i.value,xs:"",onClick:o[0]||(o[0]=e=>i.value=!i.value)},{default:f(()=>o[1]||(o[1]=[B(" instructions ")])),_:1,__:[1]},8,["icon","active"]),j(a(M,{text:u(V)},null,8,["text"]),[[N,i.value]])])]),_:1})):(m(),d("div",E," Une erreur s'est produite avec vos données. "))]))}});export{to as default};
