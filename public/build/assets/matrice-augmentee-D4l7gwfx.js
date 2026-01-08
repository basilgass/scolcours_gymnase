import{d as $,r as a,b as u,F as k,G as m,Q as s,O as f,x as v,P as g,H as T,Z as j,X as B,a2 as P}from"./@vue-BiqrURHB.js";import{_ as S}from"./ToolForm.vue_vue_type_script_setup_true_lang-C_CFJu8X.js";import{u as V}from"./useToolsStorage-DEE3gD4q.js";import{_ as q}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-DJKNfY1t.js";import{P as _,I as A,g as C}from"./pimath-BDZBoBsj.js";import{_ as E}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-CmxLaUez.js";import{_ as M}from"./scButton.vue_vue_type_script_setup_true_lang-DHzMAweK.js";import{_ as N}from"./Card.vue_vue_type_script_setup_true_lang-DeeBAEWR.js";import{T as G}from"./ToolError-DMppIApi.js";import"./FormMaker.vue_vue_type_script_setup_true_lang-DEiwPAeS.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./scolcours-BZiqbkHN.js";import"./@mermaid-js-Hsasb9PZ.js";import"./langium-EzFSRyyV.js";import"./vscode-jsonrpc-CNa_m3dn.js";import"./chevrotain-DnTzqIG8.js";import"./@chevrotain-9uzJ8eMZ.js";import"./chevrotain-allstar-BkUXNAZz.js";import"./lodash-es-b_j8p2nR.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./vscode-uri-BBKMTmn0.js";import"./@vueuse-BtTyZYcE.js";import"./@inertiajs-C_BPzOan.js";import"./qs-DXSpy203.js";import"./side-channel-DOvKdot3.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-C1WA4GUA.js";import"./@braintree-CgcfzsAa.js";import"./side-channel-list-EGvMd5XU.js";import"./side-channel-map-DzqAQex1.js";import"./get-intrinsic-CkMHug4B.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BGzL27Ic.js";import"./side-channel-weakmap-BC8dOCIo.js";import"./axios-BetwS6Uc.js";import"./laravel-precognition-BIWIdR5z.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-DS8Va0ET.js";import"./KeyboardDisplay-bJ14_Rp7.js";import"./keyboardConfig-BxbWG1l9.js";import"./app-BcxlSQIj.js";import"./katex-DNwz9DW3.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-Cgv-1FzD.js";import"./vuedraggable-BcELEXXh.js";import"./sortablejs-DGsUuerW.js";import"./dayjs-Ba__uN2p.js";import"./useKeyboard-Ck0PdtVc.js";import"./piexpression-BYl4wdnl.js";import"./PiChecker-C53jXeXh.js";import"./PiRadian-CZmZSKYU.js";import"./TexCode.vue_vue_type_script_setup_true_lang-cbFUaS2n.js";import"./useStoreFlashMessage-Sme6zlyn.js";import"./PiMatrix.vue_vue_type_script_setup_true_lang-TzVt7_7L.js";import"./markdown-it-B_KdP_AI.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-DaOgEp9O.js";import"./markdown-it-attrs-CRciocxY.js";import"./markdown-it-bracketed-spans-BGrfw2K_.js";import"./markdown-it-texmath-DN_cb_w9.js";const I=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,io=$({__name:"matrice-augmentee",setup(O){const{restoreTool:y}=V(),e=y([{label:"matrice",type:"textarea",value:a(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix",attributes:{rows:5}},{label:"droite",type:"textarea",value:a(`1
8
7`),fromUrl:"droite",attributes:{rows:5}},{label:"nombre de décimales",type:"number",value:a(""),attributes:{min:0,max:4},message:"laisser vide pour le mode fraction"}]),p=u(()=>{const r=e[2].value.value;return r===""||r===void 0?0:+r}),c=u(()=>{try{const r=e[0].value.value.split(`
`),o=e[1].value.value.split(`
`);return{code:r.map((l,t)=>o[t]!==void 0&&o[t]!==""?`${l}|${o[t]}`:l).join(`
`),parameters:`${p.value?`,fixed=${p.value}`:""}`}}catch(r){return console.error(r),!1}});function d(){const o=Array(3).fill(0).map(()=>_.numberSym(5)),i=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>_.numberSym(9)));if(new A().fromVectors(...i.map(t=>new C(...t))).determinant().value===0)return d();i.forEach(t=>{const b=t.reduce((x,w,h)=>x+w*o[h],0);return t.push(b)}),e[0].value.value=i.map(t=>t.slice(0,-1).join(" ")).join(`
`),e[1].value.value=i.map(t=>t.slice(-1)[0]).join(`
`)}const n=a(!1);return(r,o)=>(m(),k("article",null,[s(S,{forms:v(e),rows:6,"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3","generate-button":"",onGenerate:d},null,8,["forms"]),c.value?(m(),f(N,{key:0},{default:g(()=>[s(q,{illustration:c.value},null,8,["illustration"]),T("div",null,[s(M,{active:n.value,icon:n.value?"bi bi-x-lg":"bi-eye",xs:"",onClick:o[0]||(o[0]=i=>n.value=!n.value)},{default:g(()=>[...o[1]||(o[1]=[B(" instructions ",-1)])]),_:1},8,["active","icon"]),j(s(E,{text:v(I)},null,8,["text"]),[[P,n.value]])])]),_:1})):(m(),f(G,{key:1}))]))}});export{io as default};
