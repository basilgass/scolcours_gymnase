import{d as b,r as l,e as h,F as m,G as p,Q as s,y as u,H as w,Y as $,P as k,Z as A,a3 as j}from"./@vue-1Dzwm3PV.js";import{_ as S}from"./ToolForm.vue_vue_type_script_setup_true_lang-B9aeinSe.js";import{u as q}from"./useToolsStorage-BcqsFAms.js";import{_ as B}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-BnImabE4.js";import{A as f,v as C,E}from"./pimath-Dqnz8tME.js";import{_ as M}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-BmAvl6XT.js";import{_ as N}from"./scButton.vue_vue_type_script_setup_true_lang-BClMegCa.js";import"./FormMaker.vue_vue_type_script_setup_true_lang-0leODX3l.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./scolcours-bH8RsBUV.js";import"./@mermaid-js-Ch7cOu3-.js";import"./langium-BswIKo8o.js";import"./vscode-jsonrpc-1VOqS1Ai.js";import"./chevrotain-BwsBAYzG.js";import"./@chevrotain-kJs7c7WO.js";import"./lodash-es-DccjO_EN.js";import"./chevrotain-allstar-CMnDnFj0.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./vscode-uri-CoxP0whD.js";import"./@vueuse-CWEsz3JE.js";import"./@inertiajs-Fw31XfvD.js";import"./qs-DdH_BQhP.js";import"./side-channel-DG-57Vhs.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-BA_lWL88.js";import"./@braintree-DtW683_T.js";import"./side-channel-list-I2ibK_sQ.js";import"./side-channel-map-iLDp7i1k.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-De_FFmmx.js";import"./axios-Dq7h7Pqt.js";import"./es-toolkit-SdXgwhWv.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-FmD_JUt4.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-DhfHrQIM.js";import"./keyboardConfig-KZYvyYXM.js";import"./app-Cz2E70Bq.js";import"./katex-CTLZhCE0.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-CCXfoU_C.js";import"./vuedraggable-B0iRrxY8.js";import"./sortablejs-D5Oeo24j.js";import"./dayjs-CwSjVP0V.js";import"./useKeyboard-C07i01SU.js";import"./PiChecker-DJCtprOx.js";import"./TexCode.vue_vue_type_script_setup_true_lang-WjyAcFkT.js";import"./PiMatrix.vue_vue_type_script_setup_true_lang-DHGIDPXT.js";import"./markdown-it-C44Roubk.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-DAiDLE5p.js";import"./markdown-it-bracketed-spans-BGPcQlH-.js";import"./markdown-it-texmath-CCroKQb5.js";const T=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,U={key:0,class:"my-10"},V={key:1,class:"text-red-700 text-sm"},Rt=b({__name:"matrice-augmentee",setup(G){const{restoreTool:v}=q(),r=v([{label:"matrice",type:"textarea",value:l(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:l(`1
8
7`),fromUrl:"droite"}]),d=h(()=>{try{const n=r[0].value.value.split(`
`),o=r[1].value.value.split(`
`);return{code:n.map((a,t)=>o[t]!==void 0&&o[t]!==""?`${a}|${o[t]}`:a).join(`
`),parameters:""}}catch(n){return console.error(n),!1}});function c(){const o=Array(3).fill(0).map(()=>f.numberSym(5)),e=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>f.numberSym(9)));if(new C(...e.map(t=>new E(...t))).determinant().value===0)return c();e.forEach(t=>{const _=t.reduce((g,y,x)=>g+y*o[x],0);return t.push(_)}),r[0].value.value=e.map(t=>t.slice(0,-1).join(" ")).join(`
`),r[1].value.value=e.map(t=>t.slice(-1)[0]).join(`
`)}const i=l(!1);return(n,o)=>(p(),m("article",null,[s(S,{forms:u(r),"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3",rows:6,"generate-button":"",onGenerate:c},null,8,["forms"]),d.value?(p(),m("div",U,[s(B,{illustration:d.value},null,8,["illustration"]),w("div",null,[s(N,{icon:i.value?"bi bi-x-lg":"bi-eye",active:i.value,xs:"",onClick:o[0]||(o[0]=e=>i.value=!i.value)},{default:k(()=>o[1]||(o[1]=[A(" instructions ")])),_:1,__:[1]},8,["icon","active"]),$(s(M,{text:u(T)},null,8,["text"]),[[j,i.value]])])])):(p(),m("div",V," Une erreur s'est produite avec vos données. "))]))}});export{Rt as default};
