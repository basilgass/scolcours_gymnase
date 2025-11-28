import{_ as s}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-DKsxTNLl.js";import{_ as p}from"./FormMaker.vue_vue_type_script_setup_true_lang-CwnXrQ5U.js";import{d,r as m,F as i,G as n,H as a,Q as l}from"./@vue-CXkTGxSa.js";import"./pithree-rKE-Jr4X.js";import"./katex-WNqlllh1.js";import"./@vueuse-D4xUVk1d.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./scolcours-Bv_19BdM.js";import"./@mermaid-js-k9rNGgmZ.js";import"./langium-D6IeNA9Z.js";import"./vscode-jsonrpc-CNa_m3dn.js";import"./chevrotain-CcLq-5Ko.js";import"./@chevrotain-DDB92SUb.js";import"./lodash-es-6mKN7T2K.js";import"./chevrotain-allstar-i0sJ2Ue_.js";import"./vscode-languageserver-types-NoPvPymt.js";import"./vscode-languageserver-textdocument-CKBVUiR3.js";import"./vscode-uri-BBKMTmn0.js";const c={ref:"root"},u={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},v={class:"flex flex-col gap-2"},U=d({__name:"DevThreeComponent",setup(f){const r=m("grid,axis"),o=m(`A(6,2,2)
B(3,8,3)
C(1,1,10)->*
p=plane A,B,C
O(0,0,6)->*
P=proj O,p
l=PA->w=2
v1=vPA,2->color=red,w=6
v2=vPB,3,1,0.5
a=arc A,P,B`);return o.value=`G(8,0,0)
H(0,4,0)
I(0,0,10)
p=plane G,H,I,20,15
A(6,6,6)->*,tex=A
B=proj A,p->tex=B
n=BA.->color=red,w=2
J(2,0,7)
C=proj J,p->tex=C
v=CA.
d=BC.->dash
a=arc B,A,C->mark
z=plane v,C->color=green/0.4`,(_,e)=>(n(),i("div",c,[e[2]||(e[2]=a("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1)),a("div",u,[a("div",v,[l(p,{"font-code":"",sm:"",modelValue:r.value,"onUpdate:modelValue":e[0]||(e[0]=t=>r.value=t)},null,8,["modelValue"]),l(p,{type:"codearea","font-code":"",sm:"",modelValue:o.value,"onUpdate:modelValue":e[1]||(e[1]=t=>o.value=t)},null,8,["modelValue"])]),l(s,{draw:{code:o.value,parameters:r.value}},null,8,["draw"])])],512))}});export{U as default};
