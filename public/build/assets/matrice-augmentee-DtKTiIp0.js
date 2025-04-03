import{d as h,r as l,e as w,O as m,P as p,X as s,x as u,Q as f,U as $,W as j,Z as k,a6 as A}from"./@vue-DIJLJaP4.js";import{_ as S}from"./ToolForm.vue_vue_type_script_setup_true_lang-BiUmqDUJ.js";import{u as U}from"./useToolsStorage-D73Q6k0c.js";import{_ as q}from"./matrice-augmentee.vue_vue_type_script_setup_true_lang-BtFiR9HL.js";import{A as v,v as B,E as C}from"./pimath-BmIV-0gC.js";import{_ as E}from"./MarkdownIt.vue_vue_type_script_setup_true_lang-DKd_F26f.js";import{_ as M}from"./scButton.vue_vue_type_script_setup_true_lang-UhaWKCn8.js";import"./FormMaker-CgAQlv0z.js";import"./prismjs-DaKgDKei.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./pichecker-CjNBF3Pr.js";import"./@vueuse-hj9AkUrS.js";import"./axios-t--hEgTQ.js";import"./@inertiajs-CAfaw2U2.js";import"./deepmerge-CNAEnRIo.js";import"./qs-CU1evrZr.js";import"./side-channel-DYlKDdg6.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-DOG9iu2k.js";import"./side-channel-list-ENcchFmr.js";import"./side-channel-map-CK4JoW4l.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-ofhfeOe_.js";import"./lodash.clonedeep-CJhR_C8H.js";import"./lodash.isequal-CPvFPofB.js";import"./KeyboardBasic.vue_vue_type_script_setup_true_lang-CYD9cFp8.js";import"./KeyboardDisplay.vue_vue_type_script_setup_true_lang-DVHC8gLK.js";import"./keyboardConfig-B7aD2Fym.js";import"./app-BYQhXUkK.js";import"./three-mIjm4BAA.js";import"./katex-BwkeJf5B.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-uMEb0lIW.js";import"./vuedraggable-CW0VK3VS.js";import"./sortablejs-D5Oeo24j.js";import"./useKeyboard-t2SJ1hHJ.js";import"./scolcours-uHe_vGL_.js";import"./TexCode.vue_vue_type_script_setup_true_lang-DDqKlO1U.js";import"./markdown-it-C44Roubk.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-DileW-7G.js";import"./markdown-it-bracketed-spans-DdAGrLjA.js";import"./markdown-it-texmath-BCb-ta6r.js";const N=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
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
`,T={key:0,class:"my-10"},V={key:1,class:"text-red-700 text-sm"},It=h({__name:"matrice-augmentee",setup(O){const{restoreTool:g}=U(),r=g([{label:"matrice",type:"textarea",value:l(`2 1 -1
1 2 1
3 -1 2`),fromUrl:"matrix"},{label:"droite",type:"textarea",value:l(`1
8
7`),fromUrl:"droite"}]),d=w(()=>{try{const i=r[0].value.value.split(`
`),e=r[1].value.value.split(`
`);return{code:i.map((a,t)=>e[t]!==void 0&&e[t]!==""?`${a}|${e[t]}`:a).join(`
`),parameters:""}}catch(i){return console.error(i),!1}});function c(){const e=Array(3).fill(0).map(()=>v.numberSym(5)),o=Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>v.numberSym(9)));if(new B(...o.map(t=>new C(...t))).determinant().value===0)return c();o.forEach(t=>{const _=t.reduce((y,x,b)=>y+x*e[b],0);return t.push(_)}),r[0].value.value=o.map(t=>t.slice(0,-1).join(" ")).join(`
`),r[1].value.value=o.map(t=>t.slice(-1)[0]).join(`
`)}const n=l(!1);return(i,e)=>(p(),m("article",null,[s(S,{forms:u(r),"form-class":"max-w-xl mx-auto grid grid-cols-2 gap-3",rows:6,"generate-button":"",onGenerate:c},null,8,["forms"]),d.value?(p(),m("div",T,[s(q,{illustration:d.value},null,8,["illustration"]),f("div",null,[f("div",{class:"flex gap-3 justify-end cursor-pointer",onClick:e[0]||(e[0]=o=>n.value=!n.value)},[s(M,{icon:n.value?"bi bi-x-lg":"bi-eye",active:n.value,xs:""},{default:j(()=>e[1]||(e[1]=[k(" instructions ")])),_:1},8,["icon","active"])]),$(s(E,{text:u(N)},null,8,["text"]),[[A,n.value]])])])):(p(),m("div",V," Une erreur s'est produite avec vos données. "))]))}});export{It as default};
