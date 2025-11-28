import{d as w,r as l,b as m,F as k,G as p,Q as a,O as f,x as v,P as g,H as N,Z as T,X as V,a3 as j}from"./@vue-CXkTGxSa.js";import{_ as B}from"./ToolForm.vue_vue_type_script_setup_true_lang-DZgPogpY.js";import{u as M}from"./useToolsStorage-BPf3Q5q5.js";import{_ as S}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-DAgFhMTx.js";import{Q as _,P as q,g as A}from"./pimath-Bu5klfBJ.js";import{_ as C}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-Ca6QbPrf.js";import{_ as E}from"./scButton.vue_vue_type_script_setup_true_lang-CQLXm8Ig.js";import{_ as P}from"./Card.vue_vue_type_script_setup_true_lang-CbV62L7-.js";import{T as Q}from"./ToolError-BUhmVCxh.js";import"./FormMaker.vue_vue_type_script_setup_true_lang-CQzrFUL0.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./scolcours-CNG_pUCV.js";import"./@mermaid-js-k9rNGgmZ.js";import"./langium-D6IeNA9Z.js";import"./vscode-jsonrpc-CNa_m3dn.js";import"./chevrotain-CcLq-5Ko.js";import"./@chevrotain-DDB92SUb.js";import"./lodash-es-6mKN7T2K.js";import"./chevrotain-allstar-i0sJ2Ue_.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./vscode-uri-BBKMTmn0.js";import"./@vueuse-D4xUVk1d.js";import"./@inertiajs-CbRYEV17.js";import"./qs-Bt1rdCRG.js";import"./side-channel-DOvKdot3.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-C1WA4GUA.js";import"./@braintree-CgcfzsAa.js";import"./side-channel-list-EGvMd5XU.js";import"./side-channel-map-DzqAQex1.js";import"./get-intrinsic-CkMHug4B.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BGzL27Ic.js";import"./side-channel-weakmap-BC8dOCIo.js";import"./axios-ngrFHoWO.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-D-N2N178.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-BYkzS4hX.js";import"./keyboardConfig-DeTisPlL.js";import"./app-CA12OhVX.js";import"./katex-WNqlllh1.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-DYRVedgg.js";import"./vuedraggable-BSFs0gBY.js";import"./sortablejs-BVjtSL1l.js";import"./dayjs-C434z7Dj.js";import"./useKeyboard-Cv66MZDE.js";import"./piexpression-DXvJTYf2.js";import"./PiChecker-BsFUmNAd.js";import"./PiRadian-mR2C4HOK.js";import"./TexCode.vue_vue_type_script_setup_true_lang-BeA-ZPkg.js";import"./useStoreFlashMessage-56H3Lbra.js";import"./PiMatrix.vue_vue_type_script_setup_true_lang-CpZC0W2c.js";import"./markdown-it-B_KdP_AI.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-DaOgEp9O.js";import"./markdown-it-attrs-CRciocxY.js";import"./markdown-it-bracketed-spans-BGrfw2K_.js";import"./markdown-it-texmath-BKrOoRQO.js";const G=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,re=w({__name:"matrice-augmentee",setup(O){const{restoreTool:y}=M(),o=y([{label:"matrice",type:"textarea",value:l(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:l(`1
8
7`),fromUrl:"droite"}]);m(()=>o[0].value.value.includes(".")||o[1].value.value.includes("."));const u=m(()=>{const r=(o[0].value.value+`
`+o[1].value.value).split(/[\s\n]/g).filter(t=>!isNaN(Number(t))&&t.includes(".")).map(t=>t.split(".")[1].length);return r.length>0?Math.max(...r):0}),c=m(()=>{try{const r=o[0].value.value.split(`
`),t=o[1].value.value.split(`
`);return{code:r.map((s,e)=>t[e]!==void 0&&t[e]!==""?`${s}|${t[e]}`:s).join(`
`),parameters:`auto${u.value?`,fixed=${u.value}`:""}`}}catch(r){return console.error(r),!1}});function d(){const t=Array(3).fill(0).map(()=>_.numberSym(5)),i=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>_.numberSym(9)));if(new q().fromVectors(...i.map(e=>new A(...e))).determinant().value===0)return d();i.forEach(e=>{const x=e.reduce((b,h,$)=>b+h*t[$],0);return e.push(x)}),o[0].value.value=i.map(e=>e.slice(0,-1).join(" ")).join(`
`),o[1].value.value=i.map(e=>e.slice(-1)[0]).join(`
`)}const n=l(!1);return(r,t)=>(p(),k("article",null,[a(B,{forms:v(o),rows:6,"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3","generate-button":"",onGenerate:d},null,8,["forms"]),c.value?(p(),f(P,{key:0},{default:g(()=>[a(S,{illustration:c.value},null,8,["illustration"]),N("div",null,[a(E,{active:n.value,icon:n.value?"bi bi-x-lg":"bi-eye",xs:"",onClick:t[0]||(t[0]=i=>n.value=!n.value)},{default:g(()=>[...t[1]||(t[1]=[V(" instructions ",-1)])]),_:1},8,["active","icon"]),T(a(C,{text:v(G)},null,8,["text"]),[[j,n.value]])])]),_:1})):(p(),f(Q,{key:1}))]))}});export{re as default};
