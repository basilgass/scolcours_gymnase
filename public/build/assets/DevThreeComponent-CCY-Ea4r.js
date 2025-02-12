import{_ as l}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-Fa3nzGOS.js";import{F as i}from"./FormMaker-CuDfJmeV.js";import{d as s,r as a,M as d,N as n,O as p,V as m}from"./@vue-B1atfvPT.js";import"./pithree-Cf6hP5a-.js";import"./three-mIjm4BAA.js";import"./katex-BwkeJf5B.js";import"./@vueuse-Bjov0WDj.js";import"./prismjs-CzNyfocm.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./MarkdownIt.vue_vue_type_script_setup_true_lang-ZtXi2_qB.js";import"./app-BzRU_U4k.js";import"./axios-DW_MHI2K.js";import"./@inertiajs-bqNFFD8l.js";import"./deepmerge-DYc9sTIk.js";import"./qs-Dc3CMCTo.js";import"./side-channel-BCqfJLjk.js";import"./es-errors-CxTyLFAO.js";import"./object-inspect-DNot6zoa.js";import"./side-channel-list-BTO4f3xb.js";import"./side-channel-map-BzZJG5Hu.js";import"./get-intrinsic-m34C-byh.js";import"./es-object-atoms-BR76m4z7.js";import"./math-intrinsics-BThqFkWd.js";import"./gopd-C1lCZ5Qs.js";import"./es-define-property-D_7cP-M3.js";import"./has-symbols-BaUvM3gb.js";import"./dunder-proto-4A-Hd23v.js";import"./call-bind-apply-helpers-VtLnLD2e.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bound-BrcNDPeR.js";import"./side-channel-weakmap-GQxnF5Do.js";import"./lodash.clonedeep-lM28deSX.js";import"./lodash.isequal-C23JFg8q.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-CynK0Ong.js";import"./vuedraggable-_-rw2HzK.js";import"./sortablejs-D5Oeo24j.js";import"./markdown-it-Cjl7baE0.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-C00cla-y.js";import"./markdown-it-attrs-BX3QKz2C.js";import"./markdown-it-bracketed-spans-DrhPpPH4.js";import"./markdown-it-texmath-BfQr4OJx.js";import"./pichecker-CjNBF3Pr.js";import"./pimath-Fn0Dw1IZ.js";const c={ref:"root"},u={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},v={class:"flex flex-col gap-2"},uo=s({__name:"DevThreeComponent",setup(f){const t=a("grid,axis"),r=a(`A(6,2,2)
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
z=plane v,C->color=green/0.4`,(B,o)=>(n(),d("div",c,[o[2]||(o[2]=p("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1)),p("div",u,[p("div",v,[m(i,{"font-code":"",sm:"",modelValue:t.value,"onUpdate:modelValue":o[0]||(o[0]=e=>t.value=e)},null,8,["modelValue"]),m(i,{type:"code","font-code":"",sm:"",modelValue:r.value,"onUpdate:modelValue":o[1]||(o[1]=e=>r.value=e)},null,8,["modelValue"])]),m(l,{draw:{code:r.value,parameters:t.value}},null,8,["draw"])])],512))}});export{uo as default};
