import{d as b,r as l,e as h,L as m,M as p,U as s,x as u,N as w,Q as $,S as k,W as A,a3 as S}from"./@vue-gDYJ05Qt.js";import{_ as j}from"./ToolForm.vue_vue_type_script_setup_true_lang-DV3L2g7U.js";import{u as M}from"./useToolsStorage-Sfc12fT-.js";import{_ as N}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-C5uKwYCB.js";import{A as f,v as U,E as q}from"./pimath-BmIV-0gC.js";import{_ as B}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-CsSBZH2m.js";import{_ as C}from"./scButton.vue_vue_type_script_setup_true_lang-B_TucnZY.js";import"./@braintree-BucCLNqb.js";import"./FormMaker-DReaHy7Z.js";import"./prismjs-CUys9W1u.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./PiChecker-Cw97MriN.js";import"./app-DIPUNzrV.js";import"./@mermaid-js-B-HYAf3V.js";import"./langium-CownM6op.js";import"./vscode-jsonrpc-1VOqS1Ai.js";import"./chevrotain-BwsBAYzG.js";import"./@chevrotain-kJs7c7WO.js";import"./lodash-es-DccjO_EN.js";import"./chevrotain-allstar-CMnDnFj0.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./axios-t--hEgTQ.js";import"./@inertiajs-YlGxZzMm.js";import"./deepmerge-CLxzff0U.js";import"./qs-B6hxnrgf.js";import"./side-channel-7X-A4zyn.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-CZv8ga43.js";import"./side-channel-list-DtJ4Nood.js";import"./side-channel-map-B2Lx6Rut.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-BaoccRX-.js";import"./lodash.clonedeep-S2_6BSz5.js";import"./lodash.isequal-BAKQf4nF.js";import"./katex-fqMHnS28.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-BVjY14m6.js";import"./vuedraggable-CB3tCRrq.js";import"./sortablejs-D5Oeo24j.js";import"./@vueuse-CIV6e3dx.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-Cnv-yWDD.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-MlxEv0wB.js";import"./keyboardConfig-BD9zgXQW.js";import"./useKeyboard-C_5Tn7Qp.js";import"./scolcours-S9QvrLXz.js";import"./TexCode.vue_vue_type_script_setup_true_lang-Hq4lWDfM.js";import"./PiMatrix.vue_vue_type_script_setup_true_lang-CnpPdlku.js";import"./markdown-it-C44Roubk.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-Dncz5xLo.js";import"./markdown-it-bracketed-spans-BD4AS4p_.js";import"./markdown-it-texmath-BewkJmun.js";const E=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,T={key:0,class:"my-10"},V={key:1,class:"text-red-700 text-sm"},Yt=b({__name:"matrice-augmentee",setup(z){const{restoreTool:v}=M(),r=v([{label:"matrice",type:"textarea",value:l(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:l(`1
8
7`),fromUrl:"droite"}]),d=h(()=>{try{const n=r[0].value.value.split(`
`),o=r[1].value.value.split(`
`);return{code:n.map((a,t)=>o[t]!==void 0&&o[t]!==""?`${a}|${o[t]}`:a).join(`
`),parameters:""}}catch(n){return console.error(n),!1}});function c(){const o=Array(3).fill(0).map(()=>f.numberSym(5)),e=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>f.numberSym(9)));if(new U(...e.map(t=>new q(...t))).determinant().value===0)return c();e.forEach(t=>{const _=t.reduce((g,y,x)=>g+y*o[x],0);return t.push(_)}),r[0].value.value=e.map(t=>t.slice(0,-1).join(" ")).join(`
`),r[1].value.value=e.map(t=>t.slice(-1)[0]).join(`
`)}const i=l(!1);return(n,o)=>(p(),m("article",null,[s(j,{forms:u(r),"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3",rows:6,"generate-button":"",onGenerate:c},null,8,["forms"]),d.value?(p(),m("div",T,[s(N,{illustration:d.value},null,8,["illustration"]),w("div",null,[s(C,{icon:i.value?"bi bi-x-lg":"bi-eye",active:i.value,xs:"",onClick:o[0]||(o[0]=e=>i.value=!i.value)},{default:k(()=>o[1]||(o[1]=[A(" instructions ")])),_:1},8,["icon","active"]),$(s(B,{text:u(E)},null,8,["text"]),[[S,i.value]])])])):(p(),m("div",V," Une erreur s'est produite avec vos données. "))]))}});export{Yt as default};
