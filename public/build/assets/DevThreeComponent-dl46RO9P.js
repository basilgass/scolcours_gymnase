import{_ as l}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-QWkLWprJ.js";import{F as i}from"./FormMaker-CpHtT_cI.js";import{d as s,r as a,O as d,P as n,Q as e,X as m}from"./@vue-sdZLaU5y.js";import"./pithree-Cf6hP5a-.js";import"./three-mIjm4BAA.js";import"./katex-BwkeJf5B.js";import"./@vueuse-C_-lITbw.js";import"./prismjs-BxWmPLb3.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./MarkdownIt.vue_vue_type_script_setup_true_lang-CY9U_kQF.js";import"./app-CAOFdafe.js";import"./axios-t--hEgTQ.js";import"./@inertiajs-BrvtfIgw.js";import"./deepmerge-D2xPuArj.js";import"./qs-BqfUvyCa.js";import"./side-channel-BeWElXr9.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-CadTYb9o.js";import"./side-channel-list-BN-t5Yqu.js";import"./side-channel-map-Cwyy2X9L.js";import"./get-intrinsic-BpLglCTt.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-DP1tGiab.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./get-proto-Cd0SCNDH.js";import"./dunder-proto-DSwuxXkl.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BuGV4nFB.js";import"./side-channel-weakmap-Bq3LDUt4.js";import"./lodash.clonedeep-Dv3wwXhk.js";import"./lodash.isequal-CyI_q7FX.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-C6VJa7WY.js";import"./vuedraggable-wbhjsz0Z.js";import"./sortablejs-D5Oeo24j.js";import"./markdown-it-Cjl7baE0.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-C00cla-y.js";import"./markdown-it-attrs-C_WAS53n.js";import"./markdown-it-bracketed-spans-D9No-qro.js";import"./markdown-it-texmath-B96J6Dg7.js";import"./pichecker-CjNBF3Pr.js";import"./pimath-BmIV-0gC.js";const c={ref:"root"},u={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},v={class:"flex flex-col gap-2"},vo=s({__name:"DevThreeComponent",setup(f){const t=a("grid,axis"),r=a(`A(6,2,2)
B(3,8,3)
C(1,1,10)->*
p=plane A,B,C
O(0,0,6)->*
P=proj O,p
l=PA->w=2
v1=vPA,2->color=red,w=6
v2=vPB,3,1,0.5
a=arc A,P,B`);return r.value=`G(8,0,0)
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
z=plane v,C->color=green/0.4`,(B,o)=>(n(),d("div",c,[o[2]||(o[2]=e("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1)),e("div",u,[e("div",v,[m(i,{"font-code":"",sm:"",modelValue:t.value,"onUpdate:modelValue":o[0]||(o[0]=p=>t.value=p)},null,8,["modelValue"]),m(i,{type:"code","font-code":"",sm:"",modelValue:r.value,"onUpdate:modelValue":o[1]||(o[1]=p=>r.value=p)},null,8,["modelValue"])]),m(l,{draw:{code:r.value,parameters:t.value}},null,8,["draw"])])],512))}});export{vo as default};
