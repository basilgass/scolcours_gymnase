import{_ as l}from"./PiThreeParser.vue_vue_type_script_setup_true_lang-DsbY9hlW.js";import{F as i}from"./FormMaker-B4NZuDlR.js";import{d as s,r as a,L as d,M as n,N as p,Q as m}from"./@vue-NxZnWEKa.js";import"./pithree-pVJO8Rx2.js";import"./three-COR8XSb1.js";import"./katex-D4dgI7qw.js";import"./@vueuse-BWhnoK3Q.js";import"./prismjs-BphaXbI4.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./checkersConfig-CSiDt3Gi.js";import"./app-BE-qAybe.js";import"./axios-DXsv3KKR.js";import"./@inertiajs-D9_Se4Y6.js";import"./deepmerge-BWfUUJNu.js";import"./qs-CsIUgwCt.js";import"./side-channel-BmA-C36d.js";import"./get-intrinsic-Bzk32PHg.js";import"./es-errors-zELpgxky.js";import"./has-symbols-CABd5qHC.js";import"./has-proto-3s11jRC3.js";import"./function-bind-CHqF18-c.js";import"./hasown-DwiY0sux.js";import"./call-bind-BJQCGQV4.js";import"./set-function-length-CEJfhDHo.js";import"./define-data-property-gCwxR-G4.js";import"./es-define-property-DCjO5mlL.js";import"./gopd-Cs0sslSg.js";import"./has-property-descriptors-DJBy-3Oq.js";import"./object-inspect-_ep2lGtT.js";import"./nprogress-DyqJRtAM.js";import"./lodash.clonedeep-DwMVg3N6.js";import"./lodash.isequal-BGud58mT.js";import"./laravel-vite-plugin-DEL3ZhID.js";import"./pinia-B8pPyz7l.js";import"./vuedraggable-BHGg4KdZ.js";import"./sortablejs-D5Oeo24j.js";import"./pimath-qcbX-Z2q.js";import"./MarkdownIt.vue_vue_type_script_setup_true_lang-BaFpcdeH.js";import"./markdown-it-DI8MEbma.js";import"./mdurl-k9Sl0PQj.js";import"./uc.micro-kMc2yuuw.js";import"./entities-C20TfXL6.js";import"./linkify-it-DmNjr4Kv.js";import"./punycode.js-Dj65hjkv.js";import"./markdown-it-attrs-DOiNCoDa.js";import"./markdown-it-bracketed-spans-DYniwTOl.js";import"./markdown-it-texmath-BqiHPLKt.js";const c={ref:"root"},u={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},v={class:"flex flex-col gap-2"},no=s({__name:"DevThreeComponent",setup(f){const t=a("grid,axis"),r=a(`A(6,2,2)
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
z=plane v,C->color=green/0.4`,(B,o)=>(d(),n("div",c,[o[2]||(o[2]=p("h1",{class:"text-2xl"}," Test de Three.js avec composant ",-1)),p("div",u,[p("div",v,[m(i,{"font-code":"",sm:"",modelValue:t.value,"onUpdate:modelValue":o[0]||(o[0]=e=>t.value=e)},null,8,["modelValue"]),m(i,{type:"code","font-code":"",sm:"",modelValue:r.value,"onUpdate:modelValue":o[1]||(o[1]=e=>r.value=e)},null,8,["modelValue"])]),m(l,{draw:{code:r.value,parameters:t.value}},null,8,["draw"])])],512))}});export{no as default};
